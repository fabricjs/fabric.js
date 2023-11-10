import chalk from 'chalk';
import cp from 'child_process';
import fs from 'fs-extra';
import moment from 'moment';
import path from 'node:path';
import { build } from '../scripts/build.mjs';
import { subscribe } from '../scripts/buildLock.mjs';
import { wd } from '../scripts/dirname.mjs';

const TEMPLATE_PORTS = {
  vanilla: 1234,
  next: 3000,
  node: 8080,
};

/**
 * Writes a timestamp in `package.json` file of `dest` dir
 * This is done to invoke the watcher watching `dest` and serving the app from it
 * I looked for other ways to tell the watcher to watch changes in fabric but I came out with this options only (symlinking and other stuff).
 * @param {string} destination
 */
export function startSandbox(
  destination,
  {
    template,
    buildAndWatch = true,
    installDeps = false,
    port = TEMPLATE_PORTS[template] || 8000,
    launchBrowser = false,
    launchVSCode = false,
  } = {}
) {
  console.log(chalk.blue('\n> linking fabric'));
  cp.execSync('npm link', { cwd: wd, stdio: 'inherit' });
  cp.execSync('npm link fabric --include=dev --save', {
    cwd: destination,
    stdio: 'inherit',
  });

  if (
    installDeps ||
    !fs.existsSync(path.resolve(destination, 'node_modules'))
  ) {
    console.log(chalk.blue('\n> installing dependencies'));
    cp.execSync('npm i --include=dev', { cwd: destination, stdio: 'inherit' });
  }

  if (buildAndWatch) {
    console.log(chalk.blue('\n> building and watching for changes'));
    build({ watch: true, fast: true });
  }

  const pathToTrigger = path.resolve(destination, 'package.json');
  subscribe((locked) => {
    if (!locked) {
      const packageJSON = fs.readJsonSync(pathToTrigger);
      fs.writeJSONSync(
        pathToTrigger,
        {
          ...packageJSON,
          trigger: moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        { spaces: 2 }
      );
      fs.writeJSONSync(pathToTrigger, packageJSON, { spaces: 2 });
    }
  }, 500);

  console.log(
    chalk.blue(
      `\n> starting ${chalk.bold(
        JSON.parse(fs.readFileSync(pathToTrigger)).name
      )}`
    )
  );

  if (launchVSCode) {
    try {
      cp.exec('code .', { cwd: destination });
    } catch (error) {
      console.log('> failed to open VSCode');
    }
  }

  const task = cp.spawn(`npm run dev -- -p ${port}`, {
    cwd: destination,
    stdio: 'inherit',
    shell: true,
  });

  launchBrowser && cp.exec(`open-cli http://localhost:${port}/`);

  return task;
}
