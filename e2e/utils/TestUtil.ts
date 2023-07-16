import type { LocatorScreenshotOptions, Page } from '@playwright/test';

export class TestUtil {
  constructor(readonly page: Page) {}

  clickCanvas(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click('canvas.upper-canvas', clickProperties);
  }

  screenshot(options: LocatorScreenshotOptions = {}) {
    return this.page
      .locator('[data-fabric="wrapper"]')
      .screenshot({ omitBackground: true, ...options });
  }
}
