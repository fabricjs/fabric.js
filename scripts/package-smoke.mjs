import cp from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { wd } from './dirname.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fabric-package-smoke-'));
const packDir = path.join(tmp, 'packs');
const projectDir = path.join(tmp, 'project');
const nodeModules = path.join(projectDir, 'node_modules');

fs.mkdirSync(packDir, { recursive: true });
fs.mkdirSync(path.join(nodeModules, '@fabricjs'), { recursive: true });

const workspacePackages = [
  { dir: wd, importName: 'fabric' },
  { dir: path.join(wd, 'packages/core'), importName: '@fabricjs/core' },
  { dir: path.join(wd, 'packages/browser'), importName: '@fabricjs/browser' },
  { dir: path.join(wd, 'packages/node'), importName: '@fabricjs/node' },
];

function log(message) {
  console.log(`[package-smoke] ${message}`);
}

function run(command, args, options = {}) {
  cp.execFileSync(command, args, {
    cwd: wd,
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config_cache: path.join(tmp, 'npm-cache'),
      npm_config_loglevel: 'error',
    },
    ...options,
  });
}

function runQuiet(command, args, options = {}) {
  cp.execFileSync(command, args, {
    cwd: wd,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: {
      ...process.env,
      npm_config_cache: path.join(tmp, 'npm-cache'),
      npm_config_loglevel: 'error',
    },
    ...options,
  });
}

function packageJson(dir) {
  return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
}

function tarballName(pkg) {
  return `${pkg.name.replace(/^@/, '').replace('/', '-')}-${pkg.version}.tgz`;
}

function pack({ dir }) {
  const pkg = packageJson(dir);
  const tarball = path.join(packDir, tarballName(pkg));
  log(`Packing ${pkg.name}@${pkg.version}`);
  if (dir === wd) {
    runQuiet(
      'npm',
      ['pack', '--ignore-scripts', '--pack-destination', packDir],
      {
        cwd: dir,
      },
    );
  } else {
    runQuiet('pnpm', ['--dir', dir, 'pack', '--pack-destination', packDir]);
  }
  if (!fs.existsSync(tarball)) {
    throw new Error(`Expected tarball was not created: ${tarball}`);
  }
  const size = fs.statSync(tarball).size;
  log(`Packed ${pkg.name} (${(size / 1024).toFixed(1)} KiB)`);
  return { pkg, tarball };
}

function tarList(tarball) {
  log(`Reading tarball contents for ${path.basename(tarball)}`);
  const listFile = path.join(tmp, `${path.basename(tarball)}.list`);
  const fd = fs.openSync(listFile, 'w');
  const result = cp.spawnSync('tar', ['-tzf', tarball], {
    stdio: ['ignore', fd, 'inherit'],
  });
  fs.closeSync(fd);
  if (result.status !== 0) {
    throw new Error(`Failed to list ${tarball}`);
  }
  return fs.readFileSync(listFile, 'utf8').trim().split('\n');
}

function expectIncludes(list, file, label) {
  if (!list.includes(file)) {
    throw new Error(`${label} tarball is missing ${file}`);
  }
}

function expectExcludesPrefix(list, prefix, label) {
  if (list.some((file) => file.startsWith(prefix))) {
    throw new Error(`${label} tarball should not include ${prefix}`);
  }
}

function verifyRootTarball(list) {
  log('Checking root fabric tarball contents');
  expectIncludes(list, 'package/dist/index.min.mjs', 'fabric');
  expectIncludes(list, 'package/dist/index.node.mjs', 'fabric');
  expectIncludes(list, 'package/dist-extensions/index.mjs', 'fabric');
  expectIncludes(list, 'package/src/env/index.ts', 'fabric');
  expectExcludesPrefix(list, 'package/packages/', 'fabric');
  expectExcludesPrefix(list, 'package/.github/', 'fabric');
  expectExcludesPrefix(list, 'package/src/benchmarks/', 'fabric');
  if (list.some((file) => /\.(spec|test)\.ts$/.test(file))) {
    throw new Error('fabric tarball should not include spec or test files');
  }
  if (list.some((file) => /__(screenshots|snapshots)__/.test(file))) {
    throw new Error(
      'fabric tarball should not include snapshots or screenshots',
    );
  }
  log('Root fabric tarball contents look correct');
}

function extractPackage(tarball, target) {
  const extractDir = fs.mkdtempSync(path.join(tmp, 'extract-'));
  run('tar', ['-xzf', tarball, '-C', extractDir]);
  fs.renameSync(path.join(extractDir, 'package'), target);
  fs.rmSync(extractDir, { recursive: true, force: true });
}

function linkPackage(importName, tarball) {
  log(`Extracting ${importName} into smoke project`);
  const target = importName.startsWith('@fabricjs/')
    ? path.join(nodeModules, '@fabricjs', importName.split('/')[1])
    : path.join(nodeModules, importName);
  fs.rmSync(target, { recursive: true, force: true });
  extractPackage(tarball, target);
}

function linkRuntimeDependency(name) {
  log(`Linking runtime dependency ${name}`);
  const source = path.join(wd, 'node_modules', name);
  if (!fs.existsSync(source)) {
    throw new Error(
      `Missing ${name} in root node_modules. Run pnpm install before package smoke.`,
    );
  }
  fs.symlinkSync(source, path.join(nodeModules, name), 'dir');
}

function smokeImport(label, source) {
  log(`Importing ${label}`);
  run('node', ['--input-type=module', '-e', source], { cwd: projectDir });
  log(`Imported ${label}`);
}

try {
  log(`Using temp directory ${tmp}`);
  const packed = new Map(
    workspacePackages.map((workspacePackage) => {
      const result = pack(workspacePackage);
      return [workspacePackage.importName, result];
    }),
  );

  verifyRootTarball(tarList(packed.get('fabric').tarball));

  for (const { importName } of workspacePackages) {
    linkPackage(importName, packed.get(importName).tarball);
  }

  linkRuntimeDependency('canvas');
  linkRuntimeDependency('jsdom');

  smokeImport(
    'fabric',
    "import { Canvas, Rect } from 'fabric'; if (typeof Canvas !== 'function' || typeof Rect !== 'function') throw new Error('fabric import failed');",
  );
  smokeImport(
    'fabric/node',
    "import { StaticCanvas, Rect } from 'fabric/node'; const canvas = new StaticCanvas(undefined, { width: 10, height: 10 }); canvas.add(new Rect({ width: 1, height: 1 })); if (canvas.getObjects().length !== 1) throw new Error('fabric/node import failed');",
  );
  smokeImport(
    '@fabricjs/browser',
    "import { Canvas, Rect } from '@fabricjs/browser'; if (typeof Canvas !== 'function' || typeof Rect !== 'function') throw new Error('@fabricjs/browser import failed');",
  );
  smokeImport(
    '@fabricjs/node',
    "import { StaticCanvas, Rect } from '@fabricjs/node'; const canvas = new StaticCanvas(undefined, { width: 10, height: 10 }); canvas.add(new Rect({ width: 1, height: 1 })); if (canvas.getObjects().length !== 1) throw new Error('@fabricjs/node import failed');",
  );

  log('Cleaning temp directory');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Package smoke passed.');
} catch (error) {
  console.error(error);
  console.error(`Package smoke failed. Temp directory left at ${tmp}`);
  process.exit(1);
}
