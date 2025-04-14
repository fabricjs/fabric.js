import { describe, expect, it } from 'vitest';
import { Group, loadSVGFromString, Polygon } from '../../../fabric';
import { groupSVGElements } from './groupSVGElements';

const SVG_WITH_1_ELEMENT =
  '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

const SVG_WITH_2_ELEMENTS =
  '<?xml version="1.0"?>\
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
      <polygon fill="red" stroke="blue" stroke-width="10" points="350, 75 379,161 469,161\
        397,215 423,301 350,250 277,301 303,215 231,161 321,161" />\
    </svg>';

describe('groupSVGElements', () => {
  describe('groupSVGElements', () => {
    it('returns the element when only one SVG element is provided', async () => {
      const { objects, options } = await loadSVGFromString(SVG_WITH_1_ELEMENT);
      // @ts-expect-error -- TODO: objects can also be array of nulls?
      const group1 = groupSVGElements(objects, options);

      expect(group1 instanceof Polygon).toBeTruthy();
    });

    it('returns a Group when multiple SVG elements are provided', async () => {
      const { objects, options } = await loadSVGFromString(SVG_WITH_2_ELEMENTS);
      // @ts-expect-error -- TODO: objects can also be array of nulls?
      const group2 = groupSVGElements(objects, options);

      expect(group2).toBeInstanceOf(Group);
    });
  });
});
