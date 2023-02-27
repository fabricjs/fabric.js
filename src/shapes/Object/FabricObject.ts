import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { applyMixins } from '../../util/applyMixins';
import { FabricObjectProps } from './types/FabricObjectProps';
import { SerializedObjectProps } from './types/SerializedObjectProps';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface FabricObject<
  SProps extends SerializedObjectProps = SerializedObjectProps,
  Props extends Partial<FabricObjectProps> = Partial<FabricObjectProps>,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObjectSVGExportMixin {}

export class FabricObject<
  SProps extends SerializedObjectProps = SerializedObjectProps,
  Props extends Partial<FabricObjectProps> = Partial<FabricObjectProps>,
  EventSpec extends ObjectEvents = ObjectEvents
> extends InteractiveFabricObject<SProps, Props, EventSpec> {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin]);

export { cacheProperties } from './defaultValues';
