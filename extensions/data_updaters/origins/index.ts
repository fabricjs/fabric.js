import {
  Point,
  FabricImage,
  Group,
  BaseFabricObject,
  type FabricObject,
} from 'fabric';

/**
 * Updates the fromObject function of a class to return a version that can restore old data
 * with values of originX and originY that are different from 'center', 'center'
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @returns a wrapped fromObject function for the object
 */
export const originUpdaterWrapper =
  <T extends FabricObject = FabricObject>(
    originalFn: (...args: any[]) => Promise<T>,
  ): ((...args: any[]) => Promise<T>) =>
  async (serializedObject, ...args) => {
    // we default to left and top because those are defaults before deprecation
    const { originX = 'left', originY = 'top' } = serializedObject;
    // and we do not want to pass those properties on the object anymore
    delete serializedObject.originX;
    delete serializedObject.originY;
    const originalObject = await originalFn(serializedObject, ...args);
    const actualPosition = new Point(originalObject.left, originalObject.top);
    originalObject.setPositionByOrigin(actualPosition, originX, originY);
    return originalObject;
  };

export const installOriginWrapperUpdater = () => {
  // @ts-expect-error the _fromObject parameter could be instantiated differently
  BaseFabricObject._fromObject = originUpdaterWrapper<FabricObject>(
    BaseFabricObject._fromObject,
  );
  // FabricImage and Group do not use _fromObject
  FabricImage.fromObject = originUpdaterWrapper<FabricImage>(
    FabricImage.fromObject,
  );
  Group.fromObject = originUpdaterWrapper<Group>(Group.fromObject);
};
