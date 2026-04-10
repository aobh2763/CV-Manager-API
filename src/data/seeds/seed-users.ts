import { AppDataSource } from '../data-source';
import { User } from '../../modules/user/user.entity';
import { createUsers } from '../factories/user.factory';

async function seedUsers() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const users = userRepo.create(createUsers(5));
  await userRepo.save(users);
  console.log('Users seeded!');
  process.exit();
}

seedUsers();
