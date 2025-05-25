import type { JSHandle, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { FabricObject } from 'fabric';
import type { PageFunctionOn } from 'playwright-core/types/structs';

export class ObjectUtil<T extends FabricObject = FabricObject> {
  constructor(
    readonly page: Page,
    /**
     * the key matching the a key returned from the {@link beforeAll} or {@link before} callback
     */
    readonly objectId: string,
  ) {}

  evaluateSelf() {
    return this.page.evaluateHandle(
      (objectId) => objectMap.get(objectId),
      this.objectId,
    );
  }

  async executeInBrowser<C, R>(
    runInBrowser: PageFunctionOn<T, C, R>,
    context: C,
  ): Promise<R> {
    return (await this.evaluateSelf()).evaluate(runInBrowser, context);
  }

  async evaluateHandle<C, R>(
    runInBrowser: PageFunctionOn<T, C | undefined, R>,
    context?: C,
  ): Promise<JSHandle<R>> {
    return (await this.evaluateSelf()).evaluateHandle(runInBrowser, context);
  }

  getObjectCenter() {
    return this.executeInBrowser((object) => object.getCenterPoint(), null);
  }

  getObjectCoords() {
    return this.executeInBrowser((object) => object.getCoords(), null);
  }

  getObjectControlPoint(controlName: string) {
    return this.executeInBrowser(
      (object, { controlName }) => object.oCoords[controlName],
      { controlName },
    );
  }

  async expectObjectToMatch<S extends T>(expected: Partial<S>) {
    const snapshot = await this.executeInBrowser((object) => object, null);
    expect(snapshot).toMatchObject(expected);
  }
}
