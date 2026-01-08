# Development Guide

Guide for local development and contributing to AutoArchitect.

## Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/Krosebrook/autoarchitect.git
cd autoarchitect

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
autoarchitect/
├── components/          # React components
│   ├── auth/           # Authentication components
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── docs/               # Documentation
├── hooks/              # Custom React hooks
├── lib/                # Libraries and utilities
│   ├── supabase.ts    # Supabase client
│   ├── github.ts      # GitHub integration
│   └── notion.ts      # Notion integration
├── public/             # Static assets
├── services/           # Business logic
│   ├── api/           # API service layer
│   ├── geminiService.ts  # AI services
│   └── storageService.ts # Storage abstraction
├── supabase/           # Database migrations
├── views/              # Page-level components
├── App.tsx             # Main app component
├── types.ts            # TypeScript types
└── vite.config.ts      # Build configuration
```

## Development Workflow

### Running Locally

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Use Prettier (auto-format on save)
- **Linting**: ESLint rules (run before commit)

```bash
# Format code
npx prettier --write .

# Lint code
npx eslint . --ext .ts,.tsx
```

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Push branch and create PR
4. Wait for CI checks to pass
5. Request review
6. Merge after approval

```bash
git checkout -b feature/my-feature
git add .
git commit -m "feat: add amazing feature"
git push origin feature/my-feature
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Writing Tests

Create test files alongside source files with `.test.ts` or `.test.tsx` extension:

```typescript
// services/api/blueprintService.test.ts
import { describe, it, expect } from 'vitest';
import { blueprintService } from './blueprintService';

describe('blueprintService', () => {
  it('should create a blueprint', async () => {
    const blueprint = await blueprintService.create('user-id', {
      name: 'Test Blueprint',
      platform: 'zapier',
      steps: [],
    });
    
    expect(blueprint.name).toBe('Test Blueprint');
  });
});
```

## Environment Variables

### Local Development

Create `.env.local`:

```env
# Gemini AI (Required)
VITE_GEMINI_API_KEY=your_key

# Supabase (Optional)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_key

# GitHub (Optional)
VITE_GITHUB_CLIENT_ID=your_dev_app_id

# Notion (Optional)
VITE_NOTION_API_KEY=secret_xxx
```

### Testing Without Supabase

The app works in offline mode without Supabase:
- Uses IndexedDB for local storage
- No authentication required
- All AI features functional

## Architecture Patterns

### Service Layer

All data access goes through services in `services/api/`:

```typescript
// Good: Use service layer
import { blueprintService } from '@/services/api/blueprintService';
const blueprints = await blueprintService.list(userId);

// Bad: Direct database access
import { supabase } from '@/lib/supabase';
const { data } = await supabase.from('blueprints').select('*');
```

### Offline-First Design

Services automatically fallback to IndexedDB when Supabase unavailable:

```typescript
export const blueprintService = {
  async list(userId: string) {
    if (isSupabaseConfigured()) {
      // Use Supabase
    } else {
      // Fallback to IndexedDB
    }
  }
};
```

### Error Handling

Use toast notifications for user-facing errors:

```typescript
import { toast } from 'sonner';

try {
  await blueprintService.create(userId, blueprint);
  toast.success('Blueprint created!');
} catch (error) {
  toast.error('Failed to create blueprint');
  console.error(error);
}
```

## Common Tasks

### Adding a New View

1. Create component in `views/`:
```typescript
// views/MyNewView.tsx
export const MyNewView: React.FC = () => {
  return <div>My New View</div>;
};
```

2. Add to `types.ts`:
```typescript
export enum AppView {
  // ... existing
  MY_NEW_VIEW = 'MY_NEW_VIEW'
}
```

3. Add to `App.tsx`:
```typescript
case AppView.MY_NEW_VIEW: 
  return <MyNewView />;
```

4. Add to `Sidebar.tsx`:
```typescript
<SidebarItem 
  icon={Icon} 
  label="My View" 
  view={AppView.MY_NEW_VIEW}
/>
```

### Adding a Database Table

1. Create migration in `supabase/migrations/`:
```sql
-- 002_my_new_table.sql
CREATE TABLE public.my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON public.my_table
  FOR SELECT USING (auth.uid() = user_id);
```

2. Update `lib/database.types.ts`

3. Create service in `services/api/myService.ts`

4. Use in components

### Adding an Integration

1. Create service in `lib/`:
```typescript
// lib/myintegration.ts
export class MyIntegrationService {
  async doSomething() {
    // Implementation
  }
}
```

2. Add environment variables to `.env.example`

3. Create UI in `components/integrations/`

4. Document in `docs/INTEGRATIONS.md`

## Debugging

### VS Code Launch Config

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

### Browser DevTools

- **React DevTools**: Install extension to inspect component tree
- **Console**: Check for errors and warnings
- **Network**: Monitor API calls
- **Application**: Inspect IndexedDB and localStorage

### Supabase Local Development

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Stop local Supabase
supabase stop
```

## Performance Optimization

### Code Splitting

Use React.lazy for large views:

```typescript
const MyHeavyView = React.lazy(() => import('./views/MyHeavyView'));

<Suspense fallback={<Loading />}>
  <MyHeavyView />
</Suspense>
```

### Bundle Analysis

```bash
# Analyze bundle size
npx vite-bundle-visualizer
```

### Image Optimization

- Use WebP format when possible
- Lazy load images below the fold
- Compress images before committing

## Contributing

### Code Review Guidelines

- Keep PRs focused and small
- Write descriptive commit messages
- Add tests for new features
- Update documentation
- Ensure CI passes

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add Google OAuth support

- Add Google provider to AuthContext
- Update login form with Google button
- Add documentation for setup

Closes #123
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Gemini API](https://ai.google.dev/docs)
- [Vite Guide](https://vitejs.dev/guide/)
