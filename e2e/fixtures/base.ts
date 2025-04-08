import { test as base } from '@playwright/test';
import { setupSelectors } from '../setup/setupSelectors';
import { CanvasUtil } from '../utils/CanvasUtil';
import { stopCoverage } from '../setup/setupCoverage';
import { setupApp } from '../setup/setupApp';

interface TestFixtures {
  canvasUtil: CanvasUtil;
}

export const test = base.extend<TestFixtures>({
  canvasUtil: async ({ page }, use) => {
    const canvasUtil = new CanvasUtil(page);
    await use(canvasUtil);
  },

  page: async ({ page }, use, testInfo) => {
    await page.coverage.startJSCoverage({ reportAnonymousScripts: false });
    await setupSelectors();
    await setupApp(page, testInfo.file);
    await use(page);
    await page.evaluate(() => window.__teardownFabricHook());
    await stopCoverage(page, testInfo.outputDir);
  },
});

export { expect } from '@playwright/test';
