# GitHub Actions Security Reference

This repository has been configured to require all GitHub Actions to be pinned to specific commit SHAs for security compliance.

## Current Pinned Actions

### Core GitHub Actions

```yaml
# Checkout repository
uses: actions/checkout@692973e3d937129bcbf40652eb9f2f61becf3332 # v4.1.7

# Setup Node.js
uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0

# Cache dependencies
uses: actions/cache@0400d5f644dc74513175e3cd8d07132dd4860809 # v4.2.4

# Upload artifacts
uses: actions/upload-artifact@bbbca2ddaa5d8feaa63e36b76fdaad77386f024f # v7.0.0

# Download artifacts
uses: actions/download-artifact@3e5f45b2cfb9172054b4087a40e8e0b5a5461e7c # v8.0.1

# Run GitHub scripts
uses: actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea # v6.4.1
```

### CodeQL Security Scanning

```yaml
# Initialize CodeQL
uses: github/codeql-action/init@192325c86100d080feab897ff886c34abd4c83a3 # v3.30.3

# Analyze with CodeQL
uses: github/codeql-action/analyze@192325c86100d080feab897ff886c34abd4c83a3 # v3.30.3
```

### Third-Party Actions

```yaml
# Find/create/update comments

uses internal fork of edumserrano/find-create-or-update-comment@82880b65c8a3a6e4c70aa05a204995b6c9696f53 # v3.0.0
locked to:
peter-evans/create-or-update-comment@71345be0265236311c031f5c7866368bd1eff043 # v4.0.0
peter-evans/find-comment@3eae4d37986fb5a8592848f6a574fdf654e61f9e # v3.1.0
# Populate form versions
uses: ShaMan123/gha-populate-form-version@421e9fce0e1fcfa18a3d5e00d6b1b2fe0d23bb31 # v2.0.1

# Create pull requests
uses: peter-evans/create-pull-request@b4d51739f96fdb3c8a695b057b86bcb2db15eb79 # v4.1.3
```

## How to Update Actions

When updating actions to newer versions:

1. **Find the new release tag** (e.g., `v4.2.0`)
2. **Get the commit SHA** for that tag from the GitHub releases page
3. **Update the reference** using the format: `action@sha # version`
4. **Test the workflow** to ensure it works with the new version

## Tools for Managing Pinned Actions

Consider using tools like:

- [Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot) for automated updates
- [pin-github-action](https://github.com/mheap/pin-github-action) for CLI pinning
- [action-validator](https://github.com/mpalmer/action-validator) for validation

## Fork pull requests and reporting

PR builds and tests have read-only tokens and no persisted checkout credentials.
Reporting uses `workflow_run` so fork contributions can receive comments without
receiving a write token. All executable helpers are loaded from the immutable
`github.sha` of the default-branch reporting workflow, never from the PR checkout.

`workflow-reports.cjs` re-fetches the triggering run and resolves its current PR
through GitHub's API, including when `workflow_run.pull_requests` is empty. It
checks the workflow path, repository, head repository, branch and commit. Closed,
superseded and ambiguous PRs are not updated. Artifacts cannot select a PR number,
repository, branch or executable command; reports are bounded and treated as data.

| Job                                | Elevated access                               | Executed code                             |
| ---------------------------------- | --------------------------------------------- | ----------------------------------------- |
| Coverage/build-statistics comments | PR comments                                   | Trusted helpers only                      |
| Build-statistics baseline          | None                                          | Default-branch build and dependencies     |
| Changelog update                   | Contents and PR comments                      | Trusted GitHub API helper only            |
| Sonar source preparation           | None                                          | Trusted Python helper and Git blob reads  |
| Sonar scan                         | Existing `SONAR_TOKEN`, no GitHub write token | Pinned scanner with trusted configuration |

The changelog updater can commit only `CHANGELOG.md` to an existing same-repository
PR branch. Updates are non-force and based on the validated head commit. For forks
it posts the required entry; the repository token cannot push to contributors'
forks, and no cross-repository PAT is used.

Sonar preparation never runs checkout filters, hooks, package installs or PR
scripts. It stages regular source files and Git history in a separate directory,
rejects source symlinks, and supplies Sonar/TypeScript configuration from the
trusted branch. Coverage paths must resolve to staged source files. The secret is
provided only to the subsequent scanner job. The scanner uses the runner's Node
executable, not a path supplied by the PR. This retains the normal trust in the
pinned scanner and its analyzers to parse untrusted source safely.

`workflow_run` trigger warnings still require review: the separation above is
intentional, and adding a PR checkout, package install or artifact-selected script
to a privileged job would violate it. Changes to these reporting workflows become
active after merging to the default branch. Test fork reporting after merge,
including an update to the fork while an older run is completing.

Run the local security regression tests with:

```sh
node --test .github/scripts/*.test.cjs
python3 -B -m unittest discover -s .github/scripts -p 'test_*.py'
```

The npm release workflow deliberately omits the `cache` input on the pinned
`setup-node` v4 action, where caching is opt-in. Tools that assume the automatic
npm caching introduced in later major versions may still flag that step. The
existing Dependabot cooldown recommendation and local-action syntax suggestions
are separate policy/maintenance findings, not permissions granted to fork code.
