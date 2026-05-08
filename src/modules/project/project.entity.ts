import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
