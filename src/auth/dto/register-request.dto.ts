import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
