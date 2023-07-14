import { LocatorScreenshotOptions, Page } from '@playwright/test';
import { ObjectUtil } from './ObjectUtil';

let ID = 0;
const uuid = () => `test${ID++}`;

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

  async addTextbox(text: string, properties) {
    const id = uuid();
    await this.page.evaluate(
      ({ id, text, ...properties }) => {
        const textbox = new fabric.Textbox(text, {
          ...properties,
          id,
        });
        fabricCanvas.add(textbox);
        return id;
      },
      { id, text, ...properties }
    );
    return new ObjectUtil(id, this.page);
  }
}
