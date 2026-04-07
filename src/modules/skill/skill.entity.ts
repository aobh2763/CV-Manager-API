import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Cv } from '../cv/cv.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  designation!: string;

  @ManyToMany(() => Cv, cv => cv.skills)
  cvs!: Cv[];
}