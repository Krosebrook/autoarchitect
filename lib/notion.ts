import { Client } from '@notionhq/client';
import type { AutomationResult, AuditResult } from '../types';

export class NotionService {
  private client: Client | null = null;
  private isConfigured = false;
  private databaseId: string | null = null;

  constructor(apiKey?: string, databaseId?: string) {
    if (apiKey) {
      this.client = new Client({ auth: apiKey });
      this.isConfigured = true;
      this.databaseId = databaseId || null;
    }
  }

  setCredentials(apiKey: string, databaseId?: string) {
    this.client = new Client({ auth: apiKey });
    this.isConfigured = true;
    if (databaseId) {
      this.databaseId = databaseId;
    }
  }

  isAuthenticated(): boolean {
    return this.isConfigured && this.client !== null;
  }

  async createPage(blueprint: AutomationResult, name: string): Promise<string> {
    if (!this.client) {
      throw new Error('Notion not configured. Please set API key first.');
    }

    if (!this.databaseId) {
      throw new Error('Notion database ID not configured.');
    }

    const response = await this.client.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Platform: {
          select: {
            name: blueprint.platform,
          },
        },
        Status: {
          select: {
            name: 'Draft',
          },
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: name } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: blueprint.explanation } }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Workflow Steps' } }],
          },
        },
        ...blueprint.steps.map((step) => ({
          object: 'block' as const,
          type: 'numbered_list_item' as const,
          numbered_list_item: {
            rich_text: [
              {
                type: 'text' as const,
                text: { content: `${step.title}: ${step.description}` },
              },
            ],
          },
        })),
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Implementation Code' } }],
          },
        },
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [{ type: 'text', text: { content: blueprint.codeSnippet || 'No code available' } }],
            language: 'javascript',
          },
        },
      ],
    });

    return response.url;
  }

  async syncAudit(audit: AuditResult, blueprintName: string, blueprintId?: string): Promise<string> {
    if (!this.client) {
      throw new Error('Notion not configured. Please set API key first.');
    }

    if (!this.databaseId) {
      throw new Error('Notion database ID not configured.');
    }

    const response = await this.client.pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: `Audit: ${blueprintName}`,
              },
            },
          ],
        },
        'Security Score': {
          number: audit.securityScore,
        },
        Cost: {
          rich_text: [
            {
              text: {
                content: audit.estimatedMonthlyCost,
              },
            },
          ],
        },
        Status: {
          select: {
            name: audit.securityScore >= 80 ? 'Approved' : 'Review Required',
          },
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: `Security Audit: ${blueprintName}` } }],
          },
        },
        {
          object: 'block',
          type: 'callout',
          callout: {
            rich_text: [
              {
                type: 'text',
                text: { content: `Security Score: ${audit.securityScore}/100` },
              },
            ],
            icon: { emoji: audit.securityScore >= 80 ? '✅' : '⚠️' },
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'ROI Analysis' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: audit.roiAnalysis } }],
          },
        },
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Vulnerabilities' } }],
          },
        },
        ...audit.vulnerabilities.map((vuln) => ({
          object: 'block' as const,
          type: 'bulleted_list_item' as const,
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text' as const,
                text: { content: `[${vuln.severity.toUpperCase()}] ${vuln.issue} - Fix: ${vuln.fix}` },
              },
            ],
          },
        })),
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Optimization Tips' } }],
          },
        },
        ...audit.optimizationTips.map((tip) => ({
          object: 'block' as const,
          type: 'bulleted_list_item' as const,
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text' as const,
                text: { content: tip },
              },
            ],
          },
        })),
      ],
    });

    return response.url;
  }

  async listPages(databaseId?: string): Promise<any[]> {
    if (!this.client) {
      throw new Error('Notion not configured. Please set API key first.');
    }

    const dbId = databaseId || this.databaseId;
    if (!dbId) {
      throw new Error('Notion database ID not configured.');
    }

    const response = await this.client.databases.query({
      database_id: dbId,
    });

    return response.results;
  }
}

// Singleton instance
let notionService: NotionService | null = null;

export const getNotionService = (apiKey?: string, databaseId?: string): NotionService => {
  if (!notionService) {
    notionService = new NotionService(apiKey, databaseId);
  } else if (apiKey) {
    notionService.setCredentials(apiKey, databaseId);
  }
  return notionService;
};
