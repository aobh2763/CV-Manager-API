import { Injectable } from '@nestjs/common';
import leoProfanity from 'leo-profanity';
import * as emoji from 'node-emoji';
import { UserRole } from '../modules/user/user.entity';
import { randomBytes } from 'crypto';

export type ClientAttributes = {
  authenticated: boolean;
  username: string;
  role: UserRole;
  color: string;
  lastPrivateMessageFrom?: string;
};

type Message = {
  id: string;
  sender: string | undefined;
  message: string;
  color: string;
};

@Injectable()
export class ChatService {
  clients: Map<string, ClientAttributes> = new Map();
  usernamesToClientIds: Map<string, string> = new Map();

  history: Message[] = [];
  historyLimit: number = 25;

  getClientAttributes(clientId: string): ClientAttributes | undefined {
    return this.clients.get(clientId);
  }

  getClientId(username: string): string | undefined {
    return this.usernamesToClientIds.get(username);
  }

  addClient(clientId: string, attributes: ClientAttributes): void {
    this.usernamesToClientIds.set(
      attributes.username || `GUEST_${clientId.substring(0, 5)}`,
      clientId,
    );

    this.clients.set(clientId, attributes);
  }

  removeClient(clientId: string): void {
    const attributes = this.clients.get(clientId);

    if (attributes?.username) {
      this.usernamesToClientIds.delete(attributes.username);
    }

    this.clients.delete(clientId);
  }

  getClients(): Map<string, ClientAttributes> {
    return this.clients;
  }

  updateClientColor(clientId: string, color: string): void {
    const attributes = this.clients.get(clientId);

    if (attributes) {
      attributes.color = color;
      this.clients.set(clientId, attributes);
    }
  }

  updateLastPrivateMessageFrom(clientId: string, senderId: string): void {
    const attributes = this.clients.get(clientId);

    if (attributes) {
      attributes.lastPrivateMessageFrom = senderId;
      this.clients.set(clientId, attributes);
    }
  }

  addMessageToHistory(message: Message): string {
    const msgId = randomBytes(4).toString('hex');
    const messageWithId = { ...message, id: msgId };

    this.history.push(messageWithId);

    if (this.history.length > this.historyLimit) {
      this.history.shift();
    }

    return msgId;
  }

  getMessageHistory(): Message[] {
    return this.history;
  }

  filterMessage(message: string): string {
    leoProfanity.remove(['hell', 'damn']);

    const cleaned = leoProfanity.clean(message);

    const emojified = emoji.emojify(cleaned);

    return emojified;
  }
}
