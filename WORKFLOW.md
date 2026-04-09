# GREENLABS.Studio — Agent Workflow

## Dependency Order (STRICT)
```
ARCHITECT → DB-BUILDER + AUTH-BUILDER (parallel) → UI-BUILDER + DEBUGGER (parallel) → CODE-REVIEWER → SECURITY-AUDIT → DOCUMENTER
```

## File Ownership (No Conflicts)
| Agent | Directories | Can Modify |
|---|---|---|
| architect | docs/ | docs/architecture.md, docs/data-models.md |
| db-builder | supabase/ | supabase/migrations/, supabase/seed.sql |
| auth-builder | src/core/auth/, supabase/ | src/core/auth/*, supabase RLS policies |
| ui-builder | src/components/, src/styles/, src/pages/ | All frontend files |
| debugger | src/ | Any src/ file (bug fixes only) |
| code-reviewer | — | Read-only |
| security-audit | — | Read-only |
| documenter | docs/ | docs/*.md, README.md |
| orchestrator | docs/ | docs/agent-notes.md, docs/tasks/ |

## Rules
- Architect MUST complete before any builder starts
- db-builder and auth-builder CAN run in parallel (non-overlapping dirs)
- ui-builder and debugger CAN run in parallel
- Code review MUST happen before security audit
- No agent commits — Adrian runs all git commands
- All schema/auth changes require Adrian approval
