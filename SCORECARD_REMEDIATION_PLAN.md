# OpenSSF Scorecard Remediation Plan

Last updated: 2026-04-18

Current public Scorecard snapshot for `github.com/fabricjs/fabric.js`:

- Aggregate score: `6.1 / 10`
- Report date: `2026-04-18T07:39:30Z`
- Reported commit: `f80aa89a0614f1936952d53557ed46abd94f8d6f`

Checks below `10`:

- `Dangerous-Workflow`: `0`
- `Token-Permissions`: `0`
- `Fuzzing`: `0`
- `CII-Best-Practices`: `0`
- `Code-Review`: `5`
- `Pinned-Dependencies`: `7`
- `Binary-Artifacts`: `8`
- `CI-Tests`: `8`
- `SAST`: `9`
- `Packaging`: `-1`
- `Signed-Releases`: `-1`
- `Branch-Protection`: `-1`

## Priority Order

1. Harden GitHub Actions workflows.
2. Remove or replace checked-in binaries.
3. Make release and packaging workflows easier for Scorecard to detect.
4. Tighten GitHub branch protection and required-check settings.
5. Add fuzzing and signed release provenance.
6. Complete OpenSSF Best Practices badge requirements.

## Action Plan

### 1. CI hardening

- Replace the Sonar workflow's explicit `head_sha` / `head_branch` checkouts.
- Keep fork PR support by using an untrusted test workflow followed by a privileged analysis workflow that does not build or install from the fork in the privileged context.
- Avoid explicit `head_sha` / `head_branch` checkouts in privileged follow-up workflows when a safer ref or merge ref is available.
- Reduce workflow token permissions to read-only by default and grant writes only where they are required.
- Add missing top-level permissions declarations so Scorecard can see least-privilege defaults.
- Pin any remaining third-party actions by full commit SHA.

### 2. Binary artifacts

- Remove `lib/google_closure_compiler.jar` if it is no longer used.
- Remove `lib/yuicompressor-2.4.6.jar` if it is no longer used.
- If either file is still needed, fetch it during CI or replace it with maintained npm tooling.

### 3. Packaging and release signals

- Simplify the npm release workflow so Scorecard can detect an official packaging path.
- Prefer `npm ci` over `npm install` in publish workflows.
- Move opaque publish logic out of `publish.js` where possible and keep the publish command explicit in workflow YAML.
- Evaluate `npm publish --provenance` for stronger release provenance.

### 4. Repository settings

- Enable or verify branch protection rules for `master`, `5.x`, and `6.x`.
- Require pull requests, approvals, stale-review dismissal, and up-to-date checks before merge.
- Make CI and CodeQL required checks for protected branches.
- Configure a fine-grained `SCORECARD_TOKEN` so the Scorecard action can read branch protection state.

### 5. Longer-horizon security work

- Add focused fuzz targets for SVG parsing, path parsing, JSON deserialization, and text/layout edge cases.
- Publish signed release artifacts or attestations alongside GitHub Releases.
- Apply for the OpenSSF Best Practices badge after workflow and policy gaps are closed.

## First implementation pass

This branch starts with the CI hardening items:

- Sonar workflow redesign
- obvious permission tightening in CI workflows
- documentation of the remaining Scorecard work
