import { test } from '@playwright/test';
import './setupCoverage';
import './setupApp';
import path from 'path';

test.beforeEach(async ({ page }, testInfo) => {
  // fix snapshot names so they are cross platform
  // https://github.com/microsoft/playwright/issues/7575#issuecomment-1240566545
  testInfo.snapshotPath = (name: string) =>
    `${testInfo.file}-snapshots/${path.basename(name, '.png')}.png`;
});
