import cp from 'child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';

const packageDist = (packageName) =>
  path.resolve(wd, 'packages', packageName, 'dist');

function ensureCleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyFiles(from, to, predicate) {
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.resolve(from, entry.name);
    const target = path.resolve(to, entry.name);
    if (entry.isDirectory()) {
      copyFiles(source, target, predicate);
    } else if (predicate(source)) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(source, target);
    }
  }
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

function stageCorePackage() {
  const dist = packageDist('core');
  ensureCleanDir(dist);
  for (const file of ['index.mjs', 'index.mjs.map']) {
    fs.copyFileSync(path.resolve(wd, 'dist', file), path.resolve(dist, file));
  }
  copyFiles(path.resolve(wd, 'dist'), dist, (file) => {
    return (
      (file.endsWith('.d.ts') || file.endsWith('.d.ts.map')) &&
      !isNodeOnlyDeclaration(file)
    );
  });
}

function writeEntrypointTypes(packageName, content) {
  fs.mkdirSync(packageDist(packageName), { recursive: true });
  fs.writeFileSync(
    path.resolve(packageDist(packageName), 'index.d.ts'),
    content,
  );
}

function stageWorkspacePackages() {
  stageCorePackage();
  writeEntrypointTypes('browser', "export * from '@fabricjs/core';\n");
  writeEntrypointTypes(
    'gradient-controls',
    [
      "import type { Control, Gradient } from '@fabricjs/core';",
      'export declare function createLinearGradientControls(',
      "  gradient: Gradient<'linear'>,",
      '  options?: Partial<Control>,',
      '): Record<string, Control>;',
      '',
    ].join('\n'),
  );
  writeEntrypointTypes(
    'node',
    [
      "import type { JpegConfig, PngConfig } from 'canvas';",
      "import { Canvas as CanvasBase, StaticCanvas as StaticCanvasBase } from '@fabricjs/core';",
      "export * from '@fabricjs/core';",
      'export declare class StaticCanvas extends StaticCanvasBase {',
      '  getNodeCanvas(): import("canvas").Canvas;',
      '  createPNGStream(opts?: PngConfig): import("canvas").PNGStream;',
      '  createJPEGStream(opts?: JpegConfig): import("canvas").JPEGStream;',
      '}',
      '/**',
      ' * **NOTICE**:',
      ' * {@link Canvas} is designed for interactivity.',
      ' * Therefore, using it in node has no benefit.',
      ' * Use {@link StaticCanvas} instead.',
      ' */',
      'export declare class Canvas extends CanvasBase {',
      '  getNodeCanvas(): import("canvas").Canvas;',
      '  createPNGStream(opts?: PngConfig): import("canvas").PNGStream;',
      '  createJPEGStream(opts?: JpegConfig): import("canvas").JPEGStream;',
      '}',
      '',
    ].join('\n'),
  );
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
