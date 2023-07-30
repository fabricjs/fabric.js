import type { Page } from '@playwright/test';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ensureDirSync } from 'fs-extra';
import path from 'path';

/**
 * Update this list in order to add fonts to tests
 * {@link setupFonts} will handle the rest
 */
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

const fontURL = `https://fonts.googleapis.com/css?family=${fonts
  .map((name) => `${name.replaceAll(' ', '+')}`)
  .join('|')}`;

/**
 * Downloads, caches and loads {@link fonts} into the {@link page}
 */
export async function setupFonts(page: Page) {
  const pathToFonts = path.resolve(process.cwd(), 'e2e', '.cache', 'fonts');
  ensureDirSync(pathToFonts);
  const pathToFontsHash = path.resolve(pathToFonts, 'hash.json');
  const pathToFontsCSS = path.resolve(pathToFonts, 'index.css');
  //   cache css file + create hash
  if (
    !existsSync(pathToFontsHash) ||
    !existsSync(pathToFontsCSS) ||
    readFileSync(pathToFontsHash).toString() !== JSON.stringify(fonts)
  ) {
    writeFileSync(pathToFontsHash, JSON.stringify(fonts));
    writeFileSync(pathToFontsCSS, await (await fetch(fontURL)).text());
  }
  // intercept font requests for caching
  await page.route(/^https:\/\/fonts.gstatic.com/, async (route) => {
    const url = route.request().url();
    const pathToFile = `${path.resolve(
      pathToFonts,
      Buffer.from(url, 'utf-8').toString('hex')
    )}`;
    !existsSync(pathToFile) &&
      writeFileSync(pathToFile, await (await route.fetch()).body(), {
        encoding: 'binary',
      });
    return route.fulfill({
      body: Buffer.from(
        readFileSync(pathToFile, { encoding: 'binary' }),
        'binary'
      ),
      contentType: 'font/ttf',
    });
  });
  // load css
  await page.addStyleTag({
    path: path.relative(process.cwd(), pathToFontsCSS),
  });
  // wait for fonts to load
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
  return trigger;
}
