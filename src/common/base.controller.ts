import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BaseService } from './base.service';
import { ObjectLiteral } from 'typeorm';

export class BaseController<T extends ObjectLiteral> {
  constructor(protected readonly service: BaseService<T>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
  @Post()
  create(@Body() body: any) {
  return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<T>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
