# AGENTS.md instructions for /Users/andreabogazzi/develop/fabric.js

This file defines how coding agents should operate in this repository.

## Project

- Repository: `fabricjs/fabric.js`
- Language: TypeScript/JavaScript
- Package manager: `npm`
- Runtime: Node `>=20`
- Main test stacks: `vitest` (unit) and `playwright` (e2e)

## Repository Priorities

- Keep changes focused and minimal.
- Preserve existing architecture and naming style.
- Avoid broad refactors unless explicitly requested.
- Prefer fixing root causes over adding workarounds.

## Setup

Run from repo root:

```bash
npm i --include=dev
```

## Common Commands

- Build: `npm run build`
- Fast build: `npm run build:fast`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Format check: `npm run prettier:check`
- Format write: `npm run prettier:write`
- Unit tests (node): `npm run test:vitest`
- Unit tests with coverage: `npm run test:vitest:coverage`
- E2E tests: `npm run test:e2e`
- E2E typecheck: `npm run playwright:typecheck`

## Testing Expectations

- Add or update tests for behavior changes.
- Prefer targeted test runs while iterating, then run relevant full suites before finalizing.

## Code Style

- Follow existing project style and patterns.
- Keep imports stable; do not reorder unless necessary.
- Use concise comments only when code is not obvious.
- Avoid unrelated formatting-only diffs in touched files.

## PR and Changelog Workflow

- Use clear, short PR titles.
- Prefer conventional-commit style in titles when possible:
  - `feat`, `fix`, `docs`, `ci`, `test`, `refactor`, `chore`
- Add `close #<issue-num>` in PR body only when an issue number exists; if the user states there is no issue, omit it.
- Ensure `CHANGELOG.md` (`## [next]`) is updated for notable changes.
- Keep changelog entry style consistent with existing lines.

## In-Repo Skills

Agents should check and use repository skills when tasks match.

Available skill:

- `fabricjs-open-pr`
  - Path: `.codex/skills/fabricjs-open-pr/SKILL.md`
  - Use when opening PRs for this repository.
  - Handles PR title/body quality, optional `close #<issue-num>`, changelog entry, and predicted PR number flow.

## Skill Trigger Guidance

Use the `fabricjs-open-pr` skill when any of these apply:

- User asks to open/create a PR.
- User asks to prepare PR metadata (title/body/changelog).
- User asks to include issue-closing syntax like `close #123`.

## Git Safety

- Never discard user changes unless explicitly asked.
- Do not use destructive git commands without explicit instruction.
- Commit only files relevant to the requested task.

## Communication

- Be concise and factual.
- Surface assumptions and blockers early.
- When something cannot be verified locally, state that clearly.
