import { Point, BaseFabricObject, FabricImage, Group } from 'fabric';

/**
 * Updates the fromObject function of a class to return a version that can restore old data
 * with values of originX and originY that are different from 'center', 'center'
 * Used to upgrade from fabric 6 to fabric 7
 * @param originalFn the original fromObject function of an object,
 * @param defaultOriginX optional default value for non exported originX,
 * @param defaultOriginY optional default value for non exported originY,
 * @returns a wrapped fromObject function for the object
 */
const originUpdaterWrapper = function (originalFn) {
  let defaultOriginX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';
  let defaultOriginY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'top';
  return async function (serializedObject) {
    // we default to left and top because those are defaults before deprecation
    const {
      originX = defaultOriginX,
      originY = defaultOriginY
    } = serializedObject;
    // and we do not want to pass those properties on the object anymore
    delete serializedObject.originX;
    delete serializedObject.originY;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    const originalObject = await originalFn.call(this, serializedObject, ...args);
    const actualPosition = new Point(originalObject.left, originalObject.top);
    originalObject.setPositionByOrigin(actualPosition, originX, originY);
    return originalObject;
  };
};

/**
 * Wraps and override the current fabricJS fromObject static functions
 * Used to upgrade from fabric 6 to fabric 7
 * @param defaultOriginX optional default value for non exported originX,
 * @param defaultOriginY optional default value for non exported originY,
 * @returns a wrapped fromObject function for the object
 */
const installOriginWrapperUpdater = (originX, originY) => {
  // @ts-expect-error the _fromObject parameter could be instantiated differently
  BaseFabricObject._fromObject = originUpdaterWrapper(BaseFabricObject._fromObject, originX, originY);
  // FabricImage and Group do not use _fromObject
  FabricImage.fromObject = originUpdaterWrapper(FabricImage.fromObject, originX, originY);
  Group.fromObject = originUpdaterWrapper(Group.fromObject, originX, originY);
};

export { installOriginWrapperUpdater, originUpdaterWrapper };
//# sourceMappingURL=index.mjs.map
