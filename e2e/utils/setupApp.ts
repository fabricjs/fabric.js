import { test } from '@playwright/test';
import { existsSync } from 'fs';
import path from 'path';

test.beforeEach(async ({ page }, { file }) => {
  await page.goto('/e2e/site');
  const testDir = path.relative(
    path.resolve(process.cwd(), 'e2e', 'tests'),
    path.resolve(file, '..')
  );
  const pathToApp = path.resolve(
    process.cwd(),
    'e2e',
    'dist',
    'tests',
    testDir,
    'index.js'
  );
  if (existsSync(pathToApp)) {
    await page.addScriptTag({
      type: 'module',
      path: path.relative(process.cwd(), pathToApp),
    });
  }
});
