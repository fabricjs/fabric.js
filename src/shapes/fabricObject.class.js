import { FabricObjectAncestryMixin } from '../mixins/object_ancestry.mixin';
import { FabricObjectObjectStackingMixin } from '../mixins/object_stacking.mixin';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { applyMixins } from '../util/applyMixins';

// TODO somehow we have to make a tree-shakeable import

applyMixins(InteractiveFabricObject, [
  FabricObjectAncestryMixin,
  FabricObjectObjectStackingMixin,
]);

export { InteractiveFabricObject as FabricObject };

(function (global) {
  const fabric = global.fabric;
  fabric.Object = InteractiveFabricObject;
})(typeof exports !== 'undefined' ? exports : window);
