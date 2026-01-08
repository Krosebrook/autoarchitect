# Security Posture

## Threat Model
The application operates as a Client-Side Progressive Web App (PWA).

### Primary Threat Actors
1. **Malicious Inputs**: Prompt injection targeting Gemini models.
2. **Local Data Theft**: Unauthorized access to browser IndexedDB storage.
3. **API Exfiltration**: Interception of Gemini API traffic.

## Prompt Injection
- **Status**: UNKNOWN
- **Action Required**: Human Review of sanitation logic in `services/geminiService.ts`.
- **Confidence**: LOW

## NHI (Non-Human Identity)
- **Status**: UNKNOWN
- **Locator**: `process.env.API_KEY` usage in `services/geminiService.ts`.
- **Action Required**: Human confirmation of key rotation and access policies.
- **Confidence**: MEDIUM

## Egress
Egress is restricted to `googleapis.com` for model interaction and `esm.sh` / `gstatic.com` for library loading.

## Patch Policy
Third-party dependencies are loaded via `esm.sh` with specific version tags (e.g., `@google/genai@1.34.0`).

## Incident Response
In case of suspected API key compromise, rotate the key in the execution environment immediately.

## Kill Switch
Documentation automation kill-switch: `DOC_AUTOMATION_ENABLED=false`.

---
**Source**: code|config  
**Locator**: services/geminiService.ts, index.html  
**Confidence**: MEDIUM  
**Last Verified**: 2025-05-22