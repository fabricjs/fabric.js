import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { applyMixins } from '../../util/applyMixins';
import { FabricObjectProps } from './ObjectProps';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends FabricObjectSVGExportMixin {}

export class FabricObject<EventSpec extends ObjectEvents = ObjectEvents>
  extends InteractiveFabricObject<EventSpec>
  implements FabricObjectProps {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin]);

export { cacheProperties, stateProperties } from './defaultValues';
