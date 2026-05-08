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

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

type ClientAttributes = {
  authenticated: boolean;
  username?: string;
};

@WebSocketGateway({
  namespace: 'chat',
  transports: ['websocket'],
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  clients: Map<string, ClientAttributes> = new Map();

  constructor(
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

      this.clients.set(client.id, {
        authenticated: true,
        username: user.username,
      });

      console.log('client connected:', client.id, 'username:', user.username);
    } catch (error) {
      client.emit('server:error', 'Authentication failed! You will be a GUEST.');

      this.clients.set(client.id, {
        authenticated: false,
        username: `GUEST_${client.id.substring(0, 5)}`,
      });
    }

    client.emit('server:success', 'Welcome to the server!');
    client.emit('server:success', `Connected as: ${this.clients.get(client.id)?.username}`);
    client.broadcast.emit('server:log', `${this.clients.get(client.id)?.username} has joined the chat!`);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnected:', client.id);
    this.clients.delete(client.id);
  }

  @SubscribeMessage('message:send')
  handleMessageSend(
    @MessageBody() data: { message: string }, 
    @ConnectedSocket() client: Socket
  ) {
    const clientData = this.clients.get(client.id);

    if (!clientData) {
      client.emit('server:error', 'Client data not found');
      return;
    }

    this.server.emit('message:send', {
      message: data.message,
      sender: clientData.username,
    });
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log('received:', data);

    return data;
  }
}
