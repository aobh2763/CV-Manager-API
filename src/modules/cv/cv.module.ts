import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { Cv } from './cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '../skill/skill.entity';
import { User } from '../user/user.entity';
import { CvListener } from './cv.listener';
import { CvHistory } from './cv.history';
import { CvHistoryService } from './cv.history.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cv, User, Skill, CvHistory])],
  controllers: [CvController],
  providers: [CvService, CvListener, CvHistoryService],
})
export class CvModule {}
