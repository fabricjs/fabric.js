import type { PlaywrightTestConfig } from '@playwright/test';
import { readdirSync, rmSync, statSync } from 'node:fs';
import * as path from 'node:path';
import { build, watch } from 'rolldown';
import { makeRe } from 'micromatch';

const include = ['**/*.ts'];
const exclude = ['**/*.spec.ts', '**/*.fixtures.ts'];

const src = path.resolve(process.cwd(), 'e2e', 'tests');
const dist = path.resolve(process.cwd(), 'e2e', 'dist');

const includeRe = include.map((glob) => makeRe(glob));
const excludeRe = exclude.map((glob) => makeRe(glob));

const walkSync = (dir: string, callback: (file: string) => void) => {
  const files = readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.resolve(dir, file);
    const stats = statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile()) {
      callback(filepath);
    }
  });
};

const shouldBuild = (file: string) =>
  includeRe.some((re) => re.test(file)) &&
  excludeRe.every((re) => !re.test(file));

const getRolldownOptions = (input: string[]) => ({
  input,
  external: [/^fabric/, 'westures', 'canvas', /^node:/],
  transform: {
    target: 'chrome100' as const,
  },
  output: {
    dir: dist,
    format: 'es' as const,
    preserveModules: true,
    preserveModulesRoot: src,
    entryFileNames: '[name].js',
    sanitizeFileName: (name: string) => name.replace(/[\0?*]/g, '_'),
  },
});

export default async (_config: PlaywrightTestConfig) => {
  const files: string[] = [];
  walkSync(src, (file) => files.push(file));
  const input = files.filter((file) => shouldBuild(file));

  rmSync(dist, { recursive: true, force: true });

  await build(getRolldownOptions(input));

  console.log(
    `Successfully compiled ${input.length} files from ${path.relative(
      process.cwd(),
      src,
    )} to ${path.relative(process.cwd(), dist)}`,
  );

  // watch
  if (process.argv.includes('--ui')) {
    const watcher = watch(getRolldownOptions(input));
    watcher.on('event', (event) => {
      if (event.code === 'BUNDLE_END') {
        console.log(`Rebuilt e2e tests in ${event.duration}ms`);
        event.result.close();
      }
    });
    process.once('exit', () => watcher.close());
  }
};
