import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateCvDto {
  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 30 })
  @IsNotEmpty()
  age: number;

  @ApiProperty({ example: 12345678 })
  @IsNotEmpty()
  CIN: number;

  @ApiProperty({ example: 'Software Engineer' })
  @IsNotEmpty()
  job: string;

  @ApiProperty({ example: '/path/to/cv.pdf' })
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'IDs of the skills associated with this CV',
  })
  skillIds: number[];
}

export class UpdateCvDto extends PartialType(CreateCvDto) {}
