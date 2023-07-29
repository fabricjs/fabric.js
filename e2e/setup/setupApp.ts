import { test } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import * as pkg from '../../package.json';

const fonts = [
  // 'Arial',
  'Courier',
  'Times New Roman',
  'Engagement',
  'Lacquer',
  'Poppins',
  'Plaster',
  // 'Monaco',
  'Ubuntu',
];

export function resolvePath(pathToFile: string) {
  return `/${path
    .relative(
      process.cwd(),
      path.isAbsolute(pathToFile)
        ? pathToFile
        : path.resolve(process.cwd(), pathToFile)
    )
    .replaceAll(/\\/g, '/')}`;
}

export function resolveModule(name: string) {
  return resolvePath(require.resolve(name));
}

test.beforeEach(async ({ page }, { file }) => {
  await page.goto('/e2e/site');
  // expose imports for consumption
  await page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports: Object.keys({
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
        ...(pkg.optionalDependencies || {}),
      }).reduce(
        (importmap, key) => {
          try {
            importmap[key] = resolveModule(key);
          } catch (error) {}
          return importmap;
        },
        { fabric: resolvePath(pkg.module) }
      ),
    }),
  });
  // load fonts
  const fontURL = `https://fonts.googleapis.com/css?family=${fonts
    .map((name) => `${name.replaceAll(' ', '+')}`)
    .join('|')}`;
  await page.addStyleTag({
    url: fontURL,
  });
  const trigger = page.evaluate(
    () =>
      new Promise((resolve) =>
        window.addEventListener('fonts:loaded', resolve, { once: true })
      )
  );
  await page.addScriptTag({
    type: 'module',
    content: `import 'fontfaceobserver';
    Promise.all([${fonts
      .map(
        (font) =>
          `new FontFaceObserver('${font}').load().catch(err => console.log('Error loading font ${font}', err))`
      )
      .join(
        ','
      )}]).then(() => window.dispatchEvent(new CustomEvent('fonts:loaded')))`,
  });
  await trigger;
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
    // used to avoid a race condition that occurs because of script loading
    const trigger = page.evaluate(
      () =>
        new Promise((resolve) => {
          window.addEventListener('fabric:setup', resolve, { once: true });
        })
    );
    await page.addScriptTag({
      type: 'module',
      content: `${readFileSync(
        path.relative(process.cwd(), pathToBuiltApp)
      ).toString()}
       window.dispatchEvent(new CustomEvent('fabric:setup'));
       `,
    });
    await trigger;
    await page.evaluate(() => window.__setupFabricHook());
  }
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => window.__teardownFabricHook());
});
