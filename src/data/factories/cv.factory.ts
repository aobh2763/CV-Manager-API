import {
  randFirstName,
  randLastName,
  randNumber,
  randJobTitle,
  randFilePath,
} from '@ngneat/falso';
import { Cv } from '../../modules/cv/cv.entity';

export const createCv = (): Partial<Cv> => {
  return {
    name: randLastName(),
    firstName: randFirstName(),
    age: randNumber({ min: 20, max: 62 }),
    CIN: randNumber({ min: 1, max: 15000000 }),
    job: randJobTitle(),
    path: randFilePath(),
  };
};

export const createCvs = (count: number): Partial<Cv>[] => {
  return Array.from({ length: count }, () => createCv());
};
