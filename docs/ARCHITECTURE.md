# System Architecture

## Overview

AutoArchitect v2.6 is a **hybrid offline-first, cloud-enabled SaaS platform** built with React, TypeScript, and Supabase. The architecture supports both standalone offline use and multi-user cloud deployments.

---

## Architecture Layers

### 1. Presentation Layer (React)
- **Views**: Page-level components (`views/`)
- **Components**: Reusable UI elements (`components/`)
- **Contexts**: Global state management (Auth, Theme)
- **Hooks**: Custom React hooks for common patterns

### 2. Service Layer
- **API Services** (`services/api/`): Abstract data access
- **Gemini Service** (`services/geminiService.ts`): AI operations
- **Storage Service** (`services/storageService.ts`): Local storage abstraction

### 3. Integration Layer
- **Supabase** (`lib/supabase.ts`): Database and auth
- **GitHub** (`lib/github.ts`): Repository management
- **Notion** (`lib/notion.ts`): Documentation sync

### 4. Persistence Layer
- **Primary**: Supabase PostgreSQL (cloud mode)
- **Fallback**: IndexedDB via Dexie (offline mode)
- **Cache**: localStorage for preferences

---

## Data Flow

### Cloud Mode (Supabase Enabled)
```
User Action → Component → Service Layer → Supabase → PostgreSQL
                                ↓
                         Row Level Security
                                ↓
                          Authorized Data
```

### Offline Mode (No Supabase)
```
User Action → Component → Service Layer → IndexedDB (Dexie)
                                ↓
                          Local Storage
```

### Hybrid Flow (Automatic Fallback)
The service layer automatically detects Supabase availability and falls back to IndexedDB when needed.

---

## Security Architecture

### Row Level Security (RLS)
All Supabase tables enforce RLS policies ensuring users can only access their own data.

### Authentication Flow
1. User submits credentials
2. Supabase Auth validates
3. JWT token issued
4. Token stored in localStorage
5. Token sent with all requests
6. RLS enforces access control

### API Key Management
- **Gemini API Key**: Environment variables only
- **OAuth Tokens**: Supabase auth session
- **PATs**: Encrypted in user preferences

---

## AI Integration

### Gemini Service Pattern
- Retry logic with exponential backoff
- Structured output with response schemas
- Error handling and fallback strategies

### AI Capabilities
1. **Workflow Generation**: Natural language → executable workflow
2. **Security Auditing**: Vulnerability scanning
3. **Documentation**: Auto-generated technical docs
4. **Simulation**: Test workflows with sample data
5. **Platform Comparison**: Benchmark implementations
6. **Image Analysis**: Understand workflow diagrams
7. **Voice Interaction**: Real-time consultation

---

## Deployment Architecture

### Vercel (Production)
- Automatic deployments from main branch
- Environment variable management
- Edge caching and CDN

### Docker (Self-Hosted)
- Multi-stage builds for optimization
- Health checks included
- Resource limits configurable

---

## Performance Optimizations

- **Code Splitting**: Lazy load heavy views
- **Tree Shaking**: Remove unused code
- **Service Worker**: Cache static assets
- **Indexed Queries**: Database performance

---

## Scalability

- **Horizontal Scaling**: Vercel auto-scales
- **Database**: Supabase connection pooling
- **Rate Limiting**: Built-in retry mechanisms
- **CDN**: Global edge caching

---

## Design Principles

1. **Offline-First**: Core features work without internet
2. **Progressive Enhancement**: Add features as services available
3. **Security by Default**: RLS, encryption, secure patterns
4. **Performance**: Fast load times, efficient rendering
5. **Maintainability**: Clear separation of concerns
6. **Scalability**: Horizontal scaling ready
