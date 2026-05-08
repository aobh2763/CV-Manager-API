import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from "@nestjs/common";

import { ProjectService } from "./project.service";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";

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
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateProjectDto) {
    return this.projectService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectService.delete(id);
  }
}
