import { sendObjectToPlane } from './planeChange.mjs';
import { Group } from '../../shapes/Group.mjs';

/**
 * Merges 2 clip paths into one visually equal clip path
 *
 * **IMPORTANT**:\
 * Does **NOT** clone the arguments, clone them proir if necessary.
 *
 * Creates a wrapper (group) that contains one clip path and is clipped by the other so content is kept where both overlap.
 * Use this method if both the clip paths may have nested clip paths of their own, so assigning one to the other's clip path property is not possible.
 *
 * In order to handle the `inverted` property we follow logic described in the following cases:\
 * **(1)** both clip paths are inverted - the clip paths pass the inverted prop to the wrapper and loose it themselves.\
 * **(2)** one is inverted and the other isn't - the wrapper shouldn't become inverted and the inverted clip path must clip the non inverted one to produce an identical visual effect.\
 * **(3)** both clip paths are not inverted - wrapper and clip paths remain unchanged.
 *
 * @memberOf fabric.util
 * @param {fabric.Object} c1
 * @param {fabric.Object} c2
 * @returns {fabric.Object} merged clip path
 */
const mergeClipPaths = (c1, c2) => {
  var _b$group;
  let a = c1,
    b = c2;
  if (a.inverted && !b.inverted) {
    //  case (2)
    a = c2;
    b = c1;
  }
  //  `b` becomes `a`'s clip path so we transform `b` to `a` coordinate plane
  sendObjectToPlane(b, (_b$group = b.group) === null || _b$group === void 0 ? void 0 : _b$group.calcTransformMatrix(), a.calcTransformMatrix());
  //  assign the `inverted` prop to the wrapping group
  const inverted = a.inverted && b.inverted;
  if (inverted) {
    //  case (1)
    a.inverted = b.inverted = false;
  }
  return new Group([a], {
    clipPath: b,
    inverted
  });
};

export { mergeClipPaths };
//# sourceMappingURL=mergeClipPaths.mjs.map
