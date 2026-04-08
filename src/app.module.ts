import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './modules/cv/cv.module';
import { UserModule } from './modules/user/user.module';
import { SkillModule } from './modules/skill/skill.module';
import { AppDataSource } from './data/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    CvModule,
    SkillModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
