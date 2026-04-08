import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { BaseService } from '../../common/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User) private readonly UserRepository: Repository<User>,
  ) {
    super(UserRepository);
  }
}
