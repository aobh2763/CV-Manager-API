import { ApiProperty } from '@nestjs/swagger';
import { Cv } from '../cv/cv.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id!: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'johndoe' })
  username!: string;

  @Column({ unique: true })
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @Column()
  @ApiProperty({ example: 'securepassword' })
  password!: string;

  @OneToMany(() => Cv, (cv) => cv.user)
  @ApiProperty({ type: () => [Cv] })
  cvs!: Cv[];
}
