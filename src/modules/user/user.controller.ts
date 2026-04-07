import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../../common/base.controller';
import { BaseService } from '../../common/base.service';
import { User } from './user.entity';

@Controller('user')
export class UserController extends BaseController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
