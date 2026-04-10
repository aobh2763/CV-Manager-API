import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { BaseController } from '../../common/base.controller';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './user.dtos';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../../auth/role.guard';
import { Role } from '../../auth/roles.decorator';

@ApiTags('user')
@Controller('user')
export class UserController extends BaseController(User) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createWithDto(dto);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role('admin')
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userService.updateWithDto(id, dto);
  }

  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.delete(id);
  }
}
