import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dtos';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {
    super(UserRepository);
  }

  async createWithDto(dto: CreateUserDto): Promise<User> {
    const user = this.UserRepository.create(dto);
    return this.UserRepository.save(user);
  }

  async updateWithDto(id: number, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.UserRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    Object.assign(user, dto);
    return this.UserRepository.save(user);
  }
}
