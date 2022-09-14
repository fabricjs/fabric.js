import chalk from 'chalk';
import cp from 'child_process';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'node:path';
import process from 'node:process';
import { wd } from './dirname.mjs';

const lockFile = path.resolve(wd, 'build.lock');

export function build(options = {}) {
  const cmd = ['rollup', '-c', options.watch ? '--watch' : ''].join(' ');
  const processOptions = {
    stdio: 'inherit',
    shell: true,
    cwd: wd,
    env: {
      ...process.env,
      MINIFY: Number(!options.fast),
      BUILD_INPUT: options.input,
      BUILD_OUTPUT: options.output,
      BUILD_MIN_OUTPUT:
        options.output && !options.fast
          ? path.resolve(
              path.dirname(options.output),
              `${path.basename(options.output, '.js')}.min.js`
            )
          : undefined,
    },
  };
  if (options.watch) {
    cp.spawn(cmd, processOptions);
  } else {
    try {
      cp.execSync(cmd, processOptions);
    } catch (error) {
      // minimal logging, no need for stack trace
      console.error(error.message);
      // inform ci
      process.exit(1);
    }
  }
}

export function isLocked() {
  return fs.existsSync(lockFile);
}

export function awaitBuild() {
  return new Promise((resolve) => {
    console.log(chalk.cyanBright('> waiting for build to finish...'));
    if (isLocked()) {
      const watcher = fs.watch(
        lockFile,
        _.debounce(() => {
          if (!isLocked()) {
            watcher.close();
            resolve();
          }
        }, 500)
      );
    } else {
      resolve();
    }
  });
}
