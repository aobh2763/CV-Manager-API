import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Skill } from '../skill/skill.entity';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cv {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id!: number;

  @Column()
  @ApiProperty({ example: 'Doe' })
  name!: string;

  @Column()
  @ApiProperty({ example: 'John' })
  firstName!: string;

  @Column()
  @ApiProperty({ example: 30 })
  age!: number;

  @Column()
  @ApiProperty({ example: 12345678 })
  CIN!: number;

  @Column()
  @ApiProperty({ example: 'Software Engineer' })
  job!: string;

  @Column()
  @ApiProperty({ example: '/path/to/cv.pdf' })
  path!: string;

  @ManyToMany(() => Skill, (skill) => skill.cvs, { eager: true })
  @JoinTable()
  @ApiProperty({ type: () => [Skill] })
  skills!: Skill[];

  @ManyToOne(() => User, (user) => user.cvs, { eager: true })
  @ApiProperty({ type: () => User })
  user!: User;
}
