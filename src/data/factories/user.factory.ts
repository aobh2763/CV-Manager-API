import { randUserName, randEmail, randPassword } from '@ngneat/falso';
import { User, UserRole } from '../../modules/user/user.entity';
import * as bcrypt from 'bcrypt'

export const createUser = (): Partial<User> => {
  const salt = bcrypt.genSaltSync();

  return {
    username: randUserName(),
    email: randEmail(),
    password: bcrypt.hashSync(randPassword(), salt),
    role: UserRole.USER,
  };
};

export const createUsers = (count: number): Partial<User>[] => {
  return Array.from({ length: count }, () => createUser());
};
