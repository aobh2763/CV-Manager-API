import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './cv.entity';
import { BaseController } from '../../common/base.controller';
import { ApiTags } from '@nestjs/swagger';
import { CreateCvDto } from './cv.dtos';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('cv')
@Controller('cv')
export class CvController extends BaseController(Cv) {
  constructor(private readonly cvService: CvService) {
    super(cvService);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: CreateCvDto): Promise<Cv> {
    return this.cvService.createWithDto(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: number,
    @Body() dto: CreateCvDto,
  ): Promise<Cv | null> {
    return this.cvService.updateWithDto(id, dto);
  }
}
