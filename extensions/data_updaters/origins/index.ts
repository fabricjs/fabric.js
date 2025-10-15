import {
  Point,
  FabricImage,
  Group,
  BaseFabricObject,
  type FabricObject,
  type TOriginX,
  type TOriginY,
} from 'fabric';

/**
 * Updates the fromObject function of a class to return a version that can restore old data
 * with values of originX and originY that are different from 'center', 'center'
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @param defaultOriginX optional default value for non exported originX,
 * @param defaultOriginY optional default value for non exported originY,
 * @returns a wrapped fromObject function for the object
 */
export const originUpdaterWrapper = <T extends FabricObject = FabricObject>(
  originalFn: (...args: any[]) => Promise<T>,
  defaultOriginX: TOriginX = 'left',
  defaultOriginY: TOriginY = 'top',
): ((...args: any[]) => Promise<T>) =>
  async function (this: T, serializedObject, ...args) {
    // we default to left and top because those are defaults before deprecation
    const { originX = defaultOriginX, originY = defaultOriginY } =
      serializedObject;
    // and we do not want to pass those properties on the object anymore
    delete serializedObject.originX;
    delete serializedObject.originY;
    const originalObject = await originalFn.call(
      this,
      serializedObject,
      ...args,
    );
    const actualPosition = new Point(originalObject.left, originalObject.top);
    originalObject.setPositionByOrigin(actualPosition, originX, originY);
    return originalObject;
  };

/**
 * Wraps and override the current fabricJS fromObject static functions
 * Used to upgrade from fabric 7 to fabric 8
 * If you used to export with includeDefaultValues = false, you have to specify
 * which were yours default origins values
 * @param originX optional default value for non exported originX,
 * @param originY optional default value for non exported originY,
 */
export const installOriginWrapperUpdater = (
  originX?: TOriginX,
  originY?: TOriginY,
) => {
  // @ts-expect-error the _fromObject parameter could be instantiated differently
  BaseFabricObject._fromObject = originUpdaterWrapper(
    BaseFabricObject._fromObject,
    originX,
    originY,
  );
  // FabricImage and Group do not use _fromObject
  FabricImage.fromObject = originUpdaterWrapper<FabricImage>(
    FabricImage.fromObject,
    originX,
    originY,
  );
  Group.fromObject = originUpdaterWrapper<Group>(
    Group.fromObject,
    originX,
    originY,
  );
};
