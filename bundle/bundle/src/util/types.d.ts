import type { ActiveSelection } from '../shapes/active_selection.class';
import type { Group } from '../shapes/group.class';
import type { FabricObject, TCachedFabricObject } from '../shapes/Object/Object';
import type { FabricObjectWithDragSupport } from '../shapes/Object/InteractiveObject';
import type { TFiller } from '../typedefs';
import type { Text } from '../shapes/text.class';
import type { Pattern } from '../pattern.class';
import type { IText } from '../shapes/itext.class';
import type { Textbox } from '../shapes/textbox.class';
export declare const isFiller: (filler: TFiller | string) => filler is TFiller;
export declare const isPattern: (filler: TFiller) => filler is Pattern;
export declare const isCollection: (fabricObject?: FabricObject) => fabricObject is Group | ActiveSelection;
export declare const isActiveSelection: (fabricObject?: FabricObject) => fabricObject is ActiveSelection;
export declare const isTextObject: (fabricObject?: FabricObject) => fabricObject is Text<import("../EventTypeDefs").ObjectEvents>;
export declare const isInteractiveTextObject: (fabricObject?: FabricObject) => fabricObject is IText | Textbox;
export declare const isFabricObjectCached: (fabricObject: FabricObject) => fabricObject is TCachedFabricObject;
export declare const isFabricObjectWithDragSupport: (fabricObject?: FabricObject) => fabricObject is FabricObjectWithDragSupport;
//# sourceMappingURL=types.d.ts.map