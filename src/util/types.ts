import type { ActiveSelection } from '../shapes/ActiveSelection';
import type { Group } from '../shapes/Group';
import type {
  FabricObject,
  TCachedFabricObject,
} from '../shapes/Object/Object';
import type { FabricObjectWithDragSupport } from '../shapes/Object/InteractiveObject';
import type { TFiller } from '../typedefs';
import type { Text } from '../shapes/Text/Text';
import type { Pattern } from '../Pattern';
import type { IText } from '../shapes/IText/IText';
import type { Textbox } from '../shapes/Textbox';

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

export const isCollection = (
  fabricObject?: FabricObject
): fabricObject is Group | ActiveSelection => {
  return !!fabricObject && Array.isArray((fabricObject as Group)._objects);
};

export const isActiveSelection = (
  fabricObject?: FabricObject
): fabricObject is ActiveSelection => {
  return !!fabricObject && fabricObject.type === 'activeSelection';
};

export const isTextObject = (
  fabricObject?: FabricObject
): fabricObject is Text => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && fabricObject.type.includes('text');
};

export const isInteractiveTextObject = (
  fabricObject?: FabricObject
): fabricObject is IText | Textbox => {
  // we could use instanceof but that would mean pulling in Text code for a simple check
  // @todo discuss what to do and how to do
  return !!fabricObject && ['i-text', 'textbox'].includes(fabricObject.type);
};

export const isFabricObjectCached = (
  fabricObject: FabricObject
): fabricObject is TCachedFabricObject => {
  return fabricObject.shouldCache() && !!fabricObject._cacheCanvas;
};

export const isFabricObjectWithDragSupport = (
  fabricObject?: FabricObject
): fabricObject is FabricObjectWithDragSupport => {
  return (
    !!fabricObject &&
    typeof (fabricObject as FabricObjectWithDragSupport).onDragStart ===
      'function' &&
    typeof (fabricObject as FabricObjectWithDragSupport).shouldStartDragging ===
      'function'
  );
};
