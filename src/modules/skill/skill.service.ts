import { Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Skill } from './skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSkillDto, UpdateSkillDto } from './skill.dtos';

@Injectable()
export class SkillService extends BaseService<Skill> {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {
    super(skillRepository);
  }

  async createWithDto(dto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create({ designation: dto.designation });
    return this.skillRepository.save(skill);
  }

  async updateWithDto(id: number, dto: UpdateSkillDto): Promise<Skill | null> {
    const skill = await this.findOne(id);
    if (!skill) return null;
    Object.assign(skill, dto);
    return this.skillRepository.save(skill);
  }
}
