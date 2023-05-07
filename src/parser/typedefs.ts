import { FabricObject } from '../shapes/Object/FabricObject';

export type TSvgParsedCallback = (
  results: FabricObject[] | null,
  options: Record<string, any>,
  elements: SVGElement[],
  allElements: SVGElement[]
) => void;

export type TSvgReviverCallback = (
  element: SVGElement,
  fabricObject: FabricObject
) => void;
