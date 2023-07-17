import { type LocatorScreenshotOptions, type Page } from '@playwright/test';
import type { Canvas } from 'fabric';

export class CanvasUtil {
  constructor(readonly page: Page, readonly selector = '#canvas') {}

  click(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click(`canvas_top=${this.selector}`, clickProperties);
  }

  screenshot(options: LocatorScreenshotOptions = {}) {
    return this.page
      .locator(`canvas_wrapper=${this.selector}`)
      .screenshot({ omitBackground: true, ...options });
  }

  executeInBrowser<C, R>(
    runInBrowser: (canvas: Canvas, context: C) => R,
    context: C
  ): Promise<R> {
    return this.page.evaluate(
      ([selector, runInBrowser, context]) => {
        return eval(runInBrowser)(canvas, context);
      },
      [this.selector, runInBrowser.toString(), context] as const
    );
  }
}
