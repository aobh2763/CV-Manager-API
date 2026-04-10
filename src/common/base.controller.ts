// src/common/base.controller.ts
import { Get, Post, Put, Delete, Param, Body, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { BaseService } from './base.service';
import { ObjectLiteral } from 'typeorm';

export function BaseController<T extends ObjectLiteral>(entity: Type<T>) {
  class BaseControllerHost {
    constructor(public readonly service: BaseService<T>) {}

    @Get()
    @ApiOperation({ summary: `Get all ${entity.name}` })
    findAll() {
      return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: `Get ${entity.name} by id` })
    findOne(@Param('id') id: number) {
      return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: `Create ${entity.name}` })
    create(@Body() body: Partial<T>) {
      return this.service.create(body);
    }

    @Put(':id')
    @ApiOperation({ summary: `Update ${entity.name}` })
    update(@Param('id') id: number, @Body() data: Partial<T>) {
      return this.service.update(id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: `Delete ${entity.name}` })
    remove(@Param('id') id: number) {
      return this.service.delete(id);
    }
  }

  return BaseControllerHost;
}
