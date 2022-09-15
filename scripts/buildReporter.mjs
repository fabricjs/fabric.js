/**
 * This file is used by `./build` to create `cli_output/build-lock.json`
 */

import { Command } from 'commander';
import { report } from './buildLock.mjs';

const program = new Command();

program
  .command('report <type>', { isDefault: true })
  .action((type) => {
    report(type);
  })
  .parse(process.argv);
