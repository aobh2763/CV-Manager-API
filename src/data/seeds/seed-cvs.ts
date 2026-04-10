import { AppDataSource } from '../data-source';
import { User } from '../../modules/user/user.entity';
import { Skill } from '../../modules/skill/skill.entity';
import { Cv } from '../../modules/cv/cv.entity';
import { createCvs } from '../factories/cv.factory';

async function seedCvs() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const skillRepo = AppDataSource.getRepository(Skill);
  const cvRepo = AppDataSource.getRepository(Cv);

  const users = await userRepo.find();
  const skills = await skillRepo.find();

  if (!users.length || !skills.length) {
    console.error('Run seed:users and seed:skills first!');
    process.exit(1);
  }

  const cvsData = createCvs(15);
  const cvs = cvsData.map((cv) => {
    const newCv = cvRepo.create(cv);
    newCv.user = users[Math.floor(Math.random() * users.length)];
    newCv.skills = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
    return newCv;
  });

  await cvRepo.save(cvs);
  console.log('CVs seeded!');
  process.exit();
}

seedCvs();
