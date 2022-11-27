import { fabric } from '../../HEADER';
import { ObjectEvents } from '../EventTypeDefs';
import { FabricObjectSVGExportMixin } from '../mixins/object.svg_export';
import { FabricObjectAncestryMixin } from '../mixins/object_ancestry.mixin';
import { FabricObjectObjectAnimationMixin } from '../mixins/object_animation.mixin';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { FabricObjectObjectStackingMixin } from '../mixins/object_stacking.mixin';
import { FabricObjectObjectStraighteningMixin } from '../mixins/object_straightening.mixin';
import { applyMixins } from '../util/applyMixins';

// TODO somehow we have to make a tree-shakeable import

export class FabricObject extends applyMixins(InteractiveFabricObject, [
  FabricObjectAncestryMixin,
  FabricObjectObjectStackingMixin,
  FabricObjectObjectStraighteningMixin,
  FabricObjectSVGExportMixin,
  FabricObjectObjectAnimationMixin,
]) {}

// @ts-expect-error applyMixins is not generic so EventSpec is different
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends InteractiveFabricObject<EventSpec>,
    FabricObjectObjectStackingMixin,
    FabricObjectObjectStraighteningMixin,
    FabricObjectSVGExportMixin,
    FabricObjectObjectAnimationMixin {}

export { fabricObjectDefaultValues } from './object.class';

fabric.Object = FabricObject;
