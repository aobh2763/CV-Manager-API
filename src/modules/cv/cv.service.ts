import { Injectable } from '@nestjs/common';
import { Cv } from './cv.entity';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CvService extends BaseService<Cv> {constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,) {
    super(cvRepository); 
  }
}
