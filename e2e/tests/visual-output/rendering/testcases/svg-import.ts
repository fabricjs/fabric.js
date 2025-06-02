import type { renderTestType } from '../../../types';

/**
 * Tests for SVG import functionality
 * These tests load SVG files and compare their rendering to golden images
 */

const createTestFromSVG = (svgName: string): renderTestType => {
  if (!svgName) {
    throw new Error('SVG name is required');
  }

  return {
    title: `Svg import test ${svgName}`,
    golden: `${svgName}.png`,
    percentage: 0.055,
    snapshotSuffix: 'svg-import',
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const asset = await globalThis.getAsset(`${svgName}.svg`);
      const { objects, options } = await fabric.loadSVGFromString(asset);
      const nonNullObj = objects.filter((obj) => !!obj);
      const group = fabric.util.groupSVGElements(nonNullObj, options);
      const dims = group._getTransformedDimensions();
      canvas.setDimensions({
        width: dims.x + group.left,
        height: dims.y + group.top,
      });
      group.includeDefaultValues = false;
      canvas.includeDefaultValues = false;
      canvas.add(group);
      canvas.renderAll();

      return canvas.lowerCanvasEl.toDataURL();
    },
  };
};

const svgFiles = [
  'sharp-clip-test',
  'sharp-clip-test2',
  'svg_stroke_1',
  'svg_stroke_2',
  'svg_stroke_3',
  'svg_stroke_4',
  'svg_stroke_5',
  'svg_stroke_6',
  'svg_stroke_7',
  'svg_stroke_8',
  'svg_linear_1',
  'svg_linear_2',
  'svg_linear_3',
  'svg_linear_4',
  'svg_linear_5',
  'svg_linear_6',
  'svg_linear_7',
  'svg_linear_8',
  'svg_linear_9',
  'svg_radial_1',
  'svg_radial_2',
  'svg_radial_3',
  'svg_radial_4',
  'svg_radial_5',
  'svg_radial_6',
  'svg_radial_8',
  'svg_radial_9',
  'svg_radial_10',
  'svg_radial_11',
  'svg_radial_12',
  'svg_radial_13',
  'svg_text_letterspacing',
  'clippath-5',
  'clippath-6',
  'clippath-7',
  'clippath-9',
  'vector-effect',
  'svg-with-no-dim-rect',
  'notoemoji-person',
  'clippath-8',
  'emoji-b',
  'gold-logo',
  'svg_missing_clippath',
  'image-rendering-attr',
  'svg-missing-images',
  // this svg below here is not correct. but we do not want additional regressions
  'nested-svgs',
  'arc1',
  'arc2',
  'arc3',
  'cs',
  'qt',
  'generic-path',
  '177',
  'polygons',
  'polygons-rounded',
  'light-bulb',
  'accordion',
  'car',
  'seaClipPath',
  'use-and-style',
  'use-svg-style-2',
  'svg_text_underline_thick',
];

export const svgImportTests: renderTestType[] = svgFiles.map(createTestFromSVG);
