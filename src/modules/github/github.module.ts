import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GithubService } from "./github.service";
import { Project } from "../project/project.entity";
import { GithubController } from "./github.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService]
})
export class GithubModule { }
