# Third-Party Integrations Guide

Guide for configuring and using external integrations in AutoArchitect.

## Table of Contents
- [GitHub Integration](#github-integration)
- [Notion Integration](#notion-integration)
- [OAuth Configuration](#oauth-configuration)

---

## GitHub Integration

Export workflows to GitHub as Gists or repositories.

### Setup

#### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in details:
   - **Application name**: AutoArchitect (Your Instance)
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://yourdomain.com/auth/callback/github`
4. Click "Register application"
5. Copy **Client ID**
6. Generate **Client Secret** (save securely)

#### 2. Configure Environment Variables

Add to `.env.local`:
```env
VITE_GITHUB_CLIENT_ID=your_client_id_here
VITE_GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback/github
```

For Vercel/production, add these as environment variables in the dashboard.

#### 3. Connect in App

1. Navigate to Integrations view in app
2. Click "Connect GitHub"
3. Authorize the OAuth app
4. Provide Personal Access Token for API operations

**Generate PAT:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes:
   - `repo` (full control of private repos)
   - `gist` (create gists)
4. Generate and copy token
5. Store securely in app settings

### Features

#### Export as Gist

```typescript
import { getGitHubService } from '@/lib/github';

const github = getGitHubService(accessToken);
const gistUrl = await github.createGist(blueprint, 'My Automation');
console.log('Gist created:', gistUrl);
```

**What's included:**
- README with workflow description
- Code snippet file
- Documentation JSON

#### Create Repository

```typescript
const repoUrl = await github.createRepo(
  blueprint, 
  'automation-workflow',
  true // private
);
```

**What's included:**
- README.md with full documentation
- Workflow file in `.github/workflows/`
- License file (MIT)

#### Commit to Existing Repo

```typescript
await github.commitWorkflow(
  'username/repo-name',
  blueprint,
  'new-workflow'
);
```

### Use Cases

1. **Version Control**: Keep automation history in Git
2. **Team Collaboration**: Share workflows via GitHub
3. **CI/CD**: Auto-deploy workflows from commits
4. **Backup**: Store blueprints externally
5. **Documentation**: Generate markdown docs

---

## Notion Integration

Sync workflows and audit reports to Notion.

### Setup

#### 1. Create Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Fill in details:
   - **Name**: AutoArchitect
   - **Associated workspace**: Your workspace
4. Click "Submit"
5. Copy **Internal Integration Token** (starts with `secret_`)

#### 2. Create Notion Database

1. Create a new page in Notion
2. Add a database (Table view recommended)
3. Add these properties:
   - **Name** (Title)
   - **Platform** (Select)
   - **Status** (Select): Draft, Active, Archived
   - **Security Score** (Number) - for audits
   - **Cost** (Text) - for audits
4. Share database with your integration:
   - Click "Share" in top right
   - Invite your integration
   - Grant full access

#### 3. Get Database ID

From database URL: `https://notion.so/workspace/DATABASE_ID?v=...`
Copy the `DATABASE_ID` part (32-character hash).

#### 4. Configure Environment Variables

Add to `.env.local`:
```env
VITE_NOTION_API_KEY=secret_xxxxxxxxxxxxx
VITE_NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Features

#### Export Workflow Documentation

```typescript
import { getNotionService } from '@/lib/notion';

const notion = getNotionService(apiKey, databaseId);
const pageUrl = await notion.createPage(blueprint, 'Email Automation');
console.log('Page created:', pageUrl);
```

**What's included:**
- Heading with workflow name
- Full explanation
- Step-by-step breakdown
- Implementation code block

#### Sync Audit Reports

```typescript
const auditPageUrl = await notion.syncAudit(
  auditResult,
  'Email Automation',
  blueprintId
);
```

**What's included:**
- Security score callout
- ROI analysis
- Vulnerabilities list
- Optimization recommendations

### Use Cases

1. **Documentation Hub**: Centralize all workflows
2. **Team Knowledge Base**: Share best practices
3. **Audit Trail**: Track security improvements
4. **Project Management**: Link to project pages
5. **Reporting**: Generate stakeholder reports

### Notion Database Templates

#### Workflows Database

```
| Name (Title) | Platform (Select) | Status (Select) | Created (Date) | Owner (Person) |
|--------------|-------------------|-----------------|----------------|----------------|
```

#### Audits Database

```
| Name (Title) | Security Score (Number) | Cost (Text) | Status (Select) | Reviewed By (Person) | Date (Date) |
|--------------|-------------------------|-------------|-----------------|---------------------|--------------|
```

---

## OAuth Configuration

### GitHub OAuth

**Development (localhost:3000):**
```
Callback URL: http://localhost:3000/auth/callback/github
```

**Production:**
```
Callback URL: https://yourdomain.com/auth/callback/github
```

**Vercel Preview Deploys:**
Add multiple callback URLs in GitHub OAuth settings:
- `https://yourdomain.com/auth/callback/github`
- `https://*.vercel.app/auth/callback/github`

### Google OAuth (Future)

When implementing Google OAuth:

1. Create project in Google Cloud Console
2. Enable OAuth 2.0 APIs
3. Create OAuth credentials
4. Add authorized redirect URIs
5. Add to Supabase Auth providers

```env
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=xxx
```

---

## Troubleshooting

### GitHub

**Issue: "Redirect URI mismatch"**
- Ensure callback URL matches exactly in OAuth app settings
- Check for http vs https
- Verify trailing slashes match

**Issue: "Bad credentials"**
- Regenerate Personal Access Token
- Ensure token has required scopes
- Check token hasn't expired

**Issue: "Resource not accessible by integration"**
- Token needs more permissions
- Regenerate with required scopes

### Notion

**Issue: "Database not found"**
- Verify database ID is correct
- Check integration is shared with database
- Ensure workspace has integration enabled

**Issue: "Unauthorized"**
- Verify API key is correct (starts with `secret_`)
- Check integration token hasn't been revoked
- Ensure workspace hasn't restricted integrations

**Issue: "Validation error"**
- Database properties must match expected schema
- Add missing properties (Name, Platform, Status, etc.)
- Check property types match

---

## Security Best Practices

### Credential Storage

- ✅ **DO**: Store in environment variables
- ✅ **DO**: Use OAuth when possible
- ✅ **DO**: Rotate tokens regularly
- ❌ **DON'T**: Commit credentials to Git
- ❌ **DON'T**: Share tokens publicly
- ❌ **DON'T**: Use personal tokens for production

### Access Control

- Use minimal required scopes
- Create separate tokens for different environments
- Revoke unused tokens immediately
- Monitor token usage for suspicious activity

### Data Privacy

- Be cautious syncing sensitive workflows
- Use private repositories/databases
- Review what data is sent to third parties
- Implement data retention policies

---

## Future Integrations

Planned integrations:

- [ ] **Slack**: Notifications for workflow events
- [ ] **Jira**: Link workflows to tickets
- [ ] **Confluence**: Export documentation
- [ ] **Linear**: Project integration
- [ ] **Discord**: Community sharing
- [ ] **Microsoft Teams**: Enterprise notifications

Request new integrations in [GitHub Discussions](https://github.com/Krosebrook/autoarchitect/discussions).
