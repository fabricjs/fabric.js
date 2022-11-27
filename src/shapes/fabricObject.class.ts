import { fabric } from '../../HEADER';
import { ObjectEvents } from '../EventTypeDefs';
import { FabricObjectSVGExportMixin } from '../mixins/object.svg_export';
import { FabricObjectObjectAnimationMixin } from '../mixins/object_animation.mixin';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { FabricObjectObjectStraighteningMixin } from '../mixins/object_straightening.mixin';
import { applyMixins } from '../util/applyMixins';

// TODO somehow we have to make a tree-shakeable import

export class FabricObject extends applyMixins(InteractiveFabricObject, [
  FabricObjectObjectStraighteningMixin,
  FabricObjectSVGExportMixin,
  FabricObjectObjectAnimationMixin,
]) {}

// @ts-expect-error applyMixins is not generic so EventSpec is different
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends InteractiveFabricObject<EventSpec>,
    FabricObjectObjectStraighteningMixin,
    FabricObjectSVGExportMixin,
    FabricObjectObjectAnimationMixin {}

export { fabricObjectDefaultValues } from './object.class';

fabric.Object = FabricObject;
