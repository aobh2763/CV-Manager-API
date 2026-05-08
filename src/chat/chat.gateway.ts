import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Inject } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { ChatService } from './chat.service';
import chalk from 'chalk';
import { UserRole } from '../modules/user/user.entity';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

@WebSocketGateway({
  namespace: 'chat',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject() private readonly chatService: ChatService,
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly userService: UserService,
  ) {}

  async handleConnection(
    @ConnectedSocket() client: Socket
  ) {
    const token = client.handshake.auth.token;

    try {
      const decoded = await this.authService.decodeToken(token);

      const user = await this.userService.findOne(decoded.id);

      if (!user) {
        throw new Error('User not found');
      }

      if (this.chatService.getClientId(user.username)) {
        client.emit('terminate', { reason: 'Logged in from another location' });

        client.disconnect();
        return;
      }

      this.chatService.addClient(client.id, {
        authenticated: true,
        username: user.username,
        role: user.role == 'admin' ? UserRole.ADMIN : UserRole.USER,
        color: user.role == 'admin' ? 'red' : 'white',
      });
    } catch (error) {
      client.emit('server:error', 'Authentication failed! You will be a GUEST.');

      this.chatService.addClient(client.id, {
        authenticated: false,
        username: `GUEST_${client.id.substring(0, 5)}`,
        role: UserRole.USER,
        color: 'gray',
      });
    }

    client.emit('message:history', this.chatService.getMessageHistory());

    client.emit('server:success', 'Welcome to the server!');
    client.emit('server:success', `Connected as: ${this.chatService.getClientAttributes(client.id)?.username}`);

    client.broadcast.emit('server:log', `${this.chatService.getClientAttributes(client.id)?.username} has joined the chat!`);
  }

  handleDisconnect(client: Socket) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    client.broadcast.emit('server:log', `${clientData.username} has left the chat!`);

    console.log('client disconnected:', client.id);
    this.chatService.removeClient(client.id);
  }

  @SubscribeMessage('message:send')
  handleMessageSent(
    @MessageBody() data: { message: string }, 
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    const cleanedMessage = this.chatService.filterMessage(data.message);

    const messageToSend = {
      id : "",
      message: cleanedMessage,
      sender: clientData.username,
      color: clientData.color,
    };

    const msgId = this.chatService.addMessageToHistory(messageToSend);
    
    messageToSend.id = msgId;
    this.server.emit('message:receive', messageToSend);
  }

  @SubscribeMessage('command:color')
  handleColorCommand(
    @MessageBody() data: { color: string },
    @ConnectedSocket() client: Socket
  ) {
    console.log("here");
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    if (clientData.authenticated) {
      const validColors = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'gray'];

      if (!validColors.includes(data.color)) {
        client.emit('server:error', `Invalid color! Valid options are: ${validColors.join(', ')}`);
        return;
      }

      this.chatService.updateClientColor(client.id, data.color);

      client.emit('server:success', `Your color has been changed to ${data.color}!`);
    } else {
      client.emit('server:error', 'Only authenticated users can change their color!');
    }
  }

  @SubscribeMessage('command:message')
  handleMessageCommand(
    @MessageBody() data: { to: string; msg: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    const recipientId = this.chatService.getClientId(data.to);

    if (!recipientId) {
      client.emit('server:error', 'User not found');
      return;
    }

    const recipient = this.chatService.getClientAttributes(recipientId);

    if (!recipient) {
      client.emit('server:error', 'User not found');
      return;
    }
    
    this.chatService.updateLastPrivateMessageFrom(recipientId, client.id);
    this.chatService.updateLastPrivateMessageFrom(client.id, recipientId);

    const cleanedMessage = this.chatService.filterMessage(data.msg);

    const messageToSend = {
      message: cleanedMessage,
      sender: clientData.username,
      color: clientData.color,
    };

    this.server.to(recipientId).emit('message:private:received', messageToSend);
    client.emit('message:private:sent', messageToSend);
  }

  @SubscribeMessage('command:reply')
  handleReplyCommand(
    @MessageBody() data: { msg: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    if (!clientData.lastPrivateMessageFrom) {
      client.emit('server:error', 'No one has sent you a private message yet!');
      return;
    }

    const recipientId = clientData.lastPrivateMessageFrom;

    const recipient = this.chatService.getClientAttributes(recipientId);

    if (!recipient) {
      client.emit('server:error', 'User left the chat!');
      return;
    }

    this.chatService.updateLastPrivateMessageFrom(recipientId, client.id);
    this.chatService.updateLastPrivateMessageFrom(client.id, recipientId);

    const cleanedMessage = this.chatService.filterMessage(data.msg);

    const messageToSend = {
      message: cleanedMessage,
      sender: clientData.username,
      color: clientData.color,
    };

    this.server.to(recipientId).emit('message:private:received', messageToSend);
    client.emit('message:private:sent', messageToSend);
  }

  @SubscribeMessage('command:list')
  handleListCommand(
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    let usernames = "";

    this.chatService.getClients().forEach((attributes) => {
      if (attributes.username) {
        usernames += `${chalk[attributes.color](attributes.username)}, `;
      }
    });

    client.emit('server:response', `Connected users(${this.chatService.getClients().size}): ${usernames.slice(0, -2)}`);
  }

  @SubscribeMessage('command:kick')
  handleKickCommand(
    @MessageBody() data: { user: string; reason: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    if (clientData.role !== UserRole.ADMIN) {
      client.emit('server:error', 'Only admins can kick users!');
      return;
    }

    const targetClientId = this.chatService.getClientId(data.user);

    if (!targetClientId) {
      client.emit('server:error', 'User not found');
      return;
    }

    const targetClient = this.chatService.getClientAttributes(targetClientId);

    if (!targetClient) {
      client.emit('server:error', 'User not found');
      return;
    }

    this.server.to(targetClientId).emit('terminate', { reason: data.reason != '' ? data.reason : 'No reason provided' });
  }

  @SubscribeMessage('command:quote')
  handleQuoteCommand(
    @MessageBody() data: { id: string; msg: string },
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    const messageToQuote = this.chatService.getMessageHistory().find(msg => msg.id === data.id);

    if (!messageToQuote) {
      client.emit('server:error', 'Message not found');
      return;
    }

    const cleanedMessage = this.chatService.filterMessage(data.msg);

    const messageToSend = {
      quotedMsg: messageToQuote,
      message: cleanedMessage,
      color: clientData.color,
      sender: clientData.username,
    };

    this.server.emit('message:quote', messageToSend);
  }
}
