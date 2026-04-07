import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Skill } from '../skill/skill.entity';
import { User }  from '../user/user.entity';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  firstName!: string;

  @Column()
  age!: number;

  @Column()
  CIN!: number;

  @Column()
  job!: string;

  @Column()
  path!: string;

  @ManyToMany(() => Skill, skill => skill.cvs)
  @JoinTable()                   
  skills!: Skill[];

  @ManyToOne(() => User, user => user.cvs)
  user!: User;
}