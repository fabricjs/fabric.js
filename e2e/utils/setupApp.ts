import { test } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import imports from '../imports';
import { JSDOM } from 'jsdom';

test.beforeEach(async ({ page }, { file }) => {
  await page.goto('/e2e/site');
  // expose imports for consumption
  page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports,
    }),
  });
  // add test script
  const testDir = path.relative(
    path.resolve(process.cwd(), 'e2e', 'tests'),
    path.resolve(file, '..')
  );
  const pathToHTML = path.resolve(
    process.cwd(),
    'e2e',
    'tests',
    testDir,
    'index.html'
  );
  if (existsSync(pathToHTML)) {
    const doc = new JSDOM(readFileSync(pathToHTML).toString()).window.document;
    await page.evaluate((html) => {
      document.body.innerHTML = `${html}`;
    }, doc.body.innerHTML);
  }
  const pathToApp = path.resolve(
    process.cwd(),
    'e2e',
    'tests',
    testDir,
    'index.ts'
  );
  const pathToBuiltApp = path.resolve(
    process.cwd(),
    'e2e',
    'dist',
    testDir,
    'index.js'
  );
  const exists = existsSync(pathToBuiltApp);
  if (!exists && existsSync(pathToApp)) {
    throw new Error(
      `test script '${pathToBuiltApp}' not found: global setup script probably did not run`
    );
  } else if (exists) {
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
