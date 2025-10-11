import { transformFileAsync } from '@babel/core';
import type { PlaywrightTestConfig } from '@playwright/test';
import {
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  watch,
  writeFileSync,
} from 'node:fs';
import { makeRe } from 'micromatch';
import * as path from 'node:path';

const include = ['**/*.ts'];
const exclude = ['**/*.spec.ts', '**/*.fixtures.ts'];

const src = path.resolve(process.cwd(), 'e2e', 'tests');
const dist = path.resolve(process.cwd(), 'e2e', 'dist');

const includeRe = include.map((glob) => makeRe(glob));
const excludeRe = exclude.map((glob) => makeRe(glob));

const walkSync = (dir: string, callback: (file: string) => any) => {
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

const getDistFileName = (file: string) => {
  const { dir, name } = path.parse(
    path.resolve(dist, path.relative(src, file)),
  );
  return path.format({
    dir,
    name,
    ext: '.js',
  });
};

const buildFile = async (file: string) => {
  const result = await transformFileAsync(file, {
    configFile: './e2e/.babelrc.mjs',
    babelrc: undefined,
  });
  if (result?.code) {
    const distFile = getDistFileName(file);
    mkdirSync(path.dirname(distFile), { recursive: true });
    writeFileSync(distFile, result.code);
  }
};

export default async (_config: PlaywrightTestConfig) => {
  const files: string[] = [];
  walkSync(src, (file) => files.push(file));

  rmSync(dist, { recursive: true, force: true });
  const tasks = await Promise.all(
    files.filter((file) => shouldBuild(file)).map((file) => buildFile(file)),
  );
  console.log(
    `Successfully compiled ${tasks.length} files from ${path.relative(
      process.cwd(),
      src,
    )} to ${path.relative(process.cwd(), dist)}`,
  );

  // watch
  if (process.argv.includes('--ui')) {
    const watcher = watch(
      src,
      { recursive: true, persistent: true },
      (type, filename) => {
        if (!filename) {
          return;
        }
        const file = path.join(src, filename);
        shouldBuild(file) && buildFile(file);
      },
    );
    process.once('exit', () => watcher.close());
  }
};
