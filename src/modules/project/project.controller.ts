import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";
import { ProjectService } from "./project.service";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";

@UseGuards(AuthGuard('jwt'))
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) { }

  @Get()
  get() {
    return this.projectService.get();
  }

  @Get(':id')
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.getById(id);
  }

  @Post()
  create(@Body() createDto: CreateProjectDto) {
    return this.projectService.create(createDto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateProjectDto, @Req() req) {
    const user = req.user;
    console.log('user: ', user);
    return this.projectService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const user = req.user;
    console.log('user: ', user);
    return this.projectService.delete(id);
  }
}
