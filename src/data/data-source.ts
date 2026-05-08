import { DataSource } from 'typeorm';
import { configDotenv } from 'dotenv';
import { Cv } from '../modules/cv/cv.entity';
import { User } from '../modules/user/user.entity';
import { Skill } from '../modules/skill/skill.entity';
import { Project } from '../modules/project/project.entity';

configDotenv();

export const AppDataSource = new DataSource({
  logging: false,
  synchronize: true,

  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST ?? 'localhost',
  type: process.env.DB_TYPE as any ?? 'mysql',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  entities: [User, Cv, Skill, Project],
});
