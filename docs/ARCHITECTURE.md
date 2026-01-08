# Architecture Overview

## Overview
AutoArchitect is a client-side React PWA designed for synthesizing automation workflows. It follows a decoupled "Synthesis-Audit-Deploy" pattern.

## Modules
- **Generator**: Synthesizes blueprints from user descriptions using Gemini 3 Pro.
- **Audit**: Security and ROI analysis via Gemini 3 Pro.
- **Sandbox**: Logical trace simulation.
- **Vault**: Persistent storage using IndexedDB (Dexie).
- **Terminal**: CLI bridge to GenAI SDK.

## Data Flow
1. User Input -> `AutomationGeneratorView`.
2. `geminiService` -> Gemini API (SSL).
3. Blueprint Response -> UI state + `Dexie` (Local DB).
4. Vault Export -> Local JSON download.

## Orchestration Pattern
- **Status**: UNKNOWN
- **Action Required**: Confirm if multi-agent orchestration is managed by frontend or serverless bridge.
- **Confidence**: LOW

## Trust Boundaries
- **Client/Browser**: Trusted (User controlled).
- **Gemini API**: Semi-trusted (Privacy boundaries apply).
- **Public CDN (esm.sh)**: Semi-trusted (integrity checked via versioning).

## Failure Modes
- **Offline**: Functional for vault/history, synthesis requires reconnect.
- **API Quota**: Handled by exponential backoff in `geminiService`.

---
**Source**: code|ARCHITECTURE.md (root)  
**Locator**: App.tsx, services/geminiService.ts, ARCHITECTURE.md  
**Confidence**: HIGH  
**Last Verified**: 2025-05-22