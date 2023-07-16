import { test } from '@playwright/test';
import { writeFileSync } from 'fs';
import _ from 'lodash';
import path from 'path';
import { URL } from 'url';
import v8toIstanbul from 'v8-to-istanbul';

// https://playwright.dev/docs/api/class-coverage

test.beforeEach(async ({ page }) => {
  await page.coverage.startJSCoverage({ reportAnonymousScripts: false });
});

test.afterEach(async ({ page }, { outputDir }) => {
  const coverage = await page.coverage.stopJSCoverage();
  const nyc = _.fromPairs(
    await Promise.all(
      coverage.map(async ({ url, source, functions }) => {
        const { pathname } = new URL(url);
        const pathTo = path.resolve(process.cwd(), pathname.slice(1));
        const converter = v8toIstanbul('', 0, {
          source: source!.replace(
            'sourceMappingURL=',
            `sourceMappingURL=${path.dirname(pathTo)}/`
          ),
        });
        await converter.load();
        converter.applyCoverage(functions);
        return [pathTo, converter.toIstanbul()];
      })
    )
  );
  writeFileSync(
    path.resolve(outputDir, 'coverage-v8.json'),
    JSON.stringify(coverage, null, 2)
  );
  writeFileSync(
    path.resolve(outputDir, 'coverage.json'),
    JSON.stringify(nyc, null, 2)
  );
});
