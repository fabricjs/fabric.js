import type { FabricObject } from '../shapes/Object/Object';
import type { TFiller } from '../typedefs';
import type { FabricText } from '../shapes/Text/Text';
import type { Pattern } from '../Pattern';
import type { Path } from '../shapes/Path';
import type { ActiveSelection } from '../shapes/ActiveSelection';

export const isFiller = (
  filler: TFiller | string | null,
): filler is TFiller => {
  return !!filler && (filler as TFiller).toLive !== undefined;
};

export const isSerializableFiller = (
  filler: TFiller | string | null,
): filler is TFiller => {
  return !!filler && typeof (filler as TFiller).toObject === 'function';
};

export const isPattern = (filler: TFiller): filler is Pattern => {
  return (
    !!filler && (filler as Pattern).offsetX !== undefined && 'source' in filler
  );
};

export const isTextObject = (
  fabricObject?: FabricObject,
): fabricObject is FabricText => {
  return (
    !!fabricObject &&
    typeof (fabricObject as FabricText)._renderText === 'function'
  );
};

export const isPath = (fabricObject?: FabricObject): fabricObject is Path => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return (
    !!fabricObject &&
    typeof (fabricObject as Path)._renderPathCommands === 'function'
  );
};

export const isActiveSelection = (
  fabricObject?: FabricObject,
): fabricObject is ActiveSelection =>
  !!fabricObject && 'multiSelectionStacking' in fabricObject;
