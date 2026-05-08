import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../modules/user/user.module';
import { ChatHandler } from './chat.handler';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatGateway, ChatService, ChatHandler],
})
export class ChatModule {}
