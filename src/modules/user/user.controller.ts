import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../../common/base.controller';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController extends BaseController(User) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
