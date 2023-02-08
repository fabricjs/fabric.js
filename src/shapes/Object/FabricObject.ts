import { ObjectEvents } from '../../EventTypeDefs';
import { applyMixins } from '../../util/applyMixins';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { SerializedObjectProps } from './ObjectProps';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface FabricObject<
  SProps = SerializedObjectProps,
  Props = Partial<SProps>,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObjectSVGExportMixin {}

export class FabricObject<
  SProps = SerializedObjectProps,
  Props = Partial<SProps>,
  EventSpec extends ObjectEvents = ObjectEvents
> extends InteractiveFabricObject<SProps, Props, EventSpec> {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin]);

export { cacheProperties, stateProperties } from './defaultValues';
