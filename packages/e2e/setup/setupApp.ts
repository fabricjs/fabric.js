import { Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

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

  await page.goto('/packages/e2e/site/index.html');

  // add test script
  const testDir = path.relative(
    path.resolve(packageRoot, 'tests'),
    path.resolve(file, '..'),
  );
  const pathToHTML = path.resolve(packageRoot, 'tests', testDir, 'index.html');
  if (existsSync(pathToHTML)) {
    await page.evaluate(
      (html) => {
        document.body.innerHTML = new DOMParser().parseFromString(
          html,
          'text/html',
        ).body.innerHTML;
      },
      readFileSync(pathToHTML, 'utf8'),
    );
  }
  const pathToApp = path.resolve(packageRoot, 'tests', testDir, 'index.ts');
  if (existsSync(pathToApp)) {
    const scriptUrl = `/${path
      .relative(repoRoot, pathToApp)
      .replaceAll('\\', '/')}`;
    // addScriptTag with url resolves after the module is loaded and executed
    await page.addScriptTag({ type: 'module', url: scriptUrl });
    await page.evaluate(() => window.__setupFabricHook());
  }
}
