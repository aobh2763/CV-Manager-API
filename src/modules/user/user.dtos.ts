import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.entity';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  username!: string;

  @ApiProperty({ example: 'johndoe' })
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  password!: string;

  @ApiProperty({ example: 'user' })
  role!: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) { }
