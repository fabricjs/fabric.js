import { fabric } from '../../HEADER';
import { ObjectEvents } from '../EventTypeDefs';
import { FabricObjectSVGExportMixin } from '../mixins/object.svg_export';
import { InteractiveFabricObject } from '../mixins/object_interactivity.mixin';
import { applyMixins } from '../util/applyMixins';

// TODO somehow we have to make a tree-shakeable import

export class FabricObject extends applyMixins(InteractiveFabricObject, [
  FabricObjectSVGExportMixin,
]) {}

// @ts-expect-error type conflict of generic EventSpec
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends InteractiveFabricObject<EventSpec>,
    FabricObjectSVGExportMixin {}

export { fabricObjectDefaultValues } from './object.class';

fabric.Object = FabricObject;
