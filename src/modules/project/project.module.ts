import { Cv } from "../cv/cv.entity";
import { Module } from "@nestjs/common";
import { Project } from "./project.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { GithubModule } from "../github/github.module";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Cv]), GithubModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule { }
