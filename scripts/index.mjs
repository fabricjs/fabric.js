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

import cp from 'child_process';
import * as commander from 'commander';
import process from 'node:process';
import { build } from './build.mjs';

const program = new commander.Command()
  .showHelpAfterError()
  .allowUnknownOption(false)
  .allowExcessArguments(false);

program.name('fabric.js');
program.description('fabric.js DEV CLI tools');
program.version(process.env.npm_package_version);

if (typeof program.showSuggestionAfterError === 'function') {
  program.showSuggestionAfterError();
}

program
  .command('dev')
  .description('watch for changes in the core source tree')
  .action(() => {
    cp.spawn('pnpm run build -- -f -w', { stdio: 'inherit', shell: true });
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

program.parse(process.argv);
