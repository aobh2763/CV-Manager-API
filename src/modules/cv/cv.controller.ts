import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  Get,
  Request,
  Delete,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './cv.entity';
import { BaseController } from '../../common/base.controller';
import { ApiTags } from '@nestjs/swagger';
import { CreateCvDto, UpdateCvDto } from './cv.dtos';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('cv')
@Controller('cv')
export class CvController extends BaseController(Cv) {
  constructor(private readonly cvService: CvService) {
    super(cvService);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  createForCv(@Body() dto: CreateCvDto, @Request() req): Promise<Cv> {
    return this.cvService.createWithDto(dto, req.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  updateForCv(
    @Param('id') id: number,
    @Body() dto: UpdateCvDto,
    @Request() req,
  ): Promise<Cv | null> {
    return this.cvService.updateWithDto(id, dto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAllForCv(@Request() req) {
    return this.cvService.findAllForCV(req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: number, @Request() req): Promise<void> {
    return this.cvService.deleteForCv(id, req.user);
  }
}
