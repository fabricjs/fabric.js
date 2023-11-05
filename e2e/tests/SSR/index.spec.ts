import { expect, test } from '@playwright/test';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import { spawn } from 'child_process';
import { watch } from 'fs';
import path from 'path';

// setup();

let task: ChildProcessWithoutNullStreams;
test.beforeAll(({}, testInfo) => {
  testInfo.setTimeout(60 * 1000);
  task = spawn('npm start next -- --no-watch', {
    stdio: 'pipe',
    shell: true,
    detached: true,
    cwd: process.cwd(),
  });
  return new Promise<void>((resolve) => {
    const watcher = watch(
      path.resolve(process.cwd(), '.codesandbox', 'templates', 'next'),
      (event, filename) => {
        if (filename === '.instrumentation') {
          watcher.close();
          resolve();
        }
      }
    );
  });
});
test.afterAll(() => task.kill(0));

test('SSR with Next.js', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('load');
  expect(await page.screenshot()).toMatchSnapshot();
});
