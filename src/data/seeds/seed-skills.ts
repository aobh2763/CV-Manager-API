import { AppDataSource } from '../data-source';
import { Skill } from '../../modules/skill/skill.entity';
import { createSkills } from '../factories/skill.factory';

async function seedSkills() {
  await AppDataSource.initialize();
  const skillRepo = AppDataSource.getRepository(Skill);
  const skills = skillRepo.create(createSkills(10));
  await skillRepo.save(skills);
  console.log('Skills seeded!');
  process.exit();
}

seedSkills();
