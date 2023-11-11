import { expect, test } from '@playwright/test';
import { spawn } from 'child_process';
import { readFileSync, watch } from 'fs';
import killPort from 'kill-port';
import path from 'path';
import type { Canvas } from '../../..';
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

  let disposer: VoidFunction;

  test.beforeAll(async ({}, testInfo) => {
    testInfo.setTimeout(60 * 1000);
    try {
      await killPort(PORT);
    } catch (error) {}
    // import `startSandbox` directly once ESM is supported
    // https://playwright.dev/docs/release-notes#improved-typescript-support
    const task = spawn(`npm start next -- -p ${PORT} --no-watch`, {
      cwd: process.cwd(),
      shell: true,
    });
    task.stdout.pipe(process.stdout);
    task.stderr.pipe(process.stderr);
    disposer = () => {
      task.kill();
    };
    return new Promise<void>((resolve) => {
      const watcher = watch(nextTemplateDir, (event, filename) => {
        if (filename === '.instrumentation') {
          watcher.close();
          resolve();
        }
      });
    });
  });

  test.afterAll(() => disposer());

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
        .fill('fabric can be used in SSR frameworks');
      await page.evaluate(async () => {
        // window.canvas is exposed in .codesandbox/templates/next/components/Canvas.tsx:33
        const {
          canvas,
        } = // eslint-disable-next-line no-restricted-globals
          window as Window & typeof globalThis & { canvas: Canvas };
        const text = canvas.getActiveObject();
        const text1 = await text.clone();
        text1.set({ originX: 'left' });
        text1.setX(0);
        const text2 = await text.clone();
        text2.set({ originX: 'right' });
        // eslint-disable-next-line no-restricted-globals
        text2.setX(window.innerWidth);
        canvas.add(text1, text2);
      });
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
