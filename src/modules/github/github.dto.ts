export interface GithubWebhookRepository {
  name: string;
  html_url: string;
  full_name: string;
  description: string | null;
}

export interface GithubWebhookPayload {
  action?: string;
  sender: { login: string };
  repository: GithubWebhookRepository;
}
