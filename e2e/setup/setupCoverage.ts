import { Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'path';
import { URL } from 'url';
import v8toIstanbul from 'v8-to-istanbul';
import { fromPairs } from 'es-toolkit/compat';

// https://playwright.dev/docs/api/class-coverage

const coverageIgnore = ['node_modules', 'e2e'];

export async function stopCoverage(page: Page, outputDir: string) {
  const coverage = await page.coverage.stopJSCoverage();
  const nyc = fromPairs(
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
        }),
      )
    ).filter(
      ([pathTo]) =>
        !coverageIgnore.some((ignore) =>
          (pathTo as string).startsWith(path.resolve(process.cwd(), ignore)),
        ),
    ),
  );
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(
    path.resolve(outputDir, 'coverage-v8.json'),
    JSON.stringify(coverage, null, 2),
  );
  writeFileSync(
    path.resolve(outputDir, 'coverage.json'),
    JSON.stringify(nyc, null, 2),
  );
}
