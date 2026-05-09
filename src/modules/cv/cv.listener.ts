import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { APP_EVENTS } from './config/event-const.config';
import { CvHistory } from './cv.history';
import { Cv } from './cv.entity';
import { User } from '../user/user.entity';

function buildSnapshot(cv: Cv): Record<string, any> {
  return {
    id: cv.id,
    name: cv.name,
    firstName: cv.firstName,
    age: cv.age,
    CIN: cv.CIN,
    job: cv.job,
    path: cv.path,
    skills:
      cv.skills?.map((s) => ({ id: s.id, designation: s.designation })) ?? [],
  };
}

@Injectable()
export class CvListener {
  constructor(
    @InjectRepository(CvHistory)
    private historyRepository: Repository<CvHistory>,
  ) {}

  @OnEvent(APP_EVENTS.addedCv)
  async handleCvAdded(payload: { cv: Cv; user: User }) {
    const history = this.historyRepository.create({
      action: 'CREATE',
      cvId: payload.cv.id,
      userId: payload.user.id,
      cvName: payload.cv.name,
      username: payload.user.username,
      snapshot: buildSnapshot(payload.cv), // 👈
    });
    await this.historyRepository.save(history);
  }

  @OnEvent(APP_EVENTS.updatedCv)
  async handleCvUpdated(payload: { cv: Cv; user: User }) {
    const history = this.historyRepository.create({
      action: 'UPDATE',
      cvId: payload.cv.id,
      userId: payload.user.id,
      cvName: payload.cv.name,
      username: payload.user.username,
      snapshot: buildSnapshot(payload.cv), // 👈
    });
    await this.historyRepository.save(history);
  }

  @OnEvent(APP_EVENTS.deltedCv)
  async handleCvDeleted(payload: { cv: Cv; user: User }) {
    const history = this.historyRepository.create({
      action: 'DELETE',
      cvId: payload.cv.id,
      userId: payload.user.id,
      cvName: payload.cv.name,
      username: payload.user.username,
      snapshot: buildSnapshot(payload.cv), // 👈
    });
    await this.historyRepository.save(history);
  }
}
