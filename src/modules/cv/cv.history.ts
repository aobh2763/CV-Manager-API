import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CvHistory {
  @ApiProperty({ example: 1, description: 'Auto-incremented primary key' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'CREATE',
    enum: ['CREATE', 'UPDATE', 'DELETE'],
    description: 'The action performed on the CV',
  })
  @Column()
  action: string;

  @ApiProperty({ example: 42, description: 'ID of the affected CV' })
  @Column()
  cvId: number;

  @ApiProperty({
    example: 7,
    description: 'ID of the user who performed the action',
  })
  @Column()
  userId: number;

  @ApiProperty({ example: 'John Doe', description: 'Name of the affected CV' })
  @Column()
  cvName: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'Username of the user who performed the action',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'Full snapshot of the CV at the time of the action',
    example: {
      id: 1,
      name: 'Doe',
      firstName: 'John',
      age: 30,
      job: 'Dev',
      skills: [],
    },
  })
  @Column({ type: 'json', nullable: true })
  snapshot: Record<string, any>;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Timestamp of when the action occurred',
  })
  @CreateDateColumn()
  createdAt: Date;
}
