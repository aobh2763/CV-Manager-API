import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatGateway],
})
export class ChatModule {}
