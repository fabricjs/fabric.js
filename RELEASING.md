# Publishing Fabric packages

Use Node 24 and the repository's pinned pnpm version. The release includes
`fabric` and the eight scoped packages listed in
[`scripts/workspace-packages.mjs`](scripts/workspace-packages.mjs).
The website (`www-fabric-com`) and E2E package are private.

## Prepare a release

Update all nine library package versions together, then refresh the lockfile
with `pnpm install --lockfile-only`. Commit the release changes before creating
the Git tag. Tags must match the package version, optionally prefixed with `v`:
for example, `v7.5.0-beta.1`.

Run from the repository root:

```sh
pnpm run lint
pnpm run prettier:check
pnpm run typecheck
node --test scripts/publish.test.mjs
node scripts/publish.mjs v7.5.0-beta.1 true
pnpm run build
pnpm run smoke:packages
node scripts/publish.mjs v7.5.0-beta.1 true --dry-run
```

Without a mode flag, the publish script only validates the release. It rejects
mismatched versions, package names, private library packages, and prerelease
flag mismatches. The flag `true` selects the npm `beta` tag; `false` selects
`latest` and requires a stable version.

## First publish of new npm packages

New package names need an initial authenticated publish before npm trusted
publishing can be configured. With an npm account authorized to publish to
the `fabricjs` organization, run `npm whoami` (or `npm login` if necessary).
After the checks and dry run above pass, publish locally:

```sh
node scripts/publish.mjs v7.5.0-beta.1 true --publish
```

This command publishes all nine selected library packages publicly under
`beta`, including the legacy `fabric` facade. pnpm resolves workspace and
catalog dependencies when packaging; do not substitute `npm publish` on
the source manifests. npm may require interactive two-factor authentication.
Already published versions are skipped by pnpm's recursive publishing.

For each package, configure its npm trusted publisher with:

- GitHub organization: `fabricjs`
- Repository: `fabric.js`
- Workflow filename: `npmpublish.yml`
- Environment: leave empty (the workflow does not use an environment)
- Allowed action: direct publishing with `npm publish`

See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).
Trusted publishing requires npm 11.5.1 or later. A new trust configuration
must complete a successful publish within npm's activation window; configure
it when the next release is ready.

## Subsequent releases from GitHub

Push the release commit and its matching tag, then publish a GitHub release
with **Set as a pre-release** enabled for beta versions. Alternatively, run
the **Node.js Package** workflow manually with that tag and
`is_prerelease: true`. For stable versions, use `false`.

The workflow checks out the tag, validates the release, builds, smoke-tests,
and publishes only the library packages using npm trusted publishing.
Creating a GitHub release does not update package versions. Do not trigger
the workflow for the initial release before its new packages have npm
authentication configured.
