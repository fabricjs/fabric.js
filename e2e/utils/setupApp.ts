import { test } from '@playwright/test';
import { existsSync } from 'fs';
import { readJSONSync } from 'fs-extra';
import path from 'path';

test.beforeEach(async ({ page }, { file }) => {
  await page.goto('/e2e/site');
  // expose imports for consumption
  page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports: {
        fabric: readJSONSync('./package.json').module.slice(1),
        test: '../dist/site/test.js',
      },
    }),
  });
  // add test script
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
    const trigger = page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          const text = document.createElement('span');
          text.textContent = 'Waiting for setup to complete...';
          text.style.position = 'absolute';
          text.style.left = '0px';
          text.style.top = '0px';
          text.style.fontSize = '48px';
          text.style.color = 'blue';
          document.body.append(text);
          window.addEventListener(
            'setup:completed',
            () => {
              text.remove();
              resolve();
            },
            { once: true }
          );
        })
    );
    await page.addScriptTag({
      type: 'module',
      path: path.relative(process.cwd(), pathToApp),
    });
    await trigger;
  }
});

test.afterEach(async ({ page }) => {
  await page.evaluate(
    () =>
      !window.__teardown ||
      new Promise((resolve) => {
        window.addEventListener('teardown:completed', resolve, { once: true });
        window.__teardown();
      })
  );
});
