import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { publishablePackages } from './workspace-packages.mjs';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function packStats({ dir, importName }) {
  const output = execFileSync(
    npm,
    ['pack', '--json', '--dry-run', '--ignore-scripts'],
    {
      cwd: dir,
      encoding: 'utf8',
    },
  );
  const [result] = JSON.parse(output);

  if (result.name !== importName) {
    throw new Error(
      `Expected ${importName} package metadata, got ${result.name}`,
    );
  }

  return {
    tarball: result.size,
    unpacked: result.unpackedSize,
  };
}

export function packageStats() {
  return Object.fromEntries(
    publishablePackages.map((pkg) => [pkg.importName, packStats(pkg)]),
  );
}
