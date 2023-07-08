import { Page, expect } from '@playwright/test';

let ID = 0;
const uuid = () => `test${ID++}`;

export class TestUtil {
  constructor(readonly page: Page) {}

  async addTextbox(text: string, properties) {
    const objectId = uuid();
    await this.page.evaluate(
      ({ objectId, text, properties }) => {
        const textbox = new fabric.Textbox(text, {
          ...properties,
          id: objectId,
        });
        fabricCanvas.add(textbox);
      },
      { objectId, text, properties }
    );
    return objectId;
  }

  getObjectCenter(objectId: string) {
    return this.page.evaluate(
      ({ objectId }) => {
        const obj = fabricCanvas
          .getObjects()
          .find((obj) => obj.id === objectId);
        return obj.getCenterPoint();
      },
      { objectId }
    );
  }

  clickCanvas(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click('canvas.upper-canvas', clickProperties);
  }

  getObjectControlPoint(objectId: string, controlName: string) {
    return this.page.evaluate(
      ({ objectId, controlName }) => {
        const obj = fabricCanvas
          .getObjects()
          .find((obj) => obj.id === objectId);
        return obj.oCoords[controlName];
      },
      { objectId, controlName }
    );
  }

  async expectObjectToMatch<T extends Record<string, unknown>>(
    objectId: string,
    expected: T
  ) {
    const snapshot = await this.page.evaluate(
      ({ objectId }) => {
        return fabricCanvas.getObjects().find((obj) => obj.id === objectId);
      },
      { objectId }
    );
    expect(snapshot).toMatchObject(expected);
  }
}
