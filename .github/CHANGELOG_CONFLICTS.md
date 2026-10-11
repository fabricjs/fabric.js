# Changelog conflict resolver

When a maintainer approves a PR into `master`, the resolver checks whether GitHub
reports merge conflicts. It repairs the PR only if the conflict is confined to
new, single-line entries under `CHANGELOG.md`'s `[next]` section. Both branches'
additions survive; identical additions appear once. Existing entries and release
history must be unchanged.

The intended evening review flow is:

1. Review the PR and approve it, even if the changelog conflicts.
2. The action pushes a merge commit authored and committed by `github-actions[bot]`.
3. Review the update, approve again if GitHub dismissed the first approval, and merge.

The second approval does nothing if the branches now merge cleanly. The action
never approves or merges the PR into `master` itself. It does not scan other PRs
or run again merely because `master` changes.

This first version supports branches inside `fabricjs/fabric.js`. Fork PRs and
Dependabot PRs need a separate permissions design. Approval must come from
a human with write access and refer to the current PR head.

The workflow loads its resolver from `master`, and processes Git objects in a
temporary bare repository. It does not check out or execute PR code, install PR
dependencies, or run hooks. GitHub's API supplies the overall conflict status;
`git merge-tree` supplies the conflicting paths. PR merge attributes are overridden
with the ordinary text merge driver before inspecting conflicts.

The resulting commit has the reviewed PR head as its first parent and `master`
as its second parent. Cleanly merged changes from `master` are included. The
changelog is the only manually resolved file. A push with an explicit head-SHA
lease prevents concurrent contributor changes, including rebases, from being
overwritten; the new commit always extends the reviewed head.

Skipped cases are reported in the workflow log. Code conflicts, edits or deletions
of existing entries, changed release sections, and differing entries with the
same new PR link require human resolution.

Run the standalone tests with:

```sh
node --test .github/scripts/resolve-changelog-conflict.test.mjs
```

To try this on GitHub, the workflow and resolver must first be present on `master`.
Local tests verify merging and push races, but cannot verify delivery of an
approval event on a conflicted PR. The first live trial should use two repository
branches with competing changelog additions. Updates using `GITHUB_TOKEN` may
require approving subsequent CI workflow runs separately from the PR review.
