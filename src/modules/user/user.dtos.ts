import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'johndoe' })
  email!: string;

  @ApiProperty({ example: 'securepassword' })
  password!: string;

  @ApiProperty({ example: 'user' })
  role!: UserRole;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name?: string;

  @ApiProperty({ example: 'johndoe' })
  email?: string;

  @ApiProperty({ example: 'securepassword' })
  password?: string;

  @ApiProperty({ example: 'user' })
  role?: UserRole;
}
