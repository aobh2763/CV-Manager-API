import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './cv.entity';
import { BaseController } from '../../common/base.controller';
import { ApiTags } from '@nestjs/swagger';
import { CreateCvDto } from './cv.dtos';

@ApiTags('cv')
@Controller('cv')
export class CvController extends BaseController(Cv) {
  constructor(private readonly cvService: CvService) {
    super(cvService);
  }

  @Post()
  create(@Body() dto: CreateCvDto): Promise<Cv> {
    return this.cvService.createWithDto(dto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: CreateCvDto,
  ): Promise<Cv | null> {
    return this.cvService.updateWithDto(id, dto);
  }
}
