import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';
import { BaseController } from '../../common/base.controller';
import { ApiTags } from '@nestjs/swagger';
import { CreateSkillDto, UpdateSkillDto } from './skill.dtos';

@ApiTags('skill')
@Controller('skill')
export class SkillController extends BaseController(Skill) {
  constructor(private readonly skillService: SkillService) {
    super(skillService);
  }

  @Post()
  create(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.skillService.createWithDto(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateSkillDto,
  ): Promise<Skill | null> {
    return this.skillService.updateWithDto(id, dto);
  }
}
