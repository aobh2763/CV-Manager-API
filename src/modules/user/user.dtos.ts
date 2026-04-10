import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.entity';
import { PartialType } from '@nestjs/mapped-types';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'johndoe' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
