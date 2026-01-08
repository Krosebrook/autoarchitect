import { Octokit } from '@octokit/rest';
import type { AutomationResult } from '../types';

export class GitHubService {
  private octokit: Octokit | null = null;
  private isConfigured = false;

  constructor(token?: string) {
    if (token) {
      this.octokit = new Octokit({ auth: token });
      this.isConfigured = true;
    }
  }

  setToken(token: string) {
    this.octokit = new Octokit({ auth: token });
    this.isConfigured = true;
  }

  isAuthenticated(): boolean {
    return this.isConfigured && this.octokit !== null;
  }

  async createGist(blueprint: AutomationResult, name: string): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub not configured. Please authenticate first.');
    }

    const files: Record<string, { content: string }> = {
      [`${name}.md`]: {
        content: `# ${name}\n\n## Platform: ${blueprint.platform}\n\n${blueprint.explanation}\n\n## Steps\n${blueprint.steps.map(s => `- ${s.title}: ${s.description}`).join('\n')}`,
      },
    };

    if (blueprint.codeSnippet) {
      files[`workflow.${this.getFileExtension(blueprint.platform)}`] = {
        content: blueprint.codeSnippet,
      };
    }

    if (blueprint.documentation) {
      files['documentation.json'] = {
        content: JSON.stringify(blueprint.documentation, null, 2),
      };
    }

    const { data } = await this.octokit.gists.create({
      description: `AutoArchitect Blueprint: ${name}`,
      public: false,
      files,
    });

    return data.html_url || data.url;
  }

  async createRepo(blueprint: AutomationResult, repoName: string, isPrivate: boolean = true): Promise<string> {
    if (!this.octokit) {
      throw new Error('GitHub not configured. Please authenticate first.');
    }

    // Create repository
    const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: `AutoArchitect Blueprint: ${blueprint.platform} automation`,
      private: isPrivate,
      auto_init: true,
    });

    // Create README
    const readmeContent = Buffer.from(
      `# ${repoName}\n\n${blueprint.explanation}\n\n## Platform: ${blueprint.platform}\n\n## Steps\n${blueprint.steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.description}`).join('\n')}`
    ).toString('base64');

    await this.octokit.repos.createOrUpdateFileContents({
      owner: repo.owner.login,
      repo: repo.name,
      path: 'README.md',
      message: 'Initial commit: Add README',
      content: readmeContent,
    });

    // Add workflow file if code snippet exists
    if (blueprint.codeSnippet) {
      await this.commitWorkflow(repo.full_name, blueprint, 'workflow');
    }

    return repo.html_url;
  }

  async commitWorkflow(repoFullName: string, blueprint: AutomationResult, fileName: string): Promise<void> {
    if (!this.octokit) {
      throw new Error('GitHub not configured. Please authenticate first.');
    }

    const [owner, repo] = repoFullName.split('/');
    const extension = this.getFileExtension(blueprint.platform);
    const workflowContent = Buffer.from(blueprint.codeSnippet || '').toString('base64');

    await this.octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `.github/workflows/${fileName}.${extension}`,
      message: `Add ${blueprint.platform} workflow`,
      content: workflowContent,
    });
  }

  private getFileExtension(platform: string): string {
    const extensions: Record<string, string> = {
      zapier: 'json',
      n8n: 'json',
      make: 'json',
      pipedream: 'js',
      langchain: 'py',
      'google-sheets': 'gs',
      airtable: 'js',
      shopify: 'liquid',
      openai: 'py',
      anthropic: 'py',
    };
    return extensions[platform] || 'yml';
  }

  async listRepositories(perPage: number = 30): Promise<any[]> {
    if (!this.octokit) {
      throw new Error('GitHub not configured. Please authenticate first.');
    }

    const { data } = await this.octokit.repos.listForAuthenticatedUser({
      per_page: perPage,
      sort: 'updated',
    });

    return data;
  }

  async getAuthenticatedUser(): Promise<any> {
    if (!this.octokit) {
      throw new Error('GitHub not configured. Please authenticate first.');
    }

    const { data } = await this.octokit.users.getAuthenticated();
    return data;
  }
}

// Singleton instance
let githubService: GitHubService | null = null;

export const getGitHubService = (token?: string): GitHubService => {
  if (!githubService) {
    githubService = new GitHubService(token);
  } else if (token) {
    githubService.setToken(token);
  }
  return githubService;
};
