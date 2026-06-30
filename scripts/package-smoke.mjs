import cp from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { wd } from './dirname.mjs';
import { publishablePackages } from './workspace-packages.mjs';

/**
 * Smoke-tests the actual npm artifacts, not the workspace source.
 *
 * Vitest runs inside the repo, where pnpm links, TS path aliases, and dev
 * dependencies can hide packaging bugs. This script packs each publishable
 * package, inspects the tarballs, installs them into temporary consumer
 * projects, and imports them through their published `exports` maps.
 */

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fabric-package-smoke-'));
const packDir = path.join(tmp, 'packs');

fs.mkdirSync(packDir, { recursive: true });

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

function tarPackageJson(tarball) {
  log(`Reading package manifest for ${path.basename(tarball)}`);
  const result = cp.spawnSync(
    'tar',
    ['-xzf', tarball, '-O', 'package/package.json'],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'inherit'],
    },
  );
  if (result.status !== 0) {
    throw new Error(`Failed to read package.json from ${tarball}`);
  }
  return JSON.parse(result.stdout);
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
  expectIncludes(list, 'package/extensions/README.MD', 'fabric');
  expectIncludes(list, 'package/src/env/index.ts', 'fabric');
  expectExcludesPrefix(list, 'package/packages/', 'fabric');
  expectExcludesPrefix(list, 'package/.github/', 'fabric');
  expectExcludesPrefix(list, 'package/src/benchmarks/', 'fabric');
  if (list.some((file) => /^package\/extensions\/.+\/.*\.ts$/.test(file))) {
    throw new Error(
      'fabric tarball should not include extension implementation source files',
    );
  }
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

function expectNoDeclaredRuntimeDependency(pkg, dependencyName, label) {
  for (const field of [
    'dependencies',
    'peerDependencies',
    'optionalDependencies',
  ]) {
    if (pkg[field]?.[dependencyName]) {
      throw new Error(
        `${label} should not declare ${dependencyName} in ${field}`,
      );
    }
  }
}

function hasDeclaredRuntimeDependency(pkg, dependencyName) {
  return ['dependencies', 'peerDependencies', 'optionalDependencies'].some(
    (field) => pkg[field]?.[dependencyName],
  );
}

function verifyRootPackageManifest(pkg) {
  log('Checking root fabric package manifest');
  expectNoDeclaredRuntimeDependency(pkg, 'westures', 'fabric');
  log('Root fabric package manifest looks correct');
}

function verifyCorePackageManifest(pkg) {
  log('Checking @fabricjs/core package manifest');
  expectNoDeclaredRuntimeDependency(pkg, 'canvas', '@fabricjs/core');
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom', '@fabricjs/core');
  log('@fabricjs/core package manifest looks correct');
}

function isFacadeRootPackage(pkg) {
  return (
    hasDeclaredRuntimeDependency(pkg, '@fabricjs/core') ||
    hasDeclaredRuntimeDependency(pkg, '@fabricjs/browser') ||
    hasDeclaredRuntimeDependency(pkg, '@fabricjs/node')
  );
}

function verifyWorkspaceTarball(importName, list) {
  log(`Checking ${importName} tarball contents`);
  expectIncludes(list, 'package/package.json', importName);
  expectIncludes(list, 'package/README.md', importName);
  expectIncludes(list, 'package/dist/index.mjs', importName);
  expectIncludes(list, 'package/dist/index.d.ts', importName);
  expectExcludesPrefix(list, 'package/src/', importName);
  expectExcludesPrefix(list, 'package/test/', importName);
  if (list.some((file) => /\.(spec|test)\.(ts|tsx|js|jsx)$/.test(file))) {
    throw new Error(
      `${importName} tarball should not include spec or test files`,
    );
  }
  log(`${importName} tarball contents look correct`);
}

function extractPackage(tarball, target) {
  const extractDir = fs.mkdtempSync(path.join(tmp, 'extract-'));
  run('tar', ['-xzf', tarball, '-C', extractDir]);
  fs.renameSync(path.join(extractDir, 'package'), target);
  fs.rmSync(extractDir, { recursive: true, force: true });
}

function createSmokeProject(name) {
  const projectDir = path.join(tmp, name);
  const nodeModules = path.join(projectDir, 'node_modules');
  fs.mkdirSync(nodeModules, { recursive: true });
  return { name, projectDir, nodeModules };
}

function packageTarget(project, importName) {
  return importName.startsWith('@fabricjs/')
    ? path.join(project.nodeModules, '@fabricjs', importName.split('/')[1])
    : path.join(project.nodeModules, importName);
}

function linkPackage(project, importName, tarball) {
  log(`Extracting ${importName} into ${project.name}`);
  const target = importName.startsWith('@fabricjs/')
    ? path.join(project.nodeModules, '@fabricjs', importName.split('/')[1])
    : path.join(project.nodeModules, importName);
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  extractPackage(tarball, target);
}

function expectPackageAbsent(project, importName) {
  const target = packageTarget(project, importName);
  if (fs.existsSync(target)) {
    throw new Error(`${project.name} should not contain ${importName}`);
  }
}

function linkRuntimeDependency(project, name) {
  log(`Linking runtime dependency ${name} into ${project.name}`);
  const source = path.join(wd, 'node_modules', name);
  if (!fs.existsSync(source)) {
    throw new Error(
      `Missing ${name} in root node_modules. Run pnpm install before package smoke.`,
    );
  }
  fs.symlinkSync(source, path.join(project.nodeModules, name), 'dir');
}

function smokeImport(project, label, source) {
  log(`Importing ${label} in ${project.name}`);
  run('node', ['--input-type=module', '-e', source], {
    cwd: project.projectDir,
  });
  log(`Imported ${label} in ${project.name}`);
}

function smokeSplitCoreIdentity(project) {
  smokeImport(
    project,
    '@fabricjs/core',
    "import { Rect, Canvas } from '@fabricjs/core'; if (typeof Rect !== 'function' || typeof Canvas !== 'function') throw new Error('@fabricjs/core import failed');",
  );
  smokeImport(
    project,
    '@fabricjs/browser core identity',
    "import { Rect as CoreRect } from '@fabricjs/core'; import { Rect as BrowserRect } from '@fabricjs/browser'; if (CoreRect !== BrowserRect) throw new Error('@fabricjs/browser does not share @fabricjs/core runtime');",
  );
  smokeImport(
    project,
    '@fabricjs/node core identity',
    "import { Rect as CoreRect } from '@fabricjs/core'; import { Rect as NodeRect } from '@fabricjs/node'; if (CoreRect !== NodeRect) throw new Error('@fabricjs/node does not share @fabricjs/core runtime');",
  );
  smokeImport(
    project,
    '@fabricjs/browser and @fabricjs/node core identity',
    "import { Rect as BrowserRect } from '@fabricjs/browser'; import { Rect as NodeRect } from '@fabricjs/node'; if (BrowserRect !== NodeRect) throw new Error('@fabricjs/browser and @fabricjs/node do not share @fabricjs/core runtime');",
  );
}

function smokeRootFacadeCoreIdentity(project, rootPkg, fabricTarball) {
  if (!isFacadeRootPackage(rootPkg)) {
    log(
      'Skipping root fabric facade identity checks; root package is not a facade yet',
    );
    return;
  }
  linkPackage(project, 'fabric', fabricTarball);
  smokeImport(
    project,
    'fabric and @fabricjs/core core identity',
    "import { Rect as FabricRect } from 'fabric'; import { Rect as CoreRect } from '@fabricjs/core'; if (FabricRect !== CoreRect) throw new Error('fabric does not share @fabricjs/core runtime');",
  );
  smokeImport(
    project,
    'fabric/node and @fabricjs/node core identity',
    "import { Rect as FabricNodeRect } from 'fabric/node'; import { Rect as NodeRect } from '@fabricjs/node'; if (FabricNodeRect !== NodeRect) throw new Error('fabric/node does not share @fabricjs/node runtime');",
  );
}

try {
  log(`Using temp directory ${tmp}`);
  const packed = new Map(
    publishablePackages.map((workspacePackage) => {
      const result = pack(workspacePackage);
      return [workspacePackage.importName, result];
    }),
  );

  verifyRootTarball(tarList(packed.get('fabric').tarball));
  const packedManifests = new Map(
    publishablePackages.map(({ importName }) => [
      importName,
      tarPackageJson(packed.get(importName).tarball),
    ]),
  );
  verifyRootPackageManifest(packedManifests.get('fabric'));
  verifyCorePackageManifest(packedManifests.get('@fabricjs/core'));
  for (const { importName } of publishablePackages) {
    if (importName !== 'fabric') {
      verifyWorkspaceTarball(
        importName,
        tarList(packed.get(importName).tarball),
      );
    }
  }

  const rootProject = createSmokeProject('root-project');
  linkPackage(rootProject, 'fabric', packed.get('fabric').tarball);
  expectPackageAbsent(rootProject, '@fabricjs/core');

  linkRuntimeDependency(rootProject, 'canvas');
  linkRuntimeDependency(rootProject, 'jsdom');
  // Preserve the historical fabric/extensions contract: westures is external
  // and supplied by the consuming app, not by the root fabric package.
  linkRuntimeDependency(rootProject, 'westures');

  smokeImport(
    rootProject,
    'fabric',
    "import { Canvas, Rect } from 'fabric'; if (typeof Canvas !== 'function' || typeof Rect !== 'function') throw new Error('fabric import failed');",
  );
  smokeImport(
    rootProject,
    'fabric/node',
    "import { StaticCanvas, Rect } from 'fabric/node'; const canvas = new StaticCanvas(undefined, { width: 10, height: 10 }); canvas.add(new Rect({ width: 1, height: 1 })); if (canvas.getObjects().length !== 1) throw new Error('fabric/node import failed');",
  );
  smokeImport(
    rootProject,
    'fabric/extensions',
    "import { AligningGuidelines, createImageCroppingControls, installOriginWrapperUpdater, addGestures } from 'fabric/extensions'; if (typeof AligningGuidelines !== 'function' || typeof createImageCroppingControls !== 'function' || typeof installOriginWrapperUpdater !== 'function' || typeof addGestures !== 'function') throw new Error('fabric/extensions import failed');",
  );

  const splitProject = createSmokeProject('split-project');
  expectPackageAbsent(splitProject, 'fabric');
  for (const { importName } of publishablePackages) {
    if (importName !== 'fabric') {
      linkPackage(splitProject, importName, packed.get(importName).tarball);
    }
  }

  linkRuntimeDependency(splitProject, 'canvas');
  linkRuntimeDependency(splitProject, 'jsdom');
  linkRuntimeDependency(splitProject, 'westures');

  smokeSplitCoreIdentity(splitProject);
  smokeImport(
    splitProject,
    '@fabricjs/browser',
    "import { Canvas, Rect } from '@fabricjs/browser'; if (typeof Canvas !== 'function' || typeof Rect !== 'function') throw new Error('@fabricjs/browser import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/aligning-guidelines',
    "import { AligningGuidelines } from '@fabricjs/aligning-guidelines'; if (typeof AligningGuidelines !== 'function') throw new Error('@fabricjs/aligning-guidelines import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/cropping-controls',
    "import { createImageCroppingControls, enterCropMode } from '@fabricjs/cropping-controls'; if (typeof createImageCroppingControls !== 'function' || typeof enterCropMode !== 'function') throw new Error('@fabricjs/cropping-controls import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/data-updaters',
    "import { installGradientUpdater, installOriginWrapperUpdater } from '@fabricjs/data-updaters'; if (typeof installGradientUpdater !== 'function' || typeof installOriginWrapperUpdater !== 'function') throw new Error('@fabricjs/data-updaters import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/gradient-controls',
    "import { createLinearGradientControls } from '@fabricjs/gradient-controls'; if (typeof createLinearGradientControls !== 'function') throw new Error('@fabricjs/gradient-controls import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/node',
    "import { StaticCanvas, Rect } from '@fabricjs/node'; const canvas = new StaticCanvas(undefined, { width: 10, height: 10 }); canvas.add(new Rect({ width: 1, height: 1 })); if (canvas.getObjects().length !== 1) throw new Error('@fabricjs/node import failed');",
  );
  smokeImport(
    splitProject,
    '@fabricjs/westures-integration',
    "import { addGestures, pinchEventHandler } from '@fabricjs/westures-integration'; if (typeof addGestures !== 'function' || typeof pinchEventHandler !== 'function') throw new Error('@fabricjs/westures-integration import failed');",
  );
  smokeRootFacadeCoreIdentity(
    splitProject,
    packedManifests.get('fabric'),
    packed.get('fabric').tarball,
  );

  log('Cleaning temp directory');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Package smoke passed.');
} catch (error) {
  console.error(error);
  console.error(`Package smoke failed. Temp directory left at ${tmp}`);
  process.exit(1);
}
