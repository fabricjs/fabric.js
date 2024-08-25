import { Point, type FabricObject } from 'fabric';

/**
 * Updates the fromObject function of a class to return a version that can restore old data
 * with values of originX and originY that are different from 'center', 'center'
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @returns a wrapped fromObject function for the object
 */
export const originUpdaterWrapper =
  (
    originalFn: (...args: any[]) => Promise<FabricObject>,
  ): ((...args: any[]) => Promise<FabricObject>) =>
  async (serializedObject, ...args) => {
    const { originX, originY } = serializedObject;
    const originalObject = await originalFn(serializedObject, ...args);
    const actualPosition = new Point(originalObject.left, originalObject.top);
    originalObject.setPositionByOrigin(actualPosition, originX, originY);
    return originalObject;
  };
