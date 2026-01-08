# Documentation Governance Policy (DOC_POLICY)

## 1. Scope and Purpose
This policy governs the creation, modification, and verification of all documentation within this repository. It ensures that documentation remains a reliable "Source of Truth" for both human operators and Documentation Authority Agents (DAA).

### Required Documentation Set
The following files are mandatory and must be maintained:
- `llms.txt`: Entry point for LLM-based discovery.
- `docs/DOC_POLICY.md`: This governance policy.
- `docs/SECURITY.md`: Security posture and threat model.
- `docs/ARCHITECTURE.md`: High-level system design and data flow.
- `docs/FRAMEWORK.md`: Implementation stack and boundaries.
- `docs/CHANGELOG.md`: Versioned history of significant changes.
- `docs/AGENTS_DOCUMENTATION_AUTHORITY.md`: System prompt for documentation agents.

## 2. Authority Model
- **Human Authority**: Ultimate approval for all changes.
- **Documentation Authority Agent (DAA)**: Authorized to perform incremental updates to the documentation set, provided they adhere to the provenance rules.

## 3. Provenance and Evidence Rules
Every new or modified documentation section must include a provenance footer:
- **Source**: {code | config | git | standard}
- **Locator**: {file paths | commit SHAs | URL}
- **Confidence**: {HIGH | MEDIUM | LOW}
- **Last Verified**: YYYY-MM-DD

### Fail-Closed Condition
If information cannot be verified through direct evidence (Source/Locator), it must be marked:
> **Status**: UNKNOWN  
> **Action Required**: Human Review  
> **Confidence**: LOW  

If >20% of a document's sections are marked with LOW confidence, the DAA must stop and request human intervention.

## 4. Incremental Updates vs. Rewrites
- **Rule**: Updates must be incremental. Do not rewrite existing sections unless they are explicitly proven incorrect.
- **Override**: Entire file rewrites are only permitted if `DOC_REWRITE_APPROVED=true` is set in the environment.

## 5. ADR (Architecture Decision Records)
- ADRs are append-only.
- If a decision is superseded, create a new ADR and link to the old one marking it "Superseded".

## 6. Automation and Kill-Switch
- Auto-rebuilding of `llms-full.txt` via CI is enabled by default.
- Auto-committing changes to `llms-full.txt` is controlled by `DOC_AUTOMATION_ENABLED`.
- **Emergency Kill-Switch**: Setting `DOC_AUTOMATION_ENABLED=false` disables all automated commits.

---
**Source**: standard  
**Locator**: docs/DOC_POLICY.md  
**Confidence**: HIGH  
**Last Verified**: 2025-05-22