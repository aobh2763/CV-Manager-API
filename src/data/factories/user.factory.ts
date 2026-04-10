import { randUserName, randEmail, randPassword } from '@ngneat/falso';
import { User } from '../../modules/user/user.entity';

export const createUser = (): Partial<User> => {
  return {
    username: randUserName(),
    email: randEmail(),
    password: randPassword(),
  };
};

export const createUsers = (count: number): Partial<User>[] => {
  return Array.from({ length: count }, () => createUser());
};
