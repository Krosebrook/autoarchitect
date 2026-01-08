# Framework and Implementation Stack

## Frontend Stack
- **Library**: React 18 (esm.sh)
- **Styling**: Tailwind CSS (CDN)
- **Icons**: Lucide-React
- **Database**: Dexie.js (IndexedDB)
- **PWA**: Service Worker (`sw.js`)

## LLM Models and Roles
- **Gemini 3 Pro Preview**: Primary architect for complex logic and auditing.
- **Gemini 3 Flash Preview**: Documentation and manual synthesis.
- **Gemini 2.5 Flash Native Audio**: Live architect sessions.
- **Gemini 2.5 Flash TTS**: Procedure manual audio synthesis.

## Tooling Boundaries
- No backend server.
- No third-party analytics (verified in `index.html`).
- State management via React `useState` and `Dexie`.

## CI/CD Hooks
- **Documentation Authority**: Validates and builds documentation context.
- **Locator**: `.github/workflows/docs-authority.yml`.

---
**Source**: code|config  
**Locator**: index.html, services/geminiService.ts, package.json (conceptually)  
**Confidence**: HIGH  
**Last Verified**: 2025-05-22