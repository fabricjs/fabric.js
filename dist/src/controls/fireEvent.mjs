import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';

const fireEvent = (eventName, options) => {
  var _target$canvas;
  const {
    transform: {
      target
    }
  } = options;
  (_target$canvas = target.canvas) === null || _target$canvas === void 0 || _target$canvas.fire("object:".concat(eventName), _objectSpread2(_objectSpread2({}, options), {}, {
    target
  }));
  target.fire(eventName, options);
};

export { fireEvent };
//# sourceMappingURL=fireEvent.mjs.map
