import { test } from '@playwright/test';
import { writeFileSync } from 'fs';
import path from 'path';
import v8toIstanbul from 'v8-to-istanbul';

// https://playwright.dev/docs/api/class-coverage

const coverageStore: CoverageMapData[] = [];

test.beforeEach(async ({ page }, testInfo) => {
  await page.coverage.startJSCoverage({ reportAnonymousScripts: false });
  // fix snapshot names so they are cross platform
  // https://github.com/microsoft/playwright/issues/7575#issuecomment-1240566545
  testInfo.snapshotPath = (name: string) =>
    `${testInfo.file}-snapshots/${path.basename(name, '.png')}.png`;
});

test.afterEach(async ({ page }, { outputDir }) => {
  const coverage = await page.coverage.stopJSCoverage();
  const nyc = await Promise.all(
    coverage.map(async (entry) => {
      const converter = v8toIstanbul('', 0, {
        source: entry.source!.replace(
          'sourceMappingURL=',
          'sourceMappingURL=dist/'
        ),
      });
      await converter.load();
      converter.applyCoverage(entry.functions);
      return converter.toIstanbul();
    })
  );
  coverageStore.push(...nyc);
  writeFileSync(
    path.resolve(outputDir, 'coverage-v8.json'),
    JSON.stringify(coverage, null, 2)
  );
  writeFileSync(
    path.resolve(outputDir, 'coverage.json'),
    JSON.stringify(nyc, null, 2)
  );
});

test.afterAll(() => {
  writeFileSync(
    './e2e/test-results/coverage.json',
    JSON.stringify(coverageStore, null, 2)
  );
});
