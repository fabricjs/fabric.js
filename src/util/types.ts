import type { ActiveSelection } from "../shapes/active_selection.class";
import type { Group } from "../shapes/group.class";
import type { FabricObject } from "../shapes/object.class";
import type { TFiller } from "../typedefs";
import type { Text } from '../shapes/text.class';

export const isFiller = (filler: TFiller | string): filler is TFiller => {
  return !!filler && (filler as TFiller).toLive !== undefined;
}

export const isCollection = (fabricObject: FabricObject): fabricObject is Group | ActiveSelection => {
  return !!fabricObject && Array.isArray((fabricObject as Group)._objects);
}

export const isTextObject = (fabricObject: FabricObject): fabricObject is Text => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && fabricObject.type.includes('text');
}
