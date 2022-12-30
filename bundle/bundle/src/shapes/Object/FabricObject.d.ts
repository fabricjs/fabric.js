import { ObjectEvents } from '../../EventTypeDefs';
import { FabricObjectSVGExportMixin } from '../../mixins/object.svg_export';
import { InteractiveFabricObject } from './InteractiveObject';
export interface FabricObject<EventSpec extends ObjectEvents = ObjectEvents> extends FabricObjectSVGExportMixin {
}
export declare class FabricObject<EventSpec extends ObjectEvents = ObjectEvents> extends InteractiveFabricObject<EventSpec> {
}
export { fabricObjectDefaultValues } from './Object';
//# sourceMappingURL=FabricObject.d.ts.map