import { Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import imports from '../imports';
import { JSDOM } from 'jsdom';

const packageRoot = process.cwd();
const repoRoot = path.resolve(packageRoot, '..', '..');

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

  await page.goto('/packages/e2e/site');

  // expose imports for consumption
  await page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports,
    }),
  });

  // add test script
  const testDir = path.relative(
    path.resolve(packageRoot, 'tests'),
    path.resolve(file, '..'),
  );
  const pathToHTML = path.resolve(packageRoot, 'tests', testDir, 'index.html');
  if (existsSync(pathToHTML)) {
    const doc = new JSDOM(readFileSync(pathToHTML).toString()).window.document;
    await page.evaluate((html) => {
      document.body.innerHTML = `${html}`;
    }, doc.body.innerHTML);
  }
  const pathToApp = path.resolve(packageRoot, 'tests', testDir, 'index.ts');
  const pathToBuiltApp = path.resolve(packageRoot, 'dist', testDir, 'index.js');
  const exists = existsSync(pathToBuiltApp);
  if (!exists && existsSync(pathToApp)) {
    throw new Error(
      `test script '${pathToBuiltApp}' not found: global setup script probably did not run`,
    );
  } else if (exists) {
    const scriptUrl = `/${path
      .relative(repoRoot, pathToBuiltApp)
      .replaceAll('\\', '/')}`;
    // addScriptTag with url resolves after the module is loaded and executed
    await page.addScriptTag({ type: 'module', url: scriptUrl });
    await page.evaluate(() => window.__setupFabricHook());
  }
}
