import { FabricObject } from '../shapes/Object/FabricObject';

export type SVGParsingOutput = {
  objects: FabricObject[];
  options: Record<string, any>;
  elements: Element[];
  allElements: Element[];
};

export type TSvgReviverCallback = (
  element: Element,
  fabricObject: FabricObject
) => void;
