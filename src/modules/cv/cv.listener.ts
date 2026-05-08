import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { APP_EVENTS } from './config/event-const.config';
import { CvHistory } from './cv.history';

@Injectable()
export class CvListener {
  constructor(
    @InjectRepository(CvHistory)
    private historyRepository: Repository<CvHistory>,
  ) {}

  @OnEvent(APP_EVENTS.addedCv)
  async handleCvAdded(payload: any) {
    console.log('CV Added Event Received:', payload);
    const history = this.historyRepository.create({
      action: 'CREATE',
      cvId: payload.cv.id,
      cvName: payload.cv.name,
      username: payload.user.username,
    });

    await this.historyRepository.save(history);
  }

  @OnEvent(APP_EVENTS.updatedCv)
  async handleCvUpdated(payload: any) {
    const history = this.historyRepository.create({
      action: 'UPDATE',
      cvId: payload.cv.id,
      userId: payload.user.id,
      cvName: payload.cv.name,
      username: payload.user.username,
    });

    await this.historyRepository.save(history);
  }

  @OnEvent(APP_EVENTS.deltedCv)
  async handleCvDeleted(payload: any) {
    const history = this.historyRepository.create({
      action: 'DELETE',
      cvId: payload.cv.id,
      userId: payload.user.id,
      cvName: payload.cv.name,
      username: payload.user.username,
    });

    await this.historyRepository.save(history);
  }
}
