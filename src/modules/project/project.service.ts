import { Repository } from "typeorm";
import { Project } from "./project.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GithubService } from "../github/github.service";
import { CreateProjectDto, UpdateProjectDto } from "./project.dto";
import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Cv } from "../cv/cv.entity";

@Injectable()
export class ProjectService {
  constructor(
    @Inject() private readonly githubService: GithubService,
    @InjectRepository(Cv) private readonly cvRepository: Repository<Project>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) { }

  get() {
    return this.projectRepository.find({ relations: { cv: true } });
  }

  getById(id: string) {
    return this.projectRepository.findOneBy({ id });
  }

  async create(createDto: CreateProjectDto) {
    const cv = await this.cvRepository.findOneBy({ id: createDto.cvId.toString() });
    let entity = await this.githubService.getGithubRepoMetadata(createDto.url);

    if (!cv) {
      throw new NotFoundException("Cv with id: " + createDto.cvId + " not found");
    }

    const project = this.projectRepository.create({
      ...entity,
      cv: {
        id: parseInt(cv.id)
      }
    });

    return await this.projectRepository.save(project);
  }

  async update(id: string, updateDto: UpdateProjectDto) {
    let cv;
    let entity = {};

    if (updateDto.url) {
      entity = await this.githubService.getGithubRepoMetadata(updateDto.url);
    }

    if (updateDto.cvId) {
      cv = await this.cvRepository.findOneBy({ id: updateDto.cvId.toString() });

      if (!cv) {
        throw new NotFoundException("Cv with id: " + updateDto.cvId + " not found");
      }

      entity = { ...entity, cv: { id: parseInt(cv.id) } };
    }

    const project = await this.projectRepository.preload({
      id,
      ...entity
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
