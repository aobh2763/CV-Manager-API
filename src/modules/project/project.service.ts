import { Repository } from "typeorm";
import { Project } from "./project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GithubService } from "../github/github.service";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";
import { Injectable, NotFoundException, Inject } from "@nestjs/common";

@Injectable()
export class ProjectService {
  constructor(
    @Inject() private readonly githubService: GithubService,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) { }

  get() {
    return this.projectRepository.find();
  }

  getById(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  async create(createDto: CreateProjectDto) {
    const entity = await this.githubService.getGithubRepoMetadata(createDto.url);

    const project = this.projectRepository.create(entity);
    return await this.projectRepository.save(project);
  }

  async update(id: string, updateDto: UpdateProjectDto) {
    let entity = {};
    if (updateDto.url) {
      entity = await this.githubService.getGithubRepoMetadata(updateDto.url);
    }

    const project = await this.projectRepository.preload({
      id,
      ...entity,
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return await this.projectRepository.save(project);
  }

  delete(id: string) {
    this.projectRepository.delete(id);
  }
}
