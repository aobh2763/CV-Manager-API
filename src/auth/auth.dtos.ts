import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'johndoe' })
  username!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  password!: string;
}
