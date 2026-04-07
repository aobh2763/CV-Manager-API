import { Controller } from '@nestjs/common';
import { CvService } from './cv.service';
import { Cv } from './cv.entity';
import { BaseController } from '../../common/base.controller';

@Controller('cv')
export class CvController extends BaseController<Cv> {
  constructor(private readonly cvService: CvService) {
    super(cvService);
  }
}
