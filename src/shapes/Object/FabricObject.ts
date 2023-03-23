import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { applyMixins } from '../../util/applyMixins';
import { FabricObjectProps } from './types/FabricObjectProps';
import { TFabricObjectProps, SerializedObjectProps } from './types';
import { classRegistry } from '../../ClassRegistry';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface FabricObject<
  Props extends TFabricObjectProps = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends FabricObjectSVGExportMixin {}

export class FabricObject<
  Props extends TFabricObjectProps = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents
> extends InteractiveFabricObject<Props, SProps, EventSpec> {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin]);

classRegistry.setClass(FabricObject);
classRegistry.setClass(FabricObject, 'object');

export { cacheProperties } from './defaultValues';
