# Fabric.js repository instructions

This file defines how coding agents should operate in this repository.

## Project

- Repository: `fabricjs/fabric.js`
- Language: TypeScript/JavaScript
- Package manager: `pnpm`
- Declared library runtime: Node `>=20`.
- Development: use Node 24.x, matching primary CI and satisfying workspace engine requirements.
- Main test stacks: `vitest` (unit) and `playwright` (e2e)

## Repository Layout

- `packages/core/src`: shared, environment-neutral library runtime.
- `packages/browser/src`: browser entrypoint and environment setup.
- `packages/node/src`: Node entrypoint and environment setup; keep Node-specific dependencies such as `canvas` and `jsdom` here, out of core and browser packages.
- `packages/e2e`: Playwright tests and browser test scenes.
- `packages/website`: documentation and demos; read [its AGENTS.md](packages/website/AGENTS.md) before working there.

For package boundaries and legacy `fabric` compatibility entrypoints, see [Packages and migration](README.md#packages-and-migration) and the affected package's README.

## Repository Priorities

- Keep changes focused and minimal.
- Preserve existing architecture and naming style.
- Avoid broad refactors unless explicitly requested.
- Prefer fixing root causes over adding workarounds.

## Setup

Run from repo root:

```bash
pnpm install --frozen-lockfile
```

Use `pnpm install` when dependency changes require updating `pnpm-lock.yaml`.

## Validation

The [pre-commit hook](.husky/pre-commit) runs `pnpm run lint`, `pnpm run prettier:check`, and `pnpm run typecheck`. Let the hook perform these checks when committing. When handing off code changes without a commit, or if the hook did not run, run them manually. Avoid repeating successful checks unless relevant files changed.

Run commands from the repository root. Select additional checks based on the change; other scripts are listed in [package.json](package.json).

- Unit tests: the same test files run in Node/jsdom, Chromium, and Firefox. Run affected tests across all three with `pnpm run test:vitest:all <test-file>`; `pnpm run test:vitest <test-file>` runs only Node/jsdom and is useful for quick iteration.
- Browser interactions: run relevant E2E tests with `pnpm run test:e2e`; it already builds Fabric and typechecks E2E tests.
- Package exports or distribution: run `pnpm run build`, then `pnpm run smoke:packages`.
- Website: follow [the website instructions](packages/website/AGENTS.md) for validation and build prerequisites.
- Documentation-only changes outside the website: verify any changed links or commands; library tests are unnecessary.

## Testing Expectations

- Add or update tests for behavior changes.
- Prefer targeted test runs while iterating, then run relevant full suites before finalizing.
- Keep tests minimal. Be mindful of the number of tests you add.
- **Extend before you add**: before you write a new test, look for an existing test that covers the same feature or code path.
- If one exists, add the new edge case or assertion to it.
- Create a new test only when no existing test is a good fit, or when the new scenario needs a different setup.

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

## In-Repo Skills

Use [fabricjs-open-pr](.agents/skills/fabricjs-open-pr/SKILL.md) when any of these apply:

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
