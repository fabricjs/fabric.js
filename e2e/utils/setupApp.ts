import { test } from '@playwright/test';
import { execSync } from 'child_process';
import {
  ensureDirSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs-extra';
import path from 'path';

test.beforeEach(async ({ page }, { file, outputDir }) => {
  // install the app
  const templateDir = path.resolve('.codesandbox', 'templates', 'vanilla');
  const destination = path.resolve(outputDir, 'app');
  ensureDirSync(destination);
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
  const pathToIndex = path.resolve(destination, 'index.html');
  writeFileSync(
    pathToIndex,
    readFileSync(path.resolve(templateDir, 'index.html'))
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
  const pathToBuild = path.resolve(destination, 'dist');
  execSync(
    `npx parcel build ${pathToIndex} --no-cache --public-url . --dist-dir ${pathToBuild}`,
    {
      cwd: templateDir,
    }
  );
  // navigate
  await page.goto(`/${path.relative(process.cwd(), pathToBuild)}`);
});
