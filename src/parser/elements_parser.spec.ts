import { loadSVGFromString } from '../../fabric';
import { Group } from '../shapes/Group';
import { describe, it, expect } from 'vitest';

function makeSVG(defs: string, body: string, size = 100) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>${defs}</defs>
  ${body}
</svg>`;
}

const CIRCLE_CLIP =
  '<clipPath id="c"><circle cx="50" cy="50" r="40"/></clipPath>';

describe('ElementsParser', () => {
  describe('clipPath handling', () => {
    // Regression test for https://github.com/fabricjs/fabric.js/issues/10659
    it('should not infinite-loop when the same clipPath is used at two nesting levels', async () => {
      const svg = makeSVG(
        '<clipPath id="c"><circle cx="0" cy="0" r="50"/></clipPath>',
        `<g clip-path="url(#c)">
          <g clip-path="url(#c)">
            <rect width="50" height="50" fill="red"/>
          </g>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(typeof objects[0]!.clipPath).not.toBe('string');
    });

    it('should not infinite-loop with triple-nested same clipPath', async () => {
      const svg = makeSVG(
        CIRCLE_CLIP,
        `<g clip-path="url(#c)">
          <g clip-path="url(#c)">
            <g clip-path="url(#c)">
              <rect width="80" height="80" fill="blue"/>
            </g>
          </g>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(typeof objects[0]!.clipPath).not.toBe('string');
    });

    it('should resolve different clipPaths at different nesting levels independently', async () => {
      const svg = makeSVG(
        `<clipPath id="outer"><circle cx="50" cy="50" r="40"/></clipPath>
         <clipPath id="inner"><rect x="10" y="10" width="80" height="80"/></clipPath>`,
        `<g clip-path="url(#outer)">
          <g clip-path="url(#inner)">
            <rect width="60" height="60" fill="green"/>
          </g>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(typeof objects[0]!.clipPath).not.toBe('string');
    });

    it('should resolve a multi-shape clipPath as a Group', async () => {
      const svg = makeSVG(
        `<clipPath id="multi">
          <circle cx="50" cy="50" r="40"/>
          <rect x="100" y="0" width="50" height="50"/>
        </clipPath>`,
        `<g clip-path="url(#multi)">
          <g clip-path="url(#multi)">
            <rect width="200" height="200" fill="purple"/>
          </g>
        </g>`,
        200,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(objects[0]!.clipPath).toBeInstanceOf(Group);
    });

    it('should delete clipPath property when it references a non-existent id', async () => {
      const svg = makeSVG(
        '',
        `<g clip-path="url(#nonExistent)">
          <rect width="50" height="50" fill="orange"/>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeUndefined();
    });

    it('should resolve clipPath applied directly on an element (not a group)', async () => {
      const svg = makeSVG(
        CIRCLE_CLIP,
        '<rect clip-path="url(#c)" width="100" height="100" fill="yellow"/>',
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(typeof objects[0]!.clipPath).not.toBe('string');
    });

    it('should handle same clipPath on a group and on direct child elements', async () => {
      const svg = makeSVG(
        CIRCLE_CLIP,
        `<g clip-path="url(#c)">
          <rect clip-path="url(#c)" width="100" height="100" fill="red"/>
          <circle clip-path="url(#c)" cx="50" cy="50" r="30" fill="blue"/>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      for (const obj of objects) {
        expect(obj!.clipPath).toBeDefined();
        expect(typeof obj!.clipPath).not.toBe('string');
      }
    });

    it('should resolve clipPath when transforms are present on groups', async () => {
      const svg = makeSVG(
        CIRCLE_CLIP,
        `<g clip-path="url(#c)" transform="scale(0.8)">
          <g clip-path="url(#c)" transform="translate(10,10)">
            <rect width="100" height="100" fill="red"/>
          </g>
        </g>`,
      );
      const { objects } = await loadSVGFromString(svg);
      expect(objects).toHaveLength(1);
      expect(objects[0]!.clipPath).toBeDefined();
      expect(typeof objects[0]!.clipPath).not.toBe('string');
    });
  });
});
