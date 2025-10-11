#!/usr/bin/env node

/**
 * Dearest fabric maintainer 💗,
 * This file contains the cli logic, which governs most of the available commands fabric has to offer.
 *
 * 📢 **IMPORTANT**
 * CI uses these commands.
 * In order for CI to correctly report the result of the command, the process must receive a correct exit code
 * meaning that if you `spawn` a process, make sure to listen to the `exit` event and terminate the main process with the relevant code.
 * Failing to do so will make CI report a false positive 📉.
 */

import { red, green, yellow, gray, bold } from './colors.mjs';
import cp from 'child_process';
import * as commander from 'commander';
import fs from 'node:fs';
import { formatTime } from './date-time.mjs';
import path from 'node:path';
import process from 'node:process';
import os from 'os';
import { build } from './build.mjs';
import { CLI_CACHE, wd } from './dirname.mjs';
import { debounce, defaultsDeep } from 'es-toolkit/compat';

const program = new commander.Command()
  .showHelpAfterError()
  .allowUnknownOption(false)
  .allowExcessArguments(false);

const websiteDir = path.resolve(wd, '../fabricjs.com');

function startWebsite() {
  if (
    JSON.parse(fs.readFileSync(path.resolve(websiteDir, 'package.json')))
      .name !== 'fabricjs.com'
  ) {
    console.log(red('Could not locate fabricjs.com directory'));
  }
  const args = ['run', 'start:dev'];

  //  WSL ubuntu
  // https://github.com/microsoft/WSL/issues/216
  // os.platform() === 'win32' && args.push('--', '--force_polling', '--livereload');
  if (os.platform() === 'win32') {
    console.log(
      green(
        'Consider using ubuntu on WSL to run jekyll with the following options:',
      ),
    );
    console.log(yellow('-- force_polling --livereload'));
    console.log(gray('https://github.com/microsoft/WSL/issues/216'));
  }

  cp.spawn('npm', args, {
    stdio: 'inherit',
    cwd: websiteDir,
    shell: true,
  });
}

function watch(path, callback, debounceVal = 500) {
  fs.watch(
    path,
    { recursive: true },
    debounce(
      (type, location) => {
        try {
          callback(type, location);
        } catch (error) {
          console.error(error);
        }
      },
      debounceVal,
      { trailing: true },
    ),
  );
}

function copy(from, to) {
  try {
    fs.cpSync(from, to, { recursive: true });
    const containingFolder = path.resolve(wd, '..');
    console.log(
      `copied ${path.relative(containingFolder, from)} to ${path.relative(
        containingFolder,
        to,
      )}`,
    );
  } catch (error) {
    console.error(error);
  }
}

const BUILD_SOURCE = ['src', 'lib'];

function exportBuildToWebsite(options = {}) {
  defaultsDeep(options, { gestures: true });
  build({
    output: path.resolve(websiteDir, './lib/fabric.js'),
    fast: true,
    watch: options.watch,
  });
  if (options.gestures) {
    build({
      exclude: ['accessors'],
      output: path.resolve(websiteDir, './lib/fabric_with_gestures.js'),
      fast: true,
      watch: options.watch,
    });
  }
}

function exportAssetsToWebsite(options) {
  copy(
    path.resolve(wd, './package.json'),
    path.resolve(websiteDir, './lib/package.json'),
  );
  BUILD_SOURCE.forEach((p) =>
    copy(path.resolve(wd, p), path.resolve(websiteDir, './build/files', p)),
  );
  console.log(bold(`[${formatTime()}] exported assets to fabricjs.com`));
  options.watch &&
    BUILD_SOURCE.forEach((p) => {
      watch(path.resolve(wd, p), () => {
        copy(path.resolve(wd, p), path.resolve(websiteDir, './build/files', p));
        console.log(bold(`[${formatTime()}] exported ${p} to fabricjs.com`));
      });
    });
}

function exportToWebsite(options) {
  if (!options.include || options.include.length === 0) {
    options.include = ['build'];
  }
  options.include.forEach((x) => {
    if (x === 'build') {
      exportBuildToWebsite(options);
      exportAssetsToWebsite(options);
    }
  });
}

function readCLIFile() {
  return fs.existsSync(CLI_CACHE) ? JSON.parse(fs.readFileSync(CLI_CACHE)) : [];
}

function createChoiceData(type, file) {
  return {
    name: `${type}/${file}`,
    short: `${type}/${file}`,
    value: {
      type,
      file,
    },
  };
}

program
  .name('fabric.js')
  .description('fabric.js DEV CLI tools')
  .version(process.env.npm_package_version)
  .showSuggestionAfterError();

program
  .command('dev')
  .description('watch for changes in `src` directory')
  .action(() => {
    cp.spawn('npm run build -- -f -w', { stdio: 'inherit', shell: true });
  });

program
  .command('build')
  .description('build dist')
  .option('-f, --fast', 'skip minifying')
  .option('-w, --watch')
  .option('-i, --input <...path>', 'specify the build input paths')
  .option('-o, --output <path>', 'specify the build output path')
  .option('-x, --exclude <exclude...>')
  .option('-m, --modules <modules...>')
  .option('-s, --stats', 'inspect build statistics', false)
  .action((options) => {
    build(options);
  });

const website = program.command('website').description('fabricjs.com commands');

website
  .command('start')
  .description('start fabricjs.com dev server')
  .allowExcessArguments()
  .allowUnknownOption()
  .action(startWebsite);

program.parse(process.argv);
