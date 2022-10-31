import { FabricObjectAncestryMixin } from '../mixins/object_ancestry.mixin';
import { FabricObjectObjectStackingMixin } from '../mixins/object_stacking.mixin';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { FabricObjectObjectStraighteningMixin } from '../mixins/object_straightening.mixin';
import { FabricObjectSVGExportMixin } from '../mixins/object.svg_export';
import { applyMixins } from '../util/applyMixins';
import { fabric } from '../../HEADER';
import { FabricObject } from './object.class';
import { FabricObjectObjectAnimationMixin } from '../mixins/object_animation.mixin';

// TODO somehow we have to make a tree-shakeable import

applyMixins(InteractiveFabricObject, [
  FabricObjectAncestryMixin,
  FabricObjectObjectStackingMixin,
  FabricObjectObjectStraighteningMixin,
  FabricObjectSVGExportMixin,
  FabricObjectObjectAnimationMixin,
]);

// export interface InteractiveFabricObject
//   extends FabricObjectAncestryMixin,
//     FabricObjectObjectStackingMixin,
//     FabricObjectObjectStraighteningMixin,
//     FabricObjectSVGExportMixin,FabricObjectObjectAnimationMixin {}

export { InteractiveFabricObject as FabricObject };

fabric.Object = FabricObject;
