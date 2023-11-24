import type { FabricObject } from '../shapes/Object/Object';
import type { TFiller } from '../typedefs';
import type { FabricText } from '../shapes/Text/Text';
import type { Pattern } from '../Pattern';
import type { Path } from '../shapes/Path';

export const isFiller = (
  filler: TFiller | string | null
): filler is TFiller => {
  return !!filler && (filler as TFiller).toLive !== undefined;
};

export const isSerializableFiller = (
  filler: TFiller | string | null
): filler is TFiller => {
  return !!filler && typeof (filler as TFiller).toObject === 'function';
};

export const isPattern = (filler: TFiller): filler is Pattern => {
  return (
    !!filler &&
    (filler as Pattern).offsetX !== undefined &&
    (filler as Pattern).source !== undefined
  );
};

export const isTextObject = (
  fabricObject?: FabricObject
): fabricObject is FabricText => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && fabricObject.isType('Text', 'IText', 'Textbox');
};

export const isPath = (fabricObject?: FabricObject): fabricObject is Path => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && fabricObject.isType('Path');
};
