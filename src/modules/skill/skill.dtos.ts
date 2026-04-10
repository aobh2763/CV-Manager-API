import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateSkillDto {
  @ApiProperty({ example: 'Programming' })
  designation!: string;
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
