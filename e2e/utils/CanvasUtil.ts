import type { JSHandle } from '@playwright/test';
import { type LocatorScreenshotOptions, type Page } from '@playwright/test';
import type { Canvas, XY } from 'fabric';
import os from 'node:os';
import type { ObjectUtil } from './ObjectUtil';

export class CanvasUtil {
  constructor(
    readonly page: Page,
    readonly selector = '#canvas',
  ) {}

  click(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click(`canvas_top=${this.selector}`, clickProperties);
  }

  async makeActiveSelectionWith(objects: ObjectUtil[]) {
    for (const objectUtil of objects) {
      this.page.click(`canvas_top=${this.selector}`, {
        modifiers: ['Shift'],
        position: await objectUtil.getObjectCenter(),
      });
    }
  }

  async makeActiveSelectionByDragging(objects: ObjectUtil[]) {
    const points = [];
    for (const objectUtil of objects) {
      points.push(...(await objectUtil.getObjectCoords()));
    }
    const bbox = await this.executeInBrowser(
      (_, { points }) => {
        return fabric.util.makeBoundingBoxFromPoints(points);
      },
      { points },
    );
    await this.clickAndDrag(
      { x: bbox.left - 20, y: bbox.top - 20 },
      { x: bbox.left + bbox.width + 20, y: bbox.top + bbox.height + 20 },
    );
  }

  async clickAndDrag(point: XY, dragTo: XY, steps = 20) {
    await this.page.mouse.move(point.x, point.y);
    await this.page.mouse.down({
      button: 'left',
    });
    await this.page.mouse.move(dragTo.x, dragTo.y, {
      steps,
    });
    await this.page.mouse.up({
      button: 'left',
    });
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

  evaluateSelf() {
    return this.page.evaluateHandle<Canvas>(
      ([selector]) => canvasMap.get(document.querySelector(selector)),
      [this.selector],
    );
  }

  async executeInBrowser<C, R>(
    runInBrowser: (canvas: Canvas, context: C) => R,
    context?: C,
  ): Promise<R> {
    return (await this.evaluateSelf()).evaluate(runInBrowser, context);
  }

  async evaluateHandle<C, R>(
    runInBrowser: (canvas: Canvas, context: C) => R,
    context?: C,
  ): Promise<JSHandle<R>> {
    return (await this.evaluateSelf()).evaluateHandle(runInBrowser, context);
  }
}
