import type { ActiveSelection } from '../shapes/active_selection.class';
import type { Group } from '../shapes/group.class';
import type { FabricObject } from '../shapes/Object/Object';
import type { TFiller } from '../typedefs';
import type { Text } from '../shapes/text.class';
import type { Pattern } from '../pattern.class';

export const isFiller = (filler: TFiller | string): filler is TFiller => {
  return !!filler && (filler as TFiller).toLive !== undefined;
};

export const isPattern = (filler: TFiller): filler is Pattern => {
  return (
    !!filler &&
    (filler as Pattern).offsetX !== undefined &&
    (filler as Pattern).source !== undefined
  );
};

export const isCollection = (
  fabricObject: FabricObject
): fabricObject is Group | ActiveSelection => {
  return !!fabricObject && Array.isArray((fabricObject as Group)._objects);
};

export const isActiveSelection = (
  fabricObject: FabricObject
): fabricObject is ActiveSelection => {
  return !!fabricObject && fabricObject.type === 'activeSelection';
};

export const isTextObject = (
  fabricObject: FabricObject
): fabricObject is Text => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && fabricObject.type.includes('text');
};
