import { DataSource } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { Cv } from '../modules/cv/cv.entity';
import { Skill } from '../modules/skill/skill.entity';
import { configDotenv } from 'dotenv';

configDotenv();

console.log(process.env.DB_HOST);

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Cv, Skill],
  subscribers: [],
});
