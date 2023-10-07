import { type LocatorScreenshotOptions, type Page } from '@playwright/test';
import type { Canvas } from 'fabric';
import os from 'node:os';

export class CanvasUtil {
  constructor(readonly page: Page, readonly selector = '#canvas') {}

  click(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click(`canvas_top=${this.selector}`, clickProperties);
  }

  press(keyPressed: Parameters<Page['press']>[1]) {
    return this.page.keyboard.press(keyPressed, { delay: 200 });
  }

  ctrlC(): Promise<void> {
    const isMac = os.platform() === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    return this.page.keyboard.press(`${modifier}+KeyC`);
  }

  ctrlV(): Promise<void> {
    const isMac = os.platform() === 'darwin';
    const modifier = isMac ? 'Meta' : 'Control';
    return this.page.keyboard.press(`${modifier}+KeyV`);
  }

  screenshot(options: LocatorScreenshotOptions = {}) {
    return this.page
      .locator(`canvas_wrapper=${this.selector}`)
      .screenshot({ omitBackground: true, ...options });
  }

  async executeInBrowser<C, R>(
    runInBrowser: (canvas: Canvas, context: C) => R,
    context?: C
  ): Promise<R> {
    return (
      await this.page.evaluateHandle<Canvas>(
        ([selector]) => canvasMap.get(document.querySelector(selector)),
        [this.selector]
      )
    ).evaluate(runInBrowser, context);
  }
}
