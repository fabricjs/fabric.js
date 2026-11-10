import type { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from './FabricObjectSVGExportMixin';
import { InteractiveFabricObject } from './InteractiveObject';
import { applyMixins } from '../../util/applyMixins';
import type { FabricObjectProps } from './types/FabricObjectProps';
import type { TFabricObjectProps, SerializedObjectProps } from './types';
import { classRegistry } from '../../ClassRegistry';

// TODO somehow we have to make a tree-shakeable import

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface FabricObject<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Props extends TFabricObjectProps = Partial<FabricObjectProps>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  SProps extends SerializedObjectProps = SerializedObjectProps,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  EventSpec extends ObjectEvents = ObjectEvents,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
> extends FabricObjectSVGExportMixin {}

export class FabricObject<
  Props extends TFabricObjectProps = Partial<FabricObjectProps>,
  SProps extends SerializedObjectProps = SerializedObjectProps,
  EventSpec extends ObjectEvents = ObjectEvents,
> extends InteractiveFabricObject<Props, SProps, EventSpec> {}

applyMixins(FabricObject, [FabricObjectSVGExportMixin]);

classRegistry.setClass(FabricObject);
classRegistry.setClass(FabricObject, 'object');

export { cacheProperties } from './defaultValues';
