import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../../common/base.controller';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dtos';

@ApiTags('user')
@Controller('user')
export class UserController extends BaseController(User) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createWithDto(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.updateWithDto(id, dto);
  }
}
