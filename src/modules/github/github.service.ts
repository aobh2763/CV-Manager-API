import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "../project/project.entity";
import { GithubWebhookPayload } from "./github.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

@Injectable()
export class GithubService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) { }

  async syncFromWebhook(payload: GithubWebhookPayload) {
    const { name, description, html_url } = payload.repository;

    const projects = await this.projectRepository.find({
      where: { repoUrl: html_url },
    });

    if (projects.length === 0) {
      console.log('No projects found matching repoUrl:', html_url);
      return [];
    }

    console.log('Syncing projects:', projects.map((p) => p.id));
    const updated = projects.map((p) =>
      this.projectRepository.merge(p, {
        title: name,
        description: description ?? '',
      }),
    );

    return this.projectRepository.save(updated);
  }

  async getGithubRepoMetadata(url: string) {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+?)(\.git)?(\/?)(#.*)?$/);

    if (!match) {
      throw new BadRequestException(`Invalid GitHub repository URL: ${url}`);
    }

    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
    };

    const response = await fetch(apiUrl, { headers });

    if (response.status === 404) {
      throw new NotFoundException(`GitHub repository not found: ${owner}/${repo}`);
    }
    if (!response.ok) {
      throw new InternalServerErrorException(
        `GitHub API request failed with status ${response.status}`,
      );
    }

    const data = await response.json() as { name: string; description: string | null; html_url: string };

    return {
      title: data.name,
      description: data.description ?? '',
      repoUrl: data.html_url,
    };
  }
}
