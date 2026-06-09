import cp from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';
import { typedWorkspacePackages } from './workspace-packages.mjs';

const packageDist = (packageName) =>
  path.resolve(wd, 'packages', packageName, 'dist');

const packageTypeBuildDir = path.resolve(wd, 'cli_output', 'package-types');

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function removeFiles(dir, predicate) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      removeFiles(file, predicate);
    } else if (predicate(file)) {
      fs.rmSync(file);
    }
  }
}

function isDeclaration(file) {
  return file.endsWith('.d.ts') || file.endsWith('.d.ts.map');
}

function isNodeOnlyDeclaration(file) {
  const relative = path
    .relative(path.resolve(wd, 'dist'), file)
    .split(path.sep)
    .join('/');
  return (
    relative.startsWith('index.node.') ||
    relative.startsWith('src/env/node.') ||
    relative.startsWith('src/filters/GLProbes/NodeGLProbe.')
  );
}

const declarationMapComment =
  /\r?\n\/\/# sourceMappingURL=[^\r\n]*\.d\.ts\.map[ \t]*$/;

/**
 * Copies `.d.ts` files (skipping their `.d.ts.map` siblings) and strips the
 * trailing `sourceMappingURL` comment. Workspace packages publish only `dist`
 * (no `src`), so a shipped declaration map would dangle and point at sources
 * that are never published.
 */
function copyDeclarations(from, to, predicate) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.resolve(from, entry.name);
    const target = path.resolve(to, entry.name);
    if (entry.isDirectory()) {
      copyDeclarations(source, target, predicate);
    } else if (source.endsWith('.d.ts') && predicate(source)) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      const contents = fs
        .readFileSync(source, 'utf8')
        .replace(declarationMapComment, '');
      fs.writeFileSync(target, contents);
    }
  }
}

function stageCorePackage() {
  const dist = packageDist('core');
  ensureCleanDir(dist);
  for (const file of ['index.mjs', 'index.mjs.map']) {
    fs.copyFileSync(path.resolve(wd, 'dist', file), path.resolve(dist, file));
  }
  copyDeclarations(
    path.resolve(wd, 'dist'),
    dist,
    (file) => !isNodeOnlyDeclaration(file),
  );
}

function stagePackageTypes({ directory }) {
  const source = path.resolve(
    packageTypeBuildDir,
    'packages',
    directory,
    'src',
  );
  if (!fs.existsSync(source)) {
    throw new Error(`Package type output missing: ${source}`);
  }
  const dist = packageDist(directory);
  fs.mkdirSync(dist, { recursive: true });
  removeFiles(dist, isDeclaration);
  copyDeclarations(source, dist, () => true);
}

function stageWorkspacePackages() {
  stageCorePackage();
  typedWorkspacePackages.forEach(stagePackageTypes);
  console.log('Workspace package artifacts staged.\n');
}

/**
 * Runs tsc to generate declaration files (.d.ts)
 */
function buildTypes() {
  console.log('\nGenerating type declarations...');
  try {
    // Generate declarations using the build-specific tsconfig
    cp.execSync('tsc -p ./tsconfig.build.json', {
      stdio: 'inherit',
      shell: true,
      cwd: wd,
    });
    // Also build extensions types
    cp.execSync('tsc -p ./tsconfig-extensions.json', {
      stdio: 'inherit',
      shell: true,
      cwd: wd,
    });
    // Build declaration files for workspace packages into a temp tree.
    fs.rmSync(packageTypeBuildDir, { recursive: true, force: true });
    cp.execSync('tsc -p ./tsconfig.packages.build.json', {
      stdio: 'inherit',
      shell: true,
      cwd: wd,
    });
    console.log('Type declarations generated.\n');
  } catch (error) {
    console.error('Failed to generate type declarations:', error.message);
    process.exit(1);
  }
}

/**
 * Handles rolldown build
 *
 * Hooks to build events to create `cli_output/build-lock.json`
 * @param {*} options
 */
export function build({ watch, fast, input, output, stats = false } = {}) {
  const cmd = ['rolldown', '-c', watch ? '--watch' : ''].join(' ');
  const processOptions = {
    stdio: 'inherit',
    shell: true,
    cwd: wd,
    env: {
      ...process.env,
      MINIFY: Number(!fast),
      BUILD_INPUT: Array.isArray(input) ? input.join(' ') : input,
      BUILD_OUTPUT: output,
      BUILD_STATS: Number(stats),
    },
  };
  if (watch) {
    cp.spawn(cmd, processOptions);
  } else {
    try {
      cp.execSync(cmd, processOptions);
      // Generate .d.ts files after successful rollup build
      buildTypes();
      stageWorkspacePackages();
    } catch (error) {
      // minimal logging, no need for stack trace
      console.error(error.message);
      // inform ci
      process.exit(1);
    }
  }
}
