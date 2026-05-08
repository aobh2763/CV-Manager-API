import { Inject, Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UserRole } from '../modules/user/user.entity';
import chalk from 'chalk';

@Injectable()
export class ChatHandler {
  constructor(@Inject() private readonly chatService: ChatService) {}

  private getClientOrFail(client: Socket) {
    const clientData = this.chatService.getClientAttributes(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return null;
    }

    return clientData;
  }

  color(client: Socket, data: { color: string }) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

    if (clientData.authenticated) {
      // eslint-disable-next-line prettier/prettier
      const validColors = [ 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'gray'];

      if (!validColors.includes(data.color)) {
        client.emit(
          'server:error',
          `Invalid color! Valid options are: ${validColors.join(', ')}`,
        );
        return;
      }

      this.chatService.updateClientColor(client.id, data.color);

      client.emit(
        'server:success',
        `Your color has been changed to ${data.color}!`,
      );
    } else {
      client.emit(
        'server:error',
        'Only authenticated users can change their color!',
      );
    }
  }

  message(data: { to: string; msg: string }, client: Socket, server: Server) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

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

    server.to(recipientId).emit('message:private:received', messageToSend);
    client.emit('message:private:sent', messageToSend);
  }

  reply(data: { msg: string }, client: Socket, server: Server) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

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

    server.to(recipientId).emit('message:private:received', messageToSend);
    client.emit('message:private:sent', messageToSend);
  }

  list(client: Socket) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

    let usernames = '';

    this.chatService.getClients().forEach((attributes) => {
      if (attributes.username) {
        usernames += `${chalk[attributes.color](attributes.username)}, `;
      }
    });

    client.emit(
      'server:response',
      `Connected users(${this.chatService.getClients().size}): ${usernames.slice(0, -2)}`,
    );
  }

  kick(data: { user: string; reason: string }, client: Socket, server: Server) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

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

    server.to(targetClientId).emit('terminate', {
      reason: data.reason != '' ? data.reason : 'No reason provided',
    });
    client.broadcast.emit(
      'server:log',
      `${data.user} has been kicked from the chat! Reason: ${data.reason != '' ? data.reason : 'No reason provided'}`,
    );
  }

  quote(data: { id: string; msg: string }, client: Socket, server: Server) {
    const clientData = this.getClientOrFail(client);
    if (!clientData) return;

    const messageToQuote = this.chatService
      .getMessageHistory()
      .find((msg) => msg.id === data.id);

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

    server.emit('message:quote', messageToSend);
  }
}
