import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Cv } from '../cv/cv.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: '1' })
  id!: string;

  @Column()
  @ApiProperty({ example: 'Programming' })
  designation!: string;

  @ManyToMany(() => Cv, (cv) => cv.skills)
  @ApiProperty({ type: () => [Cv] })
  cvs!: Cv[];
}
