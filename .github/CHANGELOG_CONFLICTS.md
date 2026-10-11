# Changelog conflict resolver

When a human maintainer approves a conflicted PR into `master`, the action merges
`master` into its branch using Git's `union` driver only for the root `CHANGELOG.md`.
If the merge succeeds, it pushes a merge commit as `github-actions[bot]`. If any
conflict remains, it stops without pushing. Cleanly merged changes from `master`
are included.

Review, approve, let the bot update the branch, then review the changelog result
and approve again if GitHub dismissed the first approval. A second approval does
nothing once GitHub reports the PR as mergeable.

Union keeps both versions of conflicting lines, including edits to existing
entries or release headings; it does not understand changelog structure. Review
the resulting changelog before merging.

The script runs from `master` in a temporary checkout with hooks and filters
disabled. It overrides PR merge attributes so other files use the text driver.
It checks the approved head and reviewer write access, then rechecks the PR and
approval before pushing. An explicit head-SHA lease rejects concurrent branch
updates. Fork and Dependabot PRs are excluded.

The workflow needs to be on `master` for a live approval-event trial. Bot pushes
using `GITHUB_TOKEN` do not normally trigger other workflows; verify the project's
CI requirements during that trial.
