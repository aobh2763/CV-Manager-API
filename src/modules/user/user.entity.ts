import { ApiProperty } from '@nestjs/swagger';
import { Cv } from '../cv/cv.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe' })
  username: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Column()
  password: string;

  @Column()
  @ApiProperty({ example: 'user' })
  role: UserRole;

  @OneToMany(() => Cv, (cv) => cv.user)
  @ApiProperty({ type: () => [Cv] })
  cvs: Cv[];
}
