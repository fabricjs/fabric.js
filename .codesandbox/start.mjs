import chalk from 'chalk';
import cp from 'child_process';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'node:path';
import { build } from '../scripts/build.mjs';
import { subscribe } from '../scripts/buildLock.mjs';
import { wd } from '../scripts/dirname.mjs';


/**
 * Writes a timestamp in `package.json` file of `dest` dir
 * This is done to invoke the watcher watching `dest` and serving the app from it
 * I looked for other ways to tell the watcher to watch changes in fabric but I came out with this options only (symlinking and other stuff).
 * @param {string} destination
 */
export function startSandbox(destination) {
  console.log(chalk.blue('\n> linking fabric'));
  cp.execSync('npm link', { cwd: wd, stdio: 'inherit' });
  cp.execSync('npm link fabric --save', {
    cwd: destination,
    stdio: 'inherit',
  });
  console.log(chalk.blue('> installing deps'));
  cp.execSync('npm i --include=dev', { cwd: destination, stdio: 'inherit' });
  build({ watch: true, fast: true });
  
  const pathToTrigger = path.resolve(destination, 'package.json');
  subscribe((locked) => {
    !locked &&
      fs.writeFileSync(
        pathToTrigger,
        JSON.stringify(
          {
            ...JSON.parse(fs.readFileSync(pathToTrigger)),
            trigger: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
          null,
          '\t'
        )
      );
  }, 500);

  console.log(chalk.blue('> starting'));
    cp.spawn('npm run dev', {
      cwd: destination,
      stdio: 'inherit',
      shell: true,
    });
}