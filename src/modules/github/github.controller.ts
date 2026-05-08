import { GithubService } from "./github.service";
import { BadRequestException, Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";

@Controller('webhook/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  async githubWebhook(
    @Body() body: { payload: string },
    @Headers('x-github-event') eventType: string | undefined,
  ) {
    const payload = JSON.parse(body.payload);

    const relevantEvents = new Set(['push', 'repository', 'edited']);
    if (eventType && !relevantEvents.has(eventType)) {
      return { message: `Event '${eventType}' ignored`, updated: 0 };
    }

    console.log('Event type:', eventType);
    console.log('Repository name:', payload.repository.name);
    console.log('Repository html_url:', payload.repository.html_url);
    console.log('Repository description:', payload.repository.description);

    if (!payload?.repository?.html_url) {
      throw new BadRequestException('Missing repository object in webhook payload');
    }

    const updated = await this.githubService.syncFromWebhook(payload);
    return { message: 'Sync complete', updated: updated.length };
  }
}
