import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Skill } from './skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService extends BaseService<Skill>{
    constructor(@InjectRepository(Skill) private readonly skillRepository: Repository<Skill>) {
        super(skillRepository);
    }
}
