import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Object as FabricObject } from 'fabric';
import type { before, beforeAll } from 'test';

export class ObjectUtil {
  constructor(
    readonly page: Page,
    /**
     * the key matching the a key returned from the {@link beforeAll} or {@link before} callback
     */
    readonly objectId: string
  ) {}

  executeInBrowser<C, R>(
    runInBrowser: (object: FabricObject, context: C) => R,
    context?: C
  ): Promise<R> {
    return this.page.evaluate(
      ([objectId, runInBrowser, context]) => {
        return eval(runInBrowser)(objectMap.get(objectId), context);
      },
      [this.objectId, runInBrowser.toString(), context] as const
    );
  }

  getObjectCenter() {
    return this.executeInBrowser((object) => object.getCenterPoint());
  }

  getObjectControlPoint(controlName: string) {
    return this.executeInBrowser(
      (object, { controlName }) => object.oCoords[controlName],
      { controlName }
    );
  }

  async expectObjectToMatch<T extends Record<string, unknown>>(expected: T) {
    const snapshot = await this.executeInBrowser((object) => object);
    expect(snapshot).toMatchObject(expected);
  }
}
