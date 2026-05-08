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
import { UserRole } from '../modules/user/user.entity';
import { ChatHandler } from './chat.handler';

@WebSocketGateway({
  namespace: 'chat',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject() private readonly authService: AuthService,
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatService: ChatService,
    @Inject() private readonly chatHandler: ChatHandler,
  ) {}

  private getClientOrFail(client: Socket) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return null;
    }

    return clientData;
  }

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
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

    client.broadcast.emit('server:log', `${clientData.username} has left the chat!`);

    this.chatService.removeClient(client.id);
  }

  @SubscribeMessage('message:send')
  handleMessageSent(
    @MessageBody() data: { message: string }, 
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

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
    this.chatHandler.color(client, data);
  }

  @SubscribeMessage('command:message')
  handleMessageCommand(
    @MessageBody() data: { to: string; msg: string },
    @ConnectedSocket() client: Socket
  ) {
    this.chatHandler.message(data, client, this.server);
  }

  @SubscribeMessage('command:reply')
  handleReplyCommand(
    @MessageBody() data: { msg: string },
    @ConnectedSocket() client: Socket
  ) {
    this.chatHandler.reply(data, client, this.server);
  }

  @SubscribeMessage('command:list')
  handleListCommand(
    @ConnectedSocket() client: Socket
  ) {
    this.chatHandler.list(client);
  }

  @SubscribeMessage('command:kick')
  handleKickCommand(
    @MessageBody() data: { user: string; reason: string },
    @ConnectedSocket() client: Socket
  ) {
    this.chatHandler.kick(data, client, this.server);
  }

  @SubscribeMessage('command:quote')
  handleQuoteCommand(
    @MessageBody() data: { id: string; msg: string },
    @ConnectedSocket() client: Socket
  ) {
    this.chatHandler.quote(data, client, this.server);
  }
}
