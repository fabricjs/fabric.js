import { FabricObject } from '../shapes/Object/FabricObject';

export type SVGParsingOutput = {
  results: FabricObject[];
  options: Record<string, any>;
  elements: Element[];
  allElements: Element[];
};

export type TSvgReviverCallback = (
  element: Element,
  fabricObject: FabricObject
) => void;
