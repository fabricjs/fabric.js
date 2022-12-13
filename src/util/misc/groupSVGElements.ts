import { FabricObject } from '../../shapes/fabricObject.class';
import { Group } from '../../shapes/group.class';

/**
 * Groups SVG elements (usually those retrieved from SVG document)
 * @static
 * @param {FabricObject[]} elements FabricObject(s) parsed from svg, to group
 * @return {FabricObject | Group}
 */
export const groupSVGElements = (elements: FabricObject[]) => {
  if (elements && elements.length === 1) {
    return elements[0];
  }
  return new Group(elements);
};
