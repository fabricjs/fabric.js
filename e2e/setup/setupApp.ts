import { test } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import imports from '../imports';
import { JSDOM } from 'jsdom';
import { FabricNamespace } from '../tests/types';
import { last } from 'lodash';

const siteDir = path.resolve(process.cwd(), 'e2e', 'site');
const e2eDistDir = path.resolve(process.cwd(), 'e2e', 'dist');
const mainDistDr = path.resolve(process.cwd(), 'dist');
const distExtensions = path.resolve(process.cwd(), 'dist-extensions');
const assetsDir = path.resolve(process.cwd(), 'test', 'visual', 'assets');
const fixturesDir = path.resolve(process.cwd(), 'test', 'fixtures');

export default () => {
  test.beforeEach(async ({ page }, { file }) => {
    await page.addInitScript(() => {
      globalThis.getAssetName = (name: string) => `/test/visual/assets/${name}`;
      globalThis.getFixtureName = (name: string) => `/test/fixtures/${name}`;
      globalThis.getImage = async (
        fabric: FabricNamespace,
        filename: string,
      ): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = fabric.getFabricDocument().createElement('img');
          img.onload = function () {
            img.onerror = null;
            img.onload = null;
            resolve(img);
          };
          img.onerror = function (err) {
            img.onerror = null;
            img.onload = null;
            reject(err);
          };
          img.src = globalThis.getFixtureName(filename);
        });
      };
    });

    await page.route(/test.local/, (route, request) => {
      const url = new URL(request.url());
      const pathname = url.pathname;

      const contentType =
        pathname.endsWith('.js') || pathname.endsWith('.mjs')
          ? 'application/javascript'
          : pathname.endsWith('.html')
            ? 'text/html'
            : pathname.endsWith('svg')
              ? 'image/svg+xml'
              : 'text/plain';

      if (url.href.includes('/e2e/dist')) {
        const fileNameParts = pathname.replace('e2e/dist', '').split('/');
        const content = readFileSync(
          path.join(e2eDistDir, ...fileNameParts),
          'utf8',
        );
        return route.fulfill({
          status: 200,
          contentType,
          body: content,
        });
      }

      if (url.href.includes('/assets')) {
        const assetName = last(pathname.split('/'));
        const asset = readFileSync(path.join(assetsDir, assetName));
        return route.fulfill({
          status: 200,
          contentType,
          body: asset,
        });
      }

      if (url.href.includes('/fixtures')) {
        const fixtureName = last(pathname.split('/'));
        const asset = readFileSync(path.join(fixturesDir, fixtureName));
        return route.fulfill({
          status: 200,
          contentType,
          body: asset,
        });
      }

      if (url.href.includes('/dist-extensions')) {
        const fileNameParts = pathname
          .replace('dist-extensions', '')
          .split('/');
        const content = readFileSync(
          path.join(distExtensions, ...fileNameParts),
          'utf-8',
        );
        return route.fulfill({
          status: 200,
          contentType,
          body: content,
        });
      }

      if (url.href.includes('/dist')) {
        const content = readFileSync(
          path.join(mainDistDr, 'index.mjs'),
          'utf-8',
        );
        return route.fulfill({
          status: 200,
          contentType,
          body: content,
        });
      }

      if (url.href.includes('/site')) {
        const htmlContent = readFileSync(
          path.join(siteDir, 'index.html'),
          'utf8',
        );
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: htmlContent,
        });
      }
    });

    await page.goto('/e2e/site');
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
      const doc = new JSDOM(readFileSync(pathToHTML).toString()).window
        .document;
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
      // used to avoid a race condition that occurs because of script loading
      const trigger = page.evaluate(
        () =>
          new Promise((resolve) => {
            window.addEventListener('fabric:setup', resolve, { once: true });
          }),
      );
      const testScriptContent = readFileSync(
        path.relative(process.cwd(), pathToBuiltApp),
        'utf-8',
      );
      await page.addScriptTag({
        type: 'module',
        content: `${testScriptContent}
       window.dispatchEvent(new CustomEvent('fabric:setup'));
       `,
      });
      await trigger;
      await page.evaluate(() => window.__setupFabricHook());
    }
  });
  //
  // test.afterEach(async ({ page }) => {
  //   await page.evaluate(() => window.__teardownFabricHook());
  // });
};
