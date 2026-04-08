import { AppDataSource } from '../data-source';
import { User } from '../../modules/user/user.entity';
import { Skill } from '../../modules/skill/skill.entity';
import { Cv } from '../../modules/cv/cv.entity';
import { createUsers } from '../factories/user.factory';
import { createSkills } from '../factories/skill.factory';
import { createCvs } from '../factories/cv.factory';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const skillRepo = AppDataSource.getRepository(Skill);
  const cvRepo = AppDataSource.getRepository(Cv);
  // Create skills
  const skills = skillRepo.create(createSkills(10));
  await skillRepo.save(skills);
  // Create users
  const users = userRepo.create(createUsers(5));
  await userRepo.save(users);
  // Create CVs
  const cvsData = cvRepo.create(createCvs(15));

  const cvs = cvsData.map((cv) => {
    const newCv = cvRepo.create(cv);
    newCv.user = users[Math.floor(Math.random() * users.length)];
    newCv.skills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
    return newCv;
  });

  await cvRepo.save(cvs);

  console.log('Database seeded!');
  process.exit();
}

seed();
