// cv.history.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CvHistory } from './cv.history';

@Injectable()
export class CvHistoryService {
  constructor(
    @InjectRepository(CvHistory)
    private historyRepository: Repository<CvHistory>,
  ) {}

  findAll(): Promise<CvHistory[]> {
    return this.historyRepository.find({ order: { createdAt: 'DESC' } });
  }

  findByCvId(cvId: number): Promise<CvHistory[]> {
    return this.historyRepository.find({
      where: { cvId },
      order: { createdAt: 'DESC' },
    });
  }
}
