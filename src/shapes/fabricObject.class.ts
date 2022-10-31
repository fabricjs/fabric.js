import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';

// TODO somehow we have to make a tree-shakeable import

export { InteractiveFabricObject as FabricObject };

(function (global) {
  const fabric = global.fabric;
  fabric.Object = InteractiveFabricObject;
  // eslint-disable-next-line no-restricted-globals
})(typeof exports !== 'undefined' ? exports : window);
