import { DataSource } from 'typeorm';
import { User } from '../modules/user/user.entity';
import { Cv } from '../modules/cv/cv.entity';
import { Skill } from '../modules/skill/skill.entity';
import { env } from '../../config/env';

export const AppDataSource = new DataSource({
  type: env.db.type,
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: true,
  logging: false,
  entities: [User, Cv, Skill],
  migrations: [],
  subscribers: [],
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
});
