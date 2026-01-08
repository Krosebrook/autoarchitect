# API Reference

AutoArchitect service layer API documentation.

## Blueprint Service

### `blueprintService.create(userId, blueprint)`

Creates a new blueprint.

**Parameters:**
- `userId` (string): User ID
- `blueprint` (BlueprintCreateInput): Blueprint data

**Returns:** `Promise<SavedBlueprint>`

**Example:**
```typescript
const blueprint = await blueprintService.create('user-123', {
  name: 'Email Automation',
  platform: 'zapier',
  steps: [
    { id: 1, title: 'Trigger', description: 'New email', type: 'trigger' }
  ],
  explanation: 'Automates email responses',
  codeSnippet: '// workflow code',
  version: '1.0.0',
  isPublic: false
});
```

### `blueprintService.list(userId)`

Lists all blueprints for a user.

**Parameters:**
- `userId` (string): User ID

**Returns:** `Promise<SavedBlueprint[]>`

### `blueprintService.get(id, userId?)`

Gets a specific blueprint by ID.

**Parameters:**
- `id` (string): Blueprint ID
- `userId` (string, optional): User ID for access control

**Returns:** `Promise<SavedBlueprint>`

### `blueprintService.update(id, userId, updates)`

Updates an existing blueprint.

**Parameters:**
- `id` (string): Blueprint ID
- `userId` (string): User ID
- `updates` (Partial<BlueprintCreateInput>): Fields to update

**Returns:** `Promise<SavedBlueprint>`

### `blueprintService.delete(id, userId)`

Deletes a blueprint.

**Parameters:**
- `id` (string): Blueprint ID
- `userId` (string): User ID

**Returns:** `Promise<void>`

### `blueprintService.share(id, userId, isPublic)`

Updates blueprint visibility.

**Parameters:**
- `id` (string): Blueprint ID
- `userId` (string): User ID
- `isPublic` (boolean): Public visibility flag

**Returns:** `Promise<void>`

### `blueprintService.listPublic(limit?)`

Lists public blueprints.

**Parameters:**
- `limit` (number, optional): Max results (default: 50)

**Returns:** `Promise<SavedBlueprint[]>`

---

## Audit Service

### `auditService.create(blueprintId, userId, audit)`

Creates an audit log entry.

**Parameters:**
- `blueprintId` (string): Blueprint ID
- `userId` (string): User ID
- `audit` (AuditResult): Audit data

**Returns:** `Promise<void>`

**Example:**
```typescript
await auditService.create('blueprint-123', 'user-123', {
  securityScore: 85,
  estimatedMonthlyCost: '$50-100',
  vulnerabilities: [
    {
      severity: 'medium',
      issue: 'Exposed API key',
      fix: 'Use environment variables'
    }
  ],
  roiAnalysis: 'Saves 10 hours per week',
  optimizationTips: ['Cache API responses', 'Use webhooks']
});
```

### `auditService.getByBlueprint(blueprintId)`

Gets all audits for a blueprint.

**Parameters:**
- `blueprintId` (string): Blueprint ID

**Returns:** `Promise<AuditResult[]>`

### `auditService.getLatest(blueprintId)`

Gets the most recent audit for a blueprint.

**Parameters:**
- `blueprintId` (string): Blueprint ID

**Returns:** `Promise<AuditResult | null>`

### `auditService.deleteByBlueprint(blueprintId)`

Deletes all audits for a blueprint.

**Parameters:**
- `blueprintId` (string): Blueprint ID

**Returns:** `Promise<void>`

---

## User Service

### `userService.getPreferences(userId)`

Gets user preferences.

**Parameters:**
- `userId` (string): User ID

**Returns:** `Promise<UserProfile['preferences'] | null>`

### `userService.updatePreferences(userId, preferences)`

Updates user preferences.

**Parameters:**
- `userId` (string): User ID
- `preferences` (Partial<UserProfile['preferences']>): Preferences to update

**Returns:** `Promise<void>`

**Example:**
```typescript
await userService.updatePreferences('user-123', {
  theme: 'dark',
  defaultPlatform: 'n8n',
  autoAudit: true
});
```

### `userService.getProfile(userId)`

Gets user profile.

**Parameters:**
- `userId` (string): User ID

**Returns:** `Promise<Profile | null>`

### `userService.updateProfile(userId, updates)`

Updates user profile.

**Parameters:**
- `userId` (string): User ID
- `updates` (Object): Profile fields to update
  - `full_name` (string, optional)
  - `avatar_url` (string, optional)

**Returns:** `Promise<void>`

---

## GitHub Service

### `githubService.createGist(blueprint, name)`

Creates a GitHub Gist from a blueprint.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data
- `name` (string): Gist name

**Returns:** `Promise<string>` - Gist URL

**Example:**
```typescript
import { getGitHubService } from '@/lib/github';

const github = getGitHubService(accessToken);
const gistUrl = await github.createGist(blueprint, 'My Workflow');
```

### `githubService.createRepo(blueprint, repoName, isPrivate?)`

Creates a GitHub repository from a blueprint.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data
- `repoName` (string): Repository name
- `isPrivate` (boolean, optional): Private flag (default: true)

**Returns:** `Promise<string>` - Repository URL

### `githubService.commitWorkflow(repoFullName, blueprint, fileName)`

Commits a workflow file to an existing repository.

**Parameters:**
- `repoFullName` (string): Full repo name (owner/repo)
- `blueprint` (AutomationResult): Blueprint data
- `fileName` (string): File name (without extension)

**Returns:** `Promise<void>`

### `githubService.listRepositories(perPage?)`

Lists user's repositories.

**Parameters:**
- `perPage` (number, optional): Results per page (default: 30)

**Returns:** `Promise<any[]>`

### `githubService.getAuthenticatedUser()`

Gets the authenticated user's information.

**Returns:** `Promise<any>`

---

## Notion Service

### `notionService.createPage(blueprint, name)`

Creates a Notion page from a blueprint.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data
- `name` (string): Page title

**Returns:** `Promise<string>` - Page URL

**Example:**
```typescript
import { getNotionService } from '@/lib/notion';

const notion = getNotionService(apiKey, databaseId);
const pageUrl = await notion.createPage(blueprint, 'My Workflow');
```

### `notionService.syncAudit(audit, blueprintName, blueprintId?)`

Syncs an audit report to Notion.

**Parameters:**
- `audit` (AuditResult): Audit data
- `blueprintName` (string): Blueprint name
- `blueprintId` (string, optional): Blueprint ID

**Returns:** `Promise<string>` - Page URL

### `notionService.listPages(databaseId?)`

Lists pages in a database.

**Parameters:**
- `databaseId` (string, optional): Database ID (uses default if not provided)

**Returns:** `Promise<any[]>`

---

## Gemini AI Service

### `generateAutomation(platform, description)`

Generates a workflow automation.

**Parameters:**
- `platform` (Platform): Target platform
- `description` (string): Automation description

**Returns:** `Promise<AutomationResult>`

**Example:**
```typescript
import { generateAutomation } from '@/services/geminiService';

const result = await generateAutomation('zapier', 
  'Send Slack notification when new GitHub issue is created'
);
```

### `generateWorkflowDocs(blueprint)`

Generates technical documentation for a workflow.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data

**Returns:** `Promise<WorkflowDocumentation>`

### `auditAutomation(blueprint)`

Performs security and ROI audit on a workflow.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data

**Returns:** `Promise<AuditResult>`

### `simulateAutomation(blueprint, inputData)`

Simulates workflow execution.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data
- `inputData` (string): Test input data

**Returns:** `Promise<SimulationResponse>`

### `benchmarkPlatforms(description, targetPlatforms)`

Compares implementation across multiple platforms.

**Parameters:**
- `description` (string): Automation description
- `targetPlatforms` (Platform[]): Platforms to compare

**Returns:** `Promise<ComparisonResult>`

### `chatWithAssistant(message)`

Chat with AI assistant.

**Parameters:**
- `message` (string): User message

**Returns:** `Promise<string>`

### `analyzeImage(base64Data, prompt, mimeType?)`

Analyzes an image with AI.

**Parameters:**
- `base64Data` (string): Base64 encoded image
- `prompt` (string): Analysis prompt
- `mimeType` (string, optional): Image MIME type (default: 'image/jpeg')

**Returns:** `Promise<string>`

### `generateSpeech(text, voice)`

Generates speech from text.

**Parameters:**
- `text` (string): Text to synthesize
- `voice` (string): Voice name

**Returns:** `Promise<string>` - Base64 audio data

### `identifySecrets(blueprint)`

Identifies secrets and suggests CI/CD pipeline.

**Parameters:**
- `blueprint` (AutomationResult): Blueprint data

**Returns:** `Promise<DeploymentConfig>`

---

## Auth Context

### `useAuth()`

React hook for authentication state and methods.

**Returns:**
```typescript
{
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email, password, fullName?) => Promise<{user, error}>
  signIn: (email, password) => Promise<{user, error}>
  signInWithGithub: () => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  isSupabaseEnabled: boolean
}
```

**Example:**
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <p>Hello, {user?.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

---

## Types

### `SavedBlueprint`
```typescript
interface SavedBlueprint extends AutomationResult {
  id: string
  name: string
  version: string
}
```

### `AutomationResult`
```typescript
interface AutomationResult {
  platform: Platform
  steps: AutomationStep[]
  codeSnippet?: string
  explanation: string
  sources?: GroundingSource[]
  timestamp?: number
  documentation?: WorkflowDocumentation
}
```

### `AuditResult`
```typescript
interface AuditResult {
  securityScore: number
  estimatedMonthlyCost: string
  vulnerabilities: {
    severity: 'low' | 'medium' | 'high'
    issue: string
    fix: string
  }[]
  roiAnalysis: string
  optimizationTips: string[]
}
```

### `Platform`
```typescript
type Platform = 
  | 'zapier' 
  | 'n8n' 
  | 'langchain' 
  | 'make' 
  | 'pipedream' 
  | 'google-sheets' 
  | 'airtable' 
  | 'shopify' 
  | 'openai' 
  | 'anthropic'
```

---

## Error Handling

All services throw errors that should be caught:

```typescript
try {
  const result = await blueprintService.create(userId, blueprint);
  toast.success('Blueprint created!');
} catch (error) {
  toast.error(error.message || 'Operation failed');
  console.error('Error details:', error);
}
```

Common error scenarios:
- **Not authenticated**: User not logged in (Supabase mode)
- **Permission denied**: RLS policy violation
- **Not found**: Resource doesn't exist
- **Validation error**: Invalid input data
- **API quota exceeded**: Gemini API rate limit
- **Network error**: Connection issues
