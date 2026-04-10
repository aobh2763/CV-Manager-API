import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'Programming' })
  @IsNotEmpty()
  designation: string;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
