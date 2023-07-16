import { test } from '@playwright/test';
import { execSync } from 'child_process';
import { copySync, existsSync, readFileSync, writeFileSync } from 'fs-extra';
import path from 'path';
import { ignore } from '../../.codesandbox/utils.mjs';

test.beforeEach(async ({ page }, { file, outputDir }) => {
  // install the app
  const destination = path.resolve(outputDir, 'app');
  if (!existsSync(destination)) {
    const templateDir = path.resolve('.codesandbox', 'templates', 'vanilla');
    copySync(templateDir, destination, {
      filter: (src) => !ignore(templateDir, path.relative(templateDir, src)),
    });
  }
  // install deps
  if (!existsSync(path.resolve(destination, 'node_modules'))) {
    execSync('npm link', { cwd: process.cwd(), stdio: 'inherit' });
    execSync('npm link fabric --include=dev --save', {
      cwd: destination,
      stdio: 'inherit',
    });
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
      .replace(
        /src="([^"]+)"/,
        `src="${path.relative(
          destination,
          path.resolve(file, '..', 'index.ts')
        )}"`
      )
  );
  // build
  execSync(
    `npm run build -- --public-url . ${process.env.CI ? '--no-cache' : ''}`,
    { cwd: destination }
  );
  const pathToBuild = path.relative(
    process.cwd(),
    path.resolve(destination, 'dist')
  );
  // navigate
  await page.goto(`/${pathToBuild}`);
});
