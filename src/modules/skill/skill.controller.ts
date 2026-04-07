import { Controller } from '@nestjs/common';
import { SkillService } from './skill.service';
import { Skill } from './skill.entity';
import { BaseController } from '../../common/base.controller';

@Controller('skill')
export class SkillController extends BaseController<Skill> {
  constructor(private readonly skillService: SkillService) {
    super(skillService);
  }
}
