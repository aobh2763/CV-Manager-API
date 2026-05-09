import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cv } from "../cv/cv.entity";

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, unique: false })
  repoUrl: string;

  @ManyToOne(() => Cv, (cv: Cv) => cv.projects)
  cv: Cv;
}
