import {Cv} from '../cv/cv.entity';

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  username!: string;

  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Cv, cv => cv.user)
  cvs!: Cv[];
}