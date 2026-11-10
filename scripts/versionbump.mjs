import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';
import { publishablePackages } from './workspace-packages.mjs';

const numericIdentifier = '(?:0|[1-9]\\d*)';
const prereleaseIdentifier = `(?:${numericIdentifier}|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)`;
const semverPattern = new RegExp(
  `^${numericIdentifier}\\.${numericIdentifier}\\.${numericIdentifier}(?:-${prereleaseIdentifier}(?:\\.${prereleaseIdentifier})*)?(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?$`,
);

export function validateVersion(version) {
  if (!version || !semverPattern.test(version)) {
    throw new Error(
      `Version must be a valid SemVer value, for example 7.5.0 or 7.5.0-beta.2; received ${version ?? '<missing>'}.`,
    );
  }
  return version;
}

function readPackage({ dir, importName }) {
  const manifestPath = path.join(dir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (packageJson.name !== importName || packageJson.private) {
    throw new Error(`Expected a public ${importName} package in ${dir}.`);
  }
  return { dir, importName, version: packageJson.version };
}

export function createVersionBumpPlan(version, packages = publishablePackages) {
  validateVersion(version);
  const manifests = packages.map(readPackage);
  const currentVersions = new Set(
    manifests.map(({ version: current }) => current),
  );
  if (currentVersions.size !== 1) {
    throw new Error(
      `Release packages are not aligned: ${manifests.map(({ importName, version: current }) => `${importName}@${current}`).join(', ')}.`,
    );
  }
  const currentVersion = manifests[0].version;
  if (currentVersion === version) {
    throw new Error(`Packages are already at version ${version}.`);
  }
  return manifests.map(({ importName, version: current }) => ({
    importName,
    from: current,
    to: version,
  }));
}

export function releaseTagNames(version) {
  return [`v${version}`, version];
}

function runGit(args) {
  const result = cp.spawnSync('git', args, {
    cwd: wd,
    encoding: 'utf8',
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

export function findExistingReleaseTags(version) {
  const tagNames = releaseTagNames(version);
  const localTags = new Set();
  for (const tag of tagNames) {
    const result = runGit(['tag', '--list', tag]);
    if (result.status !== 0) {
      throw new Error(
        result.stderr.trim() || 'Unable to inspect local Git tags.',
      );
    }
    if (result.stdout.trim()) {
      localTags.add(tag);
    }
  }

  const remote = runGit([
    'ls-remote',
    '--tags',
    'origin',
    ...tagNames.map((tag) => `refs/tags/${tag}`),
  ]);
  if (remote.status !== 0) {
    throw new Error(
      remote.stderr.trim() || 'Unable to inspect release tags on origin.',
    );
  }
  const remoteTags = new Set(
    remote.stdout
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => line.split('\t')[1]?.replace('refs/tags/', ''))
      .filter(Boolean),
  );
  return [...new Set([...localTags, ...remoteTags])];
}

function assertCleanWorkingTree() {
  const result = runGit(['status', '--porcelain']);
  if (result.status !== 0) {
    throw new Error(
      result.stderr.trim() || 'Unable to inspect the working tree.',
    );
  }
  if (result.stdout.trim()) {
    throw new Error(
      'Working tree is not clean. Commit or stash existing changes before running versionbump.',
    );
  }
}

function printPlan(plan, tags) {
  console.log('Version bump dry run:');
  for (const { importName, from, to } of plan) {
    console.log(`  ${importName}: ${from} → ${to}`);
  }
  if (tags.length) {
    throw new Error(`Release tag already exists: ${tags.join(', ')}`);
  }
  console.log(
    `  Release tags available: ${releaseTagNames(plan[0].to).join(', ')}`,
  );
}

function applyVersionBump(version) {
  const args = [
    '-r',
    ...publishablePackages.flatMap(({ importName }) => [
      '--filter',
      importName,
    ]),
    'version',
    version,
    '--no-git-tag-version',
    '--no-git-checks',
  ];
  const result = cp.spawnSync('pnpm', args, { cwd: wd, stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

if (import.meta.main) {
  try {
    const [version, ...options] = process.argv.slice(2);
    if (!version || options.some((option) => option !== '--dry-run')) {
      throw new Error('Usage: pnpm versionbump <version> [--dry-run]');
    }
    const plan = createVersionBumpPlan(version);
    if (!options.includes('--dry-run')) {
      assertCleanWorkingTree();
    }
    const tags = findExistingReleaseTags(version);
    printPlan(plan, tags);
    if (!options.includes('--dry-run')) {
      applyVersionBump(version);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
