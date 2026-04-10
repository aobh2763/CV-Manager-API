import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './user.dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {
    super(UserRepository);
  }

  async createWithDto(dto: CreateUserDto): Promise<User> {
    const user = this.UserRepository.create(dto);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    user.password = hashedPassword;
    return this.UserRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.UserRepository.findOneBy({ email });
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
