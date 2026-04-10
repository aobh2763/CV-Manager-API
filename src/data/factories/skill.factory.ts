import { randSkill } from '@ngneat/falso';
import { Skill } from '../../modules/skill/skill.entity';

export const createSkill = (): Partial<Skill> => {
  return {
    designation: randSkill(),
  };
};

export const createSkills = (count: number): Partial<Skill>[] => {
  return Array.from({ length: count }, () => createSkill());
};
