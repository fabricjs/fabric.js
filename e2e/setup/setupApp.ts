import { Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import imports from '../imports';
import { JSDOM } from 'jsdom';

export async function setupApp(page: Page, file: string) {
  await page.addInitScript(() => {
    globalThis.getAssetName = (name: string) => `/test/visual/assets/${name}`;
    globalThis.getFixtureName = (name: string) => `/test/fixtures/${name}`;
    globalThis.getAsset = async function (name: string) {
      const finalName = globalThis.getAssetName(name);
      const res = await fetch(finalName);
      return res.text();
    };
  });

  await page.goto('/e2e/site');

  // Provide CommonJS shim for westures
  await page.addScriptTag({
    content: `
      window.module = { exports: {} };
      window.exports = window.module.exports;
    `,
  });

  // Load westures as a global module
  await page.addScriptTag({
    path: path.resolve(process.cwd(), 'node_modules/westures/dist/index.js'),
  });

  // Expose westures from module.exports
  await page.evaluate(() => {
    (window as any).westures = window.module.exports;
  });

  // expose imports for consumption
  await page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports,
    }),
  });

  // add test script
  const testDir = path.relative(
    path.resolve(process.cwd(), 'e2e', 'tests'),
    path.resolve(file, '..'),
  );
  const pathToHTML = path.resolve(
    process.cwd(),
    'e2e',
    'tests',
    testDir,
    'index.html',
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
    'index.ts',
  );
  const pathToBuiltApp = path.resolve(
    process.cwd(),
    'e2e',
    'dist',
    testDir,
    'index.js',
  );
  const exists = existsSync(pathToBuiltApp);
  if (!exists && existsSync(pathToApp)) {
    throw new Error(
      `test script '${pathToBuiltApp}' not found: global setup script probably did not run`,
    );
  } else if (exists) {
    const scriptUrl = `/${path.relative(process.cwd(), pathToBuiltApp).replaceAll('\\', '/')}`;
    // addScriptTag with url resolves after the module is loaded and executed
    await page.addScriptTag({ type: 'module', url: scriptUrl });
    await page.evaluate(() => window.__setupFabricHook());
  }
}
