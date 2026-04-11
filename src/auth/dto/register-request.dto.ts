import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: "test" })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "secret" })
  @IsNotEmpty()
  password: string;
}
