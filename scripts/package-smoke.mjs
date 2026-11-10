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
  runQuiet('pnpm', ['--dir', dir, 'pack', '--pack-destination', packDir]);
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
  expectIncludes(list, 'package/dist/index.js', 'fabric');
  expectIncludes(list, 'package/dist/index.min.mjs', 'fabric');
  expectIncludes(list, 'package/dist/index.min.js', 'fabric');
  expectIncludes(list, 'package/dist/index.node.mjs', 'fabric');
  for (const extension of ['mjs', 'cjs', 'd.ts']) {
    expectIncludes(list, `package/dist/index.skia.${extension}`, 'fabric');
  }
  expectIncludes(list, 'package/dist-extensions/index.mjs', 'fabric');
  expectIncludes(
    list,
    'package/dist-extensions/fabric-extensions.min.js',
    'fabric',
  );
  expectIncludes(list, 'package/extensions/README.MD', 'fabric');
  expectExcludesPrefix(list, 'package/packages/', 'fabric');
  expectExcludesPrefix(list, 'package/src/', 'fabric');
  expectExcludesPrefix(list, 'package/dist/src/', 'fabric');
  expectExcludesPrefix(list, 'package/dist/packages/', 'fabric');
  expectExcludesPrefix(list, 'package/dist-extensions/packages/', 'fabric');
  expectExcludesPrefix(list, 'package/.github/', 'fabric');
  if (list.some((file) => /^package\/extensions\/.+\/.*\.ts$/.test(file))) {
    throw new Error(
      'fabric tarball should not include extension implementation source files',
    );
  }
  for (const file of [
    'package/fabric.ts',
    'package/index.ts',
    'package/index.node.ts',
    'package/index.skia.ts',
  ]) {
    if (list.includes(file)) {
      throw new Error(`fabric tarball should not include ${file}`);
    }
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

function expectDependency(pkg, dependencyName, label) {
  if (!pkg.dependencies?.[dependencyName]) {
    throw new Error(
      `${label} should declare ${dependencyName} in dependencies`,
    );
  }
}

function expectOptionalDependency(pkg, dependencyName, label) {
  if (!pkg.optionalDependencies?.[dependencyName]) {
    throw new Error(
      `${label} should declare ${dependencyName} in optionalDependencies`,
    );
  }
}

function verifyRootPackageManifest(pkg) {
  log('Checking root fabric package manifest');
  expectNoDeclaredRuntimeDependency(pkg, 'westures', 'fabric');
  for (const dependency of [
    '@fabricjs/aligning-guidelines',
    '@fabricjs/browser',
    '@fabricjs/cropping-controls',
    '@fabricjs/data-updaters',
    '@fabricjs/gradient-controls',
    '@fabricjs/westures-integration',
  ]) {
    expectDependency(pkg, dependency, 'fabric');
  }
  expectOptionalDependency(pkg, '@fabricjs/node', 'fabric');
  if (
    !pkg.peerDependencies?.['@fabricjs/skia'] ||
    pkg.peerDependenciesMeta?.['@fabricjs/skia']?.optional !== true ||
    pkg.optionalDependencies?.['@fabricjs/skia'] ||
    pkg.dependencies?.['@fabricjs/skia']
  ) {
    throw new Error(
      'fabric should declare Skia only as an optional peer dependency',
    );
  }
  log('Root fabric package manifest looks correct');
}

function verifyCorePackageManifest(pkg) {
  log('Checking @fabricjs/core package manifest');
  expectNoDeclaredRuntimeDependency(pkg, 'canvas', '@fabricjs/core');
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom', '@fabricjs/core');
  expectNoDeclaredRuntimeDependency(pkg, '@napi-rs/canvas', '@fabricjs/core');
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom-skia', '@fabricjs/core');
  log('@fabricjs/core package manifest looks correct');
}

function verifyBrowserPackageManifest(pkg) {
  log('Checking @fabricjs/browser package manifest');
  expectNoDeclaredRuntimeDependency(pkg, 'canvas', '@fabricjs/browser');
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom', '@fabricjs/browser');
  expectNoDeclaredRuntimeDependency(
    pkg,
    '@napi-rs/canvas',
    '@fabricjs/browser',
  );
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom-skia', '@fabricjs/browser');
  log('@fabricjs/browser package manifest looks correct');
}

function verifyNodePackageManifest(pkg) {
  log('Checking @fabricjs/node package manifest');
  expectDependency(pkg, 'canvas', '@fabricjs/node');
  expectDependency(pkg, 'jsdom', '@fabricjs/node');
  log('@fabricjs/node package manifest looks correct');
}

function verifySkiaPackageManifest(pkg) {
  for (const dependency of [
    '@fabricjs/core',
    '@napi-rs/canvas',
    'jsdom-skia',
  ]) {
    expectDependency(pkg, dependency, '@fabricjs/skia');
  }
  expectNoDeclaredRuntimeDependency(pkg, 'canvas', '@fabricjs/skia');
  expectNoDeclaredRuntimeDependency(pkg, 'jsdom', '@fabricjs/skia');
  if (
    pkg.dependencies['@napi-rs/canvas'] !== '1.1.0' ||
    pkg.dependencies['jsdom-skia'] !== 'npm:jsdom@31.0.0' ||
    pkg.engines.node !== '^22.22.2 || ^24.15.0 || >=26.0.0'
  ) {
    throw new Error('@fabricjs/skia runtime versions changed unexpectedly');
  }
}

function verifyWorkspaceTarball(importName, list) {
  log(`Checking ${importName} tarball contents`);
  expectIncludes(list, 'package/package.json', importName);
  expectIncludes(list, 'package/README.md', importName);
  expectIncludes(list, 'package/dist/index.mjs', importName);
  expectIncludes(list, 'package/dist/index.d.ts', importName);
  if (importName === '@fabricjs/browser') {
    expectIncludes(list, 'package/dist/index.js', importName);
    expectIncludes(list, 'package/dist/index.min.js', importName);
  }
  if (importName === '@fabricjs/skia') {
    expectIncludes(list, 'package/dist/index.cjs', importName);
  }
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
  const source = [
    path.join(wd, 'node_modules', name),
    path.join(wd, 'packages', 'node', 'node_modules', name),
  ].find((candidate) => fs.existsSync(candidate));
  if (!source) {
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

function smokeRequire(project, label, source) {
  log(`Requiring ${label} in ${project.name}`);
  run('node', ['-e', source], {
    cwd: project.projectDir,
  });
  log(`Required ${label} in ${project.name}`);
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

function smokeRootFacadeCoreIdentity(project, fabricTarball) {
  linkPackage(project, 'fabric', fabricTarball);
  smokeImport(
    project,
    'fabric and @fabricjs/core core identity',
    "import { Rect as FabricRect } from 'fabric'; import { Rect as CoreRect } from '@fabricjs/core'; if (FabricRect !== CoreRect) throw new Error('fabric does not share @fabricjs/core runtime');",
  );
  smokeImport(
    project,
    'fabric and @fabricjs/browser core identity',
    "import { Rect as FabricRect } from 'fabric'; import { Rect as BrowserRect } from '@fabricjs/browser'; if (FabricRect !== BrowserRect) throw new Error('fabric does not share @fabricjs/browser runtime');",
  );
  smokeImport(
    project,
    'fabric/node and @fabricjs/node core identity',
    "import { Rect as FabricNodeRect } from 'fabric/node'; import { Rect as NodeRect } from '@fabricjs/node'; if (FabricNodeRect !== NodeRect) throw new Error('fabric/node does not share @fabricjs/node runtime');",
  );
  smokeImport(
    project,
    '@fabricjs/browser and @fabricjs/node core identity',
    "import { Rect as BrowserRect } from '@fabricjs/browser'; import { Rect as NodeRect } from '@fabricjs/node'; if (BrowserRect !== NodeRect) throw new Error('@fabricjs/browser and @fabricjs/node do not share @fabricjs/core runtime');",
  );
}

function linkWorkspacePackages(project, packed) {
  for (const { importName } of publishablePackages) {
    if (importName !== 'fabric') {
      linkPackage(project, importName, packed.get(importName).tarball);
    }
  }
}

function smokePackedSkia(packed) {
  // A real isolated pnpm install catches undeclared dependencies hidden by
  // workspace aliases or a flat node_modules directory. Only Skia and core
  // are installed: node-canvas must not be available to jsdom by accident.
  const project = createSmokeProject('packed-skia-project');
  fs.writeFileSync(
    path.join(project.projectDir, 'package.json'),
    JSON.stringify({
      private: true,
      dependencies: {
        '@fabricjs/skia': `file:${packed.get('@fabricjs/skia').tarball}`,
      },
    }),
  );
  fs.writeFileSync(
    path.join(project.projectDir, 'pnpm-workspace.yaml'),
    [
      'nodeLinker: isolated',
      'hoist: false',
      'autoInstallPeers: false',
      'overrides:',
      `  '@fabricjs/core': ${JSON.stringify(`file:${packed.get('@fabricjs/core').tarball}`)}`,
      '',
    ].join('\n'),
  );
  run('pnpm', ['install', '--ignore-scripts'], { cwd: project.projectDir });
  expectPackageAbsent(project, 'canvas');
  expectPackageAbsent(project, '@fabricjs/node');
  expectPackageAbsent(project, 'jsdom');
  smokeRequire(
    project,
    'Skia dependency isolation',
    `
    const { createRequire } = require('node:module');
    const skiaRequire = createRequire(require.resolve('@fabricjs/skia'));
    const jsdomRequire = createRequire(skiaRequire.resolve('jsdom-skia'));
    try { jsdomRequire.resolve('canvas'); }
    catch (error) { if (error.code === 'MODULE_NOT_FOUND') process.exit(0); throw error; }
    throw new Error('Skia must work without node-canvas installed');
  `,
  );
  fs.copyFileSync(
    path.join(wd, 'test/fixtures/Ubuntu-Regular.ttf'),
    path.join(project.projectDir, 'Ubuntu-Regular.ttf'),
  );
  expectPackageAbsent(project, '@napi-rs/canvas');
  smokeImport(
    project,
    'standalone Skia font registration and rendering',
    `
    import { GlobalFonts, setTextRenderer, StaticCanvas, FabricText } from '@fabricjs/skia';
    setTextRenderer('portable');
    const key = GlobalFonts.registerFromPath(new URL('./Ubuntu-Regular.ttf', import.meta.url).pathname, 'PackedUbuntu');
    if (!key || !GlobalFonts.has('PackedUbuntu')) throw new Error('Skia font registration failed');
    const canvas = new StaticCanvas(undefined, { width: 200, height: 60 });
    const text = new FabricText('Packed Skia', { fontFamily: 'PackedUbuntu', fontSize: 24, fill: 'red' });
    canvas.add(text);
    canvas.renderAll();
    if (!Number.isFinite(text.width) || text.width <= 0) throw new Error('Skia font measurement failed');
    const pixels = canvas.getContext().getImageData(0, 0, 200, 60).data;
    if (!pixels.some((value, index) => index % 4 === 3 && value > 0)) throw new Error('Skia text rendering failed');
    await canvas.dispose();
    if (!GlobalFonts.remove(key)) throw new Error('Skia font removal failed');
  `,
  );
  const render = `
    const canvas = new StaticCanvas(undefined, { width: 8, height: 8 });
    canvas.add(new Rect({ width: 8, height: 8, fill: 'red', strokeWidth: 0 }));
    canvas.renderAll();
    const pixel = canvas.getContext().getImageData(2, 2, 1, 1).data;
    if (pixel[0] !== 255 || pixel[3] !== 255) throw new Error('Skia rendering failed');
    if (!canvas.toDataURL().startsWith('data:image/png;base64,')) throw new Error('Skia PNG export failed');
    canvas.dispose();
  `;
  // Both facades resolve runtime dependencies inside @fabricjs/skia, not
  // from the consuming application or the root fabric package.
  for (const name of ['@fabricjs/skia', 'fabric/skia']) {
    if (name === 'fabric/skia')
      linkPackage(project, 'fabric', packed.get('fabric').tarball);
    smokeImport(
      project,
      name,
      `import { StaticCanvas, Rect } from '${name}'; ${render}`,
    );
    smokeRequire(
      project,
      name,
      `const { StaticCanvas, Rect } = require('${name}'); ${render}`,
    );
  }
  smokeImport(
    project,
    'Skia ESM facade identity',
    `
    import { Rect as Direct } from '@fabricjs/skia';
    import { Rect as Facade } from 'fabric/skia';
    if (Direct !== Facade) throw new Error('Skia ESM facade identity mismatch');
  `,
  );
  smokeRequire(
    project,
    'Skia CommonJS facade identity',
    `
    if (require('@fabricjs/skia').Rect !== require('fabric/skia').Rect)
      throw new Error('Skia CommonJS facade identity mismatch');
  `,
  );
  smokeImport(
    project,
    'mixed Skia ESM/CommonJS runtime identity',
    `
    import { createRequire } from 'node:module';
    import * as direct from '@fabricjs/skia';
    import * as facade from 'fabric/skia';
    const require = createRequire(import.meta.url);
    const commonjs = require('@fabricjs/skia');
    const commonjsFacade = require('fabric/skia');
    const skiaRequire = createRequire(require.resolve('@fabricjs/skia'));
    const core = await import(skiaRequire.resolve('@fabricjs/core'));
    const napi = skiaRequire('@napi-rs/canvas');
    if (direct.GlobalFonts !== napi.GlobalFonts || direct.setTextRenderer !== napi.setTextRenderer)
      throw new Error('Skia font API does not use the same native instance');
    for (const candidate of [facade, commonjs, commonjsFacade]) {
      for (const key of ['Rect', 'Canvas', 'StaticCanvas', 'classRegistry', 'config', 'cache', 'GlobalFonts', 'setTextRenderer']) {
        if (candidate[key] !== direct[key]) throw new Error('Mixed Skia identity mismatch: ' + key);
      }
      if (candidate.getEnv() !== direct.getEnv()) throw new Error('Mixed Skia environment mismatch');
    }
    for (const key of ['Rect', 'classRegistry', 'config', 'cache']) {
      if (core[key] !== direct[key]) throw new Error('Skia core identity mismatch: ' + key);
    }
    class SharedRect extends commonjs.Rect {}
    commonjs.classRegistry.setClass(SharedRect, 'PackedSkiaIdentityTest');
    if (direct.classRegistry.getClass('PackedSkiaIdentityTest') !== SharedRect)
      throw new Error('Skia class registry state is not shared');
    const canvas = new direct.StaticCanvas(undefined, { width: 8, height: 8 });
    const rect = new commonjsFacade.Rect({ width: 8, height: 8, fill: 'red', strokeWidth: 0 });
    if (!(rect instanceof direct.Rect)) throw new Error('Mixed Skia instanceof failed');
    canvas.add(rect);
    canvas.renderAll();
    if (canvas.getContext().getImageData(2, 2, 1, 1).data[0] !== 255)
      throw new Error('Mixed Skia rendering failed');
    await canvas.dispose();
  `,
  );
  // Use the installed compiler, but resolve declarations from packed files.
  const typeSource = `
    import { StaticCanvas, Rect, GlobalFonts, setTextRenderer } from '@fabricjs/skia';
    import { StaticCanvas as FacadeCanvas, GlobalFonts as FacadeFonts, setTextRenderer as facadeTextRenderer } from 'fabric/skia';
    setTextRenderer('portable');
    facadeTextRenderer('system');
    const fonts: typeof GlobalFonts = FacadeFonts;
    const key = fonts.registerFromPath('Ubuntu-Regular.ttf', 'PackedUbuntu');
    if (key) fonts.remove(key);
    // @ts-expect-error Only supported text renderer modes are accepted.
    setTextRenderer('invalid-renderer');
    const canvas: StaticCanvas = new FacadeCanvas(undefined, { width: 8, height: 8 });
    canvas.add(new Rect({ width: 2, height: 2 }));
    canvas.toDataURL();
    canvas.dispose();
  `;
  for (const extension of ['mts', 'cts']) {
    const file = path.join(project.projectDir, `consumer.${extension}`);
    fs.writeFileSync(file, typeSource);
    run(
      'node',
      [
        path.join(wd, 'node_modules/typescript/bin/tsc'),
        '--noEmit',
        '--strict',
        '--skipLibCheck',
        '--module',
        'NodeNext',
        '--moduleResolution',
        'NodeNext',
        '--target',
        'ES2022',
        file,
      ],
      { cwd: project.projectDir },
    );
  }
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
  verifyBrowserPackageManifest(packedManifests.get('@fabricjs/browser'));
  verifyNodePackageManifest(packedManifests.get('@fabricjs/node'));
  verifySkiaPackageManifest(packedManifests.get('@fabricjs/skia'));
  for (const { importName } of publishablePackages) {
    if (importName !== 'fabric') {
      verifyWorkspaceTarball(
        importName,
        tarList(packed.get(importName).tarball),
      );
    }
  }

  smokePackedSkia(packed);

  const rootProject = createSmokeProject('root-project');
  linkPackage(rootProject, 'fabric', packed.get('fabric').tarball);
  linkWorkspacePackages(rootProject, packed);

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
  smokeRequire(
    rootProject,
    'fabric/node CommonJS',
    "const { StaticCanvas, Rect } = require('fabric/node'); const canvas = new StaticCanvas(undefined, { width: 10, height: 10 }); canvas.add(new Rect({ width: 1, height: 1 })); if (canvas.getObjects().length !== 1) throw new Error('fabric/node CommonJS require failed');",
  );
  smokeImport(
    rootProject,
    'fabric/extensions',
    "import { AligningGuidelines, createImageCroppingControls, installOriginWrapperUpdater, addGestures } from 'fabric/extensions'; if (typeof AligningGuidelines !== 'function' || typeof createImageCroppingControls !== 'function' || typeof installOriginWrapperUpdater !== 'function' || typeof addGestures !== 'function') throw new Error('fabric/extensions import failed');",
  );
  smokeRootFacadeCoreIdentity(rootProject, packed.get('fabric').tarball);

  const splitProject = createSmokeProject('split-project');
  expectPackageAbsent(splitProject, 'fabric');
  linkWorkspacePackages(splitProject, packed);

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
  smokeRootFacadeCoreIdentity(splitProject, packed.get('fabric').tarball);

  log('Cleaning temp directory');
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('Package smoke passed.');
} catch (error) {
  console.error(error);
  console.error(`Package smoke failed. Temp directory left at ${tmp}`);
  process.exit(1);
}
