import { test } from '@playwright/test';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import _ from 'lodash';
import path from 'path';
import { URL } from 'url';
import v8toIstanbul from 'v8-to-istanbul';

// https://playwright.dev/docs/api/class-coverage

const coverageIgnore = ['node_modules', 'e2e'];

export default () => {
  test.beforeEach(async ({ page }) => {
    await page.coverage.startJSCoverage({ reportAnonymousScripts: false });
  });

  test.afterEach(async ({ page }, { outputDir }) => {
    const coverage = await page.coverage.stopJSCoverage();
    const nyc = _.fromPairs(
      (
        await Promise.all(
          coverage.map(async ({ url, source, functions }) => {
            let pathname = url;
            try {
              // remove url origin
              pathname = pathname.slice(new URL(url).origin.length + 1);
            } catch (error) {}
            const pathTo = path.resolve(process.cwd(), pathname);
            const converter = v8toIstanbul(pathTo, 0, {
              source: source!,
            });
            await converter.load();
            converter.applyCoverage(functions);
            return [pathTo, converter.toIstanbul()];
          })
        )
      ).filter(
        ([pathTo]: [string]) =>
          !coverageIgnore.some((ignore) =>
            pathTo.startsWith(path.resolve(process.cwd(), ignore))
          )
      )
    );
    ensureDirSync(outputDir);
    writeFileSync(
      path.resolve(outputDir, 'coverage-v8.json'),
      JSON.stringify(coverage, null, 2)
    );
    writeFileSync(
      path.resolve(outputDir, 'coverage.json'),
      JSON.stringify(nyc, null, 2)
    );
  });
};
