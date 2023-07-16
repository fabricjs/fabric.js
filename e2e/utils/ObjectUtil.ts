import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Canvas, Object as FabricObject } from '../..';

export class ObjectUtil {
  constructor(readonly objectId: string, readonly page: Page) {}

  executeInBrowser<C, R>(
    runInBrowser: (
      context: Omit<C, 'objectId'> & {
        object: FabricObject;
        canvas: Canvas;
      }
    ) => R,
    context?: C
  ): Promise<R> {
    return this.page.evaluate(
      ({ objectId, runInBrowser, ...context }) => {
        return eval(runInBrowser)({
          object: targets[objectId],
          canvas,
          ...context,
        });
      },
      {
        ...context,
        objectId: this.objectId,
        runInBrowser: runInBrowser.toString(),
      }
    );
  }

  getObjectCenter() {
    return this.executeInBrowser(({ object }) => object.getCenterPoint());
  }

  getObjectControlPoint(controlName: string) {
    return this.executeInBrowser(
      ({ object, controlName }) => object.oCoords[controlName],
      { controlName }
    );
  }

  async expectObjectToMatch<T extends Record<string, unknown>>(expected: T) {
    const snapshot = await this.executeInBrowser(({ object }) => object);
    expect(snapshot).toMatchObject(expected);
  }
}
