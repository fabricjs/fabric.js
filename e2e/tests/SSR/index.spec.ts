import { expect, test } from '@playwright/test';
import { exec, type ChildProcessWithoutNullStreams } from 'child_process';
import { readFileSync, watch } from 'fs';
import path from 'path';
import setupCoverage from '../../setup/setupCoverage';

setupCoverage();

test.describe('SSR', () => {
  const PORT = 3000;
  const nextTemplateDir = path.resolve(
    process.cwd(),
    '.codesandbox',
    'templates',
    'next'
  );

  let task: ChildProcessWithoutNullStreams;

  test.beforeAll(({}, testInfo) => {
    testInfo.setTimeout(60 * 1000);
    task = exec(`npm start next -- -p ${PORT} --no-watch`, {
      cwd: process.cwd(),
    });
    task.stdout.pipe(process.stdout);
    task.stderr.pipe(process.stderr);
    return new Promise<void>((resolve) => {
      const watcher = watch(nextTemplateDir, (event, filename) => {
        if (filename === '.instrumentation') {
          watcher.close();
          resolve();
        }
      });
    });
  });

  test.afterAll(() => task.kill());

  test('SSR with Next.js', async ({ page }) => {
    await page.goto(`http://localhost:${PORT}/`);
    await page.waitForLoadState('load');
    await test.step('edit text', async () => {
      await page
        .locator('canvas')
        .nth(1)
        .dblclick({
          position: {
            x: 625,
            y: 50,
          },
        });
      await page.getByRole('textbox').press('Control+a');
      await page
        .getByRole('textbox')
        .fill("fabric supports SSR!\nIsn't that amazing?!");
      await page.waitForTimeout(50);
      expect(await page.screenshot()).toMatchSnapshot();
    });

    await test.step('Server side downloads', async () => {
      await page.getByRole('link', { name: 'Node' }).click();
      const directDownloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Direct Download' }).click();
      const browserDownloadPromise = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Browser Download' }).click();
      expect(
        readFileSync(await (await directDownloadPromise).path())
      ).toMatchSnapshot({ name: 'download.png' });
      expect(
        readFileSync(await (await browserDownloadPromise).path())
      ).toMatchSnapshot({ name: 'download.png' });
    });
  });
});
