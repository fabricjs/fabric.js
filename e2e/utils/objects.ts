import { Page, expect } from '@playwright/test';
import { Canvas, Object as FabricObject } from '../..';

let ID = 0;
const uuid = () => `test${ID++}`;

export class TestUtil {
  constructor(readonly page: Page) {}

  clickCanvas(clickProperties: Parameters<Page['click']>[1]) {
    return this.page.click('canvas.upper-canvas', clickProperties);
  }

  addTextbox(text: string, properties) {
    return this.executeInBrowser(
      ({ canvas, id, text, ...properties }) => {
        const textbox = new fabric.Textbox(text, {
          ...properties,
          id,
        });
        canvas.add(textbox);
        return id;
      },
      { id: uuid(), text, ...properties }
    );
  }

  executeInBrowser<C extends { objectId?: string }, R>(
    runInBrowser: (
      context: Omit<C, 'objectId'> & {
        object: C extends { objectId: string } ? FabricObject : never;
        canvas: Canvas;
      }
    ) => R,
    context?: C
  ): Promise<R> {
    return this.page.evaluate(
      ({ objectId, runInBrowser, ...context }) => {
        return eval(runInBrowser)({
          object:
            objectId &&
            fabricCanvas.getObjects().find((obj) => obj.id === objectId),
          canvas: fabricCanvas,
          ...context,
        });
      },
      { ...context, runInBrowser: runInBrowser.toString() }
    );
  }

  getObjectCenter(objectId: string) {
    return this.executeInBrowser(({ object }) => object.getCenterPoint(), {
      objectId,
    });
  }

  getObjectControlPoint(objectId: string, controlName: string) {
    return this.executeInBrowser(
      ({ object, controlName }) => object.oCoords[controlName],
      { objectId, controlName }
    );
  }

  async expectObjectToMatch<T extends Record<string, unknown>>(
    objectId: string,
    expected: T
  ) {
    const snapshot = await this.executeInBrowser(({ object }) => object, {
      objectId,
    });
    expect(snapshot).toMatchObject(expected);
  }
}
