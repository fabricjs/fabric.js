import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { applyMixins } from '../../util/applyMixins';
import { StatefulMixin } from '../../mixins/stateful.mixin';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends FabricObjectSVGExportMixin {}

export class FabricObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends InteractiveFabricObject<EventSpec> {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin, StatefulMixin]);

export { cacheProperties, stateProperties } from './defaultValues';
