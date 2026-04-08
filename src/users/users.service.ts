import bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@example.com',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@example.com',
      password: 'guess',
    },
  ];

  constructor() {
    this.users.forEach(async (user) => {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    });
  }

  async findOne(email: string) {
    return this.users.find(user => user.email === email);
  }
}

