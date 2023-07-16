import { test } from '@playwright/test';
import { execSync } from 'child_process';
import { copySync, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import path from 'path';
import { ignore } from '../../.codesandbox/utils.mjs';

test.beforeAll(({ proxy }, { file }) => {
  // start the app
  const destination = path.resolve(path.dirname(file), 'app');
  const templateDir = path.resolve('.codesandbox', 'templates', 'vanilla');
  copySync(templateDir, destination, {
    filter: (src) => !ignore(templateDir, path.relative(templateDir, src)),
  });
  execSync('npm link', { cwd: process.cwd(), stdio: 'inherit' });
  execSync('npm link fabric --include=dev --save', {
    cwd: destination,
    stdio: 'inherit',
  });
  if (!existsSync(path.resolve(destination, 'node_modules'))) {
    execSync('npm i --include=dev', {
      cwd: destination,
      stdio: 'inherit',
    });
  }
  // change the app
  const pathTo = path.resolve(destination, 'index.html');
  writeFileSync(
    pathTo,
    readFileSync(pathTo)
      .toString()
      .replace(/src="([^"]+)"/, `src="../index.ts"`)
  );
  execSync('npm run build -- --public-url .', { cwd: destination });
});
