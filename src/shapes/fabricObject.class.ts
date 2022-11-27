import { fabric } from '../../HEADER';
import { FabricObjectSVGExportMixin } from '../mixins/object.svg_export';
import { FabricObjectObjectAnimationMixin } from '../mixins/object_animation.mixin';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { FabricObjectObjectStackingMixin } from '../mixins/object_stacking.mixin';
import { FabricObjectObjectStraighteningMixin } from '../mixins/object_straightening.mixin';
import { applyMixins } from '../util/applyMixins';

// TODO somehow we have to make a tree-shakeable import

const FabricObject = applyMixins(InteractiveFabricObject, [
  FabricObjectObjectStackingMixin,
  FabricObjectObjectStraighteningMixin,
  FabricObjectSVGExportMixin,
  FabricObjectObjectAnimationMixin,
]);

export interface FabricObject
  extends InteractiveFabricObject,
    FabricObjectObjectStackingMixin,
    FabricObjectObjectStraighteningMixin,
    FabricObjectSVGExportMixin,
    FabricObjectObjectAnimationMixin {}

export { fabricObjectDefaultValues } from './object.class';
export { FabricObject };

fabric.Object = FabricObject;
