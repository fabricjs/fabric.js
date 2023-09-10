import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { Object as FabricObject } from 'fabric';
import type { before, beforeAll } from 'test';

export class ObjectUtil<T = FabricObject> {
  constructor(
    readonly page: Page,
    /**
     * the key matching the a key returned from the {@link beforeAll} or {@link before} callback
     */
    readonly objectId: string
  ) {}

  async executeInBrowser<C, R>(
    runInBrowser: (object: T, context: C) => R,
    context?: C
  ): Promise<R> {
    return (
      await this.page.evaluateHandle<FabricObject>(
        ([objectId]) => objectMap.get(objectId),
        [this.objectId]
      )
    ).evaluate(runInBrowser, context);
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
