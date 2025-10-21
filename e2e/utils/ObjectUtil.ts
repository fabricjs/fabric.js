import type { JSHandle, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import type { FabricObject, TOriginX, TOriginY, XY } from 'fabric';

export class ObjectUtil<T extends FabricObject = FabricObject> {
  executeInBrowser: JSHandle<T>['evaluate'];
  evaluateHandle: JSHandle<T>['evaluateHandle'];

  constructor(
    readonly page: Page,
    /**
     * the key matching the a key returned from the {@link beforeAll} or {@link before} callback
     */
    readonly objectId: string,
  ) {
    this.executeInBrowser = this._executeInBrowserImpl.bind(this);
    this.evaluateHandle = this._evaluateHandleImpl.bind(this);
  }

  evaluateSelf() {
    return this.page.evaluateHandle(
      (objectId) => objectMap.get(objectId),
      this.objectId,
    );
  }

  private async _executeInBrowserImpl(
    runInBrowser: any,
    context?: any,
  ): Promise<any> {
    return (await this.evaluateSelf()).evaluate(runInBrowser, context);
  }

  private async _evaluateHandleImpl(
    runInBrowser: any,
    context?: any,
  ): Promise<any> {
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

  positionByLeftTop(point: XY) {
    return this.executeInBrowser(
      (object, { point }) => {
        object.positionByLeftTop(new window.fabric.Point(point));
        object.setCoords();
        object.canvas?.renderAll();
      },
      { point },
    );
  }

  setPositionByOrigin(point: XY, originX: TOriginX, originY: TOriginY) {
    return this.executeInBrowser(
      (object, { point, originX, originY }) => {
        object.setPositionByOrigin(
          new window.fabric.Point(point),
          originX,
          originY,
        );
        object.setCoords();
        object.canvas?.renderAll();
      },
      { point, originX, originY },
    );
  }

  async expectObjectToMatch<S extends T>(expected: Partial<S>) {
    const snapshot = await this.executeInBrowser((object) => object, null);
    expect(snapshot).toMatchObject(expected);
  }
}
