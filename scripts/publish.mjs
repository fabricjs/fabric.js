import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { wd } from './dirname.mjs';
import { publishablePackages } from './workspace-packages.mjs';

export function validateRelease(
  tagName,
  isPrerelease,
  packages = publishablePackages,
) {
  if (isPrerelease !== 'true' && isPrerelease !== 'false') {
    throw new Error('Prerelease must be true or false.');
  }
  const manifests = packages.map(({ dir, importName }) => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(dir, 'package.json'), 'utf8'),
    );
    if (pkg.name !== importName || pkg.private) {
      throw new Error(`Expected a public ${importName} package in ${dir}.`);
    }
    return pkg;
  });
  const version = manifests[0].version;
  if (tagName !== version && tagName !== `v${version}`) {
    throw new Error(`Release tag must be ${version} or v${version}.`);
  }
  for (const pkg of manifests) {
    if (pkg.version !== version) {
      throw new Error(`${pkg.name} is ${pkg.version}; expected ${version}.`);
    }
  }
  if (version.split('+')[0].includes('-') !== (isPrerelease === 'true')) {
    throw new Error(`Prerelease flag does not match version ${version}.`);
  }
  return isPrerelease === 'true' ? 'beta' : 'latest';
}

if (import.meta.main) {
  try {
    const [tagName, isPrerelease, mode = '--check', ...extra] =
      process.argv.slice(2);
    if (!['--check', '--dry-run', '--publish'].includes(mode) || extra.length) {
      throw new Error(
        'Usage: node scripts/publish.mjs <tag> <true|false> [--check|--dry-run|--publish]',
      );
    }
    const npmTag = validateRelease(tagName, isPrerelease);
    console.log(
      `Validated ${publishablePackages.length} packages for ${tagName} (${npmTag}).`,
    );
    if (mode !== '--check') {
      const args = [
        ...publishablePackages.flatMap(({ importName }) => [
          '--filter',
          importName,
        ]),
        '-r',
        'publish',
        '--tag',
        npmTag,
        '--access',
        'public',
        '--no-git-checks',
        ...(mode === '--dry-run' ? ['--dry-run'] : []),
      ];
      const result = cp.spawnSync('pnpm', args, { cwd: wd, stdio: 'inherit' });
      if (result.error) {
        throw result.error;
      }
      process.exitCode = result.status ?? 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
