import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'johndoe' })
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  password!: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ApiProperty({ example: 'johndoe' })
  email?: string;

  @ApiProperty({ example: 'securepassword' })
  password?: string;
}
