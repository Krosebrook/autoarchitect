# AutoArchitect Enterprise v2.6

> **Enterprise-grade AI orchestration platform for designing, auditing, and deploying multi-agent automation workflows**

[![Deploy](https://github.com/Krosebrook/autoarchitect/actions/workflows/deploy.yml/badge.svg)](https://github.com/Krosebrook/autoarchitect/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🤖 AI-Powered Workflow Generation
- **Multi-Platform Support**: Zapier, n8n, Make, Pipedream, LangChain, and more
- **Gemini Pro Integration**: Advanced AI reasoning for workflow design
- **Smart Documentation**: Auto-generated technical docs with input/output schemas
- **Live Consultant**: Real-time voice interaction with AI architect

### 🔐 Multi-User SaaS Platform
- **Authentication**: Email/password and OAuth (GitHub, Google)
- **User Isolation**: Row-level security with Supabase
- **Role-Based Access**: User and admin roles
- **Public Sharing**: Share blueprints with the community

### 🛡️ Security & Compliance
- **AI Security Audits**: Automated vulnerability scanning
- **Cost Analysis**: Monthly cost estimation per workflow
- **ROI Calculator**: Business impact analysis
- **Compliance Checks**: Industry best practices validation

### 🚀 Deployment & Integration
- **GitHub Integration**: Export as Gists or create repositories
- **Notion Integration**: Sync documentation to Notion
- **Docker Support**: Containerized deployment
- **Vercel Ready**: One-click deployment to Vercel
- **PWA Offline Mode**: Works offline with IndexedDB fallback

### 🎨 Advanced Features
- **Logic Sandbox**: Test workflows with simulated data
- **Platform Comparator**: Benchmark across multiple platforms
- **CI/CD Pipeline Generator**: Auto-generate GitHub Actions workflows
- **Image Analysis**: Analyze workflow diagrams with AI
- **Terminal Interface**: Direct API access for power users

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account (for multi-user features)
- Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/Krosebrook/autoarchitect.git
cd autoarchitect

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Setup

Create `.env.local` with:

```env
# Required: Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Optional: Supabase (for multi-user mode)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional: GitHub Integration
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:3000/auth/callback/github

# Optional: Notion Integration
VITE_NOTION_API_KEY=secret_xxxx
VITE_NOTION_DATABASE_ID=your_database_id
```

---

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Configure environment variables in Vercel dashboard.

### Docker

```bash
# Build image
docker build -t autoarchitect .

# Run container
docker run -p 3000:3000 \
  -e VITE_GEMINI_API_KEY=your_key \
  autoarchitect
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🗄️ Database Setup

### Supabase Migration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration:

```bash
# Using Supabase CLI
npx supabase db push

# Or manually in SQL editor
# Copy content from supabase/migrations/001_initial_schema.sql
```

3. Enable OAuth providers in Supabase dashboard
4. Add environment variables to your deployment

### Schema Overview

- `profiles` - User accounts with roles
- `blueprints` - Automation workflows (with RLS)
- `user_preferences` - User settings and themes
- `audit_logs` - Security audit history

---

## 🔌 Integrations

### GitHub

1. Create OAuth app: https://github.com/settings/developers
2. Set callback URL: `https://yourdomain.com/auth/callback/github`
3. Add client ID to environment variables
4. Store personal access token in app settings

**Features:**
- Export blueprints as Gists
- Create repositories from workflows
- Commit workflow files to existing repos

### Notion

1. Create integration: https://www.notion.so/my-integrations
2. Copy internal integration token
3. Share database with integration
4. Add credentials to environment variables

**Features:**
- Export documentation as Notion pages
- Sync audit results to databases
- Create automated workflow libraries

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI**: Google Gemini 1.5 Pro/Flash
- **Database**: Supabase (PostgreSQL) + IndexedDB (offline)
- **Auth**: Supabase Auth (email, OAuth)
- **Deployment**: Vercel, Docker
- **Build**: Vite 6

### Key Design Patterns
- **Offline-First**: IndexedDB fallback when Supabase unavailable
- **Progressive Enhancement**: Core features work without auth
- **Row-Level Security**: Database-level access control
- **Service Layer**: Abstracted data access (online/offline)

---

## 📚 Documentation

- [Development Guide](docs/DEVELOPMENT.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Reference](docs/API.md)
- [Integration Guide](docs/INTEGRATIONS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)

---

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Coverage report
npm run test:coverage

# Type checking
npx tsc --noEmit
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- Supabase for backend infrastructure
- Vercel for deployment platform
- All contributors and the open-source community

---

## 🔗 Links

- [Live Demo](https://autoarchitect.vercel.app) *(coming soon)*
- [Documentation](https://github.com/Krosebrook/autoarchitect/tree/main/docs)
- [Issues](https://github.com/Krosebrook/autoarchitect/issues)
- [Discussions](https://github.com/Krosebrook/autoarchitect/discussions)

---

Built with ❤️ by the AutoArchitect team
