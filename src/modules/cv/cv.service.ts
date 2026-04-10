import { Injectable } from '@nestjs/common';
import { Cv } from './cv.entity';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Skill } from '../skill/skill.entity';
import { CreateCvDto, UpdateCvDto } from './cv.dtos';

@Injectable()
export class CvService extends BaseService<Cv> {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {
    super(cvRepository);
  }

  async createWithDto(dto: CreateCvDto, userreq: User): Promise<Cv> {
    const userId = userreq.id;
    const skillIds = dto.skillIds;

    const user = userreq;
    const skills = await this.skillRepository.findBy({ id: In(skillIds) });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const cv = this.cvRepository.create({
      name: dto.name,
      firstName: dto.firstName,
      age: dto.age,
      CIN: dto.CIN,
      job: dto.job,
      path: dto.path,
      user,
      skills,
    });

    return this.cvRepository.save(cv);
  }

  async updateWithDto(
    id: number,
    dto: UpdateCvDto,
    userreq: User,
  ): Promise<Cv | null> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user', 'skills'],
    });
    if (!cv) return null;

    if (cv.user.id !== userreq.id && userreq.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const { skillIds, ...fields } = dto;

    if (skillIds !== undefined) {
      cv.skills = skillIds.length
        ? await this.skillRepository.findBy({ id: In(skillIds) })
        : [];
    }

    Object.assign(cv, fields);

    return this.cvRepository.save(cv);
  }

  async findAllForCV(user: User): Promise<Cv[]> {
    if (user.role === 'admin') {
      return this.cvRepository.find({ relations: ['user', 'skills'] });
    }
    return this.cvRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'skills'],
    });
  }

  async deleteForCv(id: number, user: User): Promise<void> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cv) {
      throw new Error(`CV with ID ${id} not found`);
    }
    if (cv.user.id !== user.id && user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    await this.cvRepository.remove(cv);
  }
}
