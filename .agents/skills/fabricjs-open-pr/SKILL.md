---
name: fabricjs-open-pr
description: Use when opening a Fabric.js pull request. Generates a conventional-commit style PR title, writes a concise PR description, includes `close #<issue>` only when an issue is provided, updates CHANGELOG.md in `[next]` with `- <pr title> [#<prNum>](https://github.com/fabricjs/fabric.js/pull/<prNum>)`, predicts the next PR number before opening, and reconciles changelog if the actual PR number differs.
---

# Fabric.js Open PR

Use this skill when the user asks to open a PR for `fabricjs/fabric.js`.

## Inputs

Collect or infer:

- Branch to open
- Base branch (default `master`)
- Issue number to close (optional)
- Short summary of changes (for title/description)

Issue-number handling:

- If the thread already includes an issue number, reuse it and do not ask again.
- If the user explicitly says there is no issue, do not ask for one and omit issue-closing text.
- Otherwise, ask the user for the issue number before creating the PR body.

## Title Rules

Create a short meaningful title using conventional commits style:

- Format: `<type>(<optional-scope>): <summary>`
- Allowed common types: `feat`, `fix`, `docs`, `ci`, `test`, `refactor`, `chore`
- Keep summary short and specific.
- Use lowercase type and scope.

Examples:

- `ci(): fix coverage artifact download in comment workflow`
- `fix(coverage): flatten playwright istanbul output`
- `docs(changelog): align next entry format`

## Required PR Body

PR body must include:

- One short description paragraph of what changed and why
- A compact bullet list of key changes
- Closing reference exactly `close #<issue-num>` only when an issue number is provided

## Changelog Update (Mandatory)

Before opening the PR, ensure `CHANGELOG.md` under `## [next]` contains one line in this style:

`- <pr title> [#<predictedPrNum>](https://github.com/fabricjs/fabric.js/pull/<predictedPrNum>)`

Rules:

- Use the exact PR title text.
- Insert near the top of the `[next]` list.
- Keep existing formatting untouched.

## Predict Next PR Number Before Opening

From repo root, determine next issue/PR number:

```bash
latest_num=$(gh api repos/fabricjs/fabric.js/issues --paginate -F per_page=1 -F state=all --jq '.[0].number' | head -n1)
predicted_pr_num=$((latest_num + 1))
```

Preferred faster command (usually enough):

```bash
latest_num=$(gh api repos/fabricjs/fabric.js/issues?state=all\&per_page=1 --jq '.[0].number')
predicted_pr_num=$((latest_num + 1))
```

Use `predicted_pr_num` in the changelog line before creating PR.

## Open PR Workflow

1. Confirm branch has intended commits.
2. Build PR title using conventional-commit style.
3. Resolve issue reference from thread context using the issue-number handling rules above.
4. If an issue number is provided, include `close #<issue-num>` in PR body; otherwise do not include issue-closing text.
5. Before any commit or PR creation, run quality checks:

```bash
npm run lint
npm run prettier:check
```

6. Sync with latest `master` before opening the PR:

```bash
git fetch origin master
git merge origin/master
```

7. If merge conflicts exist, resolve them before continuing.
8. Predict next PR number.
9. Update `CHANGELOG.md` `[next]` line with predicted number and title.
10. Commit and push changelog/title-related edits. Never use `--no-verify`; pre-commit hooks must run and pass.
11. If hooks modify files or fail, stage fixes and recommit until hooks pass.
12. Create PR with `gh pr create --base <base> --head <branch> --title "<title>" --body-file <file>`.
13. Fetch actual PR number.
14. If actual number differs from prediction:
    - Update the changelog line to actual number/link.
    - Commit and push the correction.
    - Optionally update PR body with a short note if needed.

## Existing PR Maintenance

If the user asks to finish or unblock an existing Fabric.js PR:

1. Fetch fresh `origin/master`.
2. If the PR is behind base or blocked by merge conflicts, merge `origin/master` into the PR branch locally.
3. If the conflict involves only `CHANGELOG.md`, resolve it locally as part of the merge instead of asking the user whether to do that.
4. Push the merge commit to the PR branch.
5. Only pause to ask the user if the conflict touches files beyond `CHANGELOG.md` or if the resolution is ambiguous.

## Verification Checklist

Before finishing, verify:

- PR title follows conventional commit style and matches changelog text.
- PR body includes description.
- If an issue number is provided, PR body includes `close #<issue-num>`.
- `npm run lint` passes.
- `npm run prettier:check` passes.
- Any commit made for this PR was created without `--no-verify` and pre-commit hooks passed.
- Branch was synced with latest `master` before PR creation.
- When maintaining an existing PR, `origin/master` was merged into the PR branch if that was enough to clear a `CHANGELOG.md`-only conflict.
- `CHANGELOG.md` has exactly one new `[next]` line for this PR.
- Link uses `https://github.com/fabricjs/fabric.js/pull/<prNum>`.
- If prediction mismatched, changelog has been corrected and pushed.
