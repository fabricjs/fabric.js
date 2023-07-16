import { test } from '@playwright/test';
import { execSync } from 'child_process';
import {
  ensureDirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs-extra';
import path from 'path';

test.beforeEach(async ({ page }, { file, outputDir, config }) => {
  const testDir = path.resolve(file, '..');
  const pathToApp = path.resolve(testDir, 'index.ts');
  if (!existsSync(pathToApp)) {
    return;
  }
  config.metadata.app = true;
  page.evaluate(() => document.body.append('Loading App...'));
  const templateDir = path.resolve('.codesandbox', 'templates', 'vanilla');
  // install deps
  if (!existsSync(path.resolve(templateDir, 'node_modules'))) {
    execSync('npm link', { cwd: process.cwd(), stdio: 'inherit' });
    execSync('npm link fabric --include=dev --save', {
      cwd: templateDir,
      stdio: 'inherit',
    });
    execSync('npm i --include=dev', {
      cwd: templateDir,
      stdio: 'inherit',
    });
  }
  // create index.html
  const destination = path.resolve(outputDir, 'app');
  ensureDirSync(destination);
  const pathToIndex = path.resolve(destination, 'index.html');
  writeFileSync(
    pathToIndex,
    readFileSync(path.resolve(templateDir, 'index.html'))
      .toString()
      .replace(
        /src="([^"]+)"/,
        `src="${path.relative(destination, pathToApp)}"`
      )
  );
  // build
  const pathToBuild = path.resolve(destination, 'dist');
  execSync(
    `npx parcel build ${pathToIndex} --trace --no-optimize --no-content-hash ${
      process.env.CI
        ? '--no-cache'
        : `--cache-dir ${path.resolve(testDir, '.parcel-cache')}`
    } --public-url . --dist-dir ${pathToBuild}`,
    {
      cwd: templateDir,
    }
  );
  // navigate
  await page.goto(`/${path.relative(process.cwd(), pathToBuild)}`);
});
