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
  Sse
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CvEventsService } from './cv-events.service';
import { Cv } from './cv.entity';
import { ApiBody, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { CreateCvDto, UpdateCvDto } from './cv.dtos';
import { AuthGuard } from '@nestjs/passport';
import { fromEvent } from 'rxjs';

@ApiTags('cv')
@ApiExtraModels(CreateCvDto, UpdateCvDto)
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService,
    private readonly cvEventsService: CvEventsService
  ) {}

  @Post()
  @ApiBody({ type: CreateCvDto })
  @UseGuards(AuthGuard('jwt'))
  createForCv(@Body() dto: CreateCvDto, @Request() req): Promise<Cv> {
    return this.cvService.createWithDto(dto, req.user);
  }

  @Put(':id')
  @ApiBody({ type: UpdateCvDto })
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
  @Sse('events')
  @UseGuards(AuthGuard('jwt'))
  stream(@Request() req){
    return this.cvEventsService.streamForUser(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getOneForCv(@Param('id') id: number, @Request() req): Promise<Cv | null> {
    return this.cvService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: number, @Request() req): Promise<void> {
    return this.cvService.deleteForCv(id, req.user);
  }
}
