import { ApiProperty } from '@nestjs/swagger';

export class CreateCvDto {
  @ApiProperty({ example: 'Doe' })
  name!: string;

  @ApiProperty({ example: 'John' })
  firstName!: string;

  @ApiProperty({ example: 30 })
  age!: number;

  @ApiProperty({ example: 12345678 })
  CIN!: number;

  @ApiProperty({ example: 'Software Engineer' })
  job!: string;

  @ApiProperty({ example: '/path/to/cv.pdf' })
  path!: string;

  @ApiProperty({ example: 1, description: 'ID of the user who owns this CV' })
  userId!: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs of the skills associated with this CV',
  })
  skillIds!: number[];
}

export class UpdateCvDto {
  @ApiProperty({ example: 'Doe' })
  name?: string;

  @ApiProperty({ example: 'John' })
  firstName?: string;

  @ApiProperty({ example: 30 })
  age?: number;

  @ApiProperty({ example: 12345678 })
  CIN?: number;

  @ApiProperty({ example: 'Software Engineer' })
  job?: string;

  @ApiProperty({ example: '/path/to/cv.pdf' })
  path?: string;

  @ApiProperty({ example: 1, description: 'ID of the user who owns this CV' })
  userId?: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs of the skills associated with this CV',
  })
  skillIds?: number[];
}
