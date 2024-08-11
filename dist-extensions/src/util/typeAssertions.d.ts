import type { FabricObject } from '../shapes/Object/Object';
import type { TFiller } from '../typedefs';
import type { FabricText } from '../shapes/Text/Text';
import type { Pattern } from '../Pattern';
import type { Path } from '../shapes/Path';
import type { ActiveSelection } from '../shapes/ActiveSelection';
export declare const isFiller: (filler: TFiller | string | null) => filler is TFiller;
export declare const isSerializableFiller: (filler: TFiller | string | null) => filler is TFiller;
export declare const isPattern: (filler: TFiller) => filler is Pattern;
export declare const isTextObject: (fabricObject?: FabricObject) => fabricObject is FabricText;
export declare const isPath: (fabricObject?: FabricObject) => fabricObject is Path;
export declare const isActiveSelection: (fabricObject?: FabricObject) => fabricObject is ActiveSelection;
//# sourceMappingURL=typeAssertions.d.ts.map