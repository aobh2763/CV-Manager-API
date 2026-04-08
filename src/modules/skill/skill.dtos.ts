import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'Programming' })
  designation!: string;
}

export class UpdateSkillDto {
  @ApiProperty({ example: 'Programming' })
  designation?: string;
}
