import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skill/skill.entity';
import { User } from '../user/user.entity';
import { CvEventsService } from './cv-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, User, Skill])],
  controllers: [CvController],
  providers: [CvService, CvEventsService],
})
export class CvModule {}
