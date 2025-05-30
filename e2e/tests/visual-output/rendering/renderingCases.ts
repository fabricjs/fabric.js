/**
 * Runs from both the browser and node
 */

import { selectedTextWithClipPath } from './testcases/textWithClipPath';
import { renderTestType } from '../../types';
import { zSvgExport } from './testcases/z-svg-export';
import { dataURLExports } from './testcases/to-data-url';
import { textPathTests } from './testcases/text-path';
import { controlsRenderingTests } from './testcases/controls-rendering';
import { clipPathRenderingTests } from './testcases/clip-path';
import { groupLayoutTests } from './testcases/group-layout';
import { genericRenderingTests } from './testcases/generic-rendering';
import { globalCompositeOperationTests } from './testcases/global-composite-operation';
import { resizeFilterTests } from './testcases/resize-filter';
import { textRenderingTests } from './testcases/text';
import { freedrawTests } from './testcases/free-draw';
import { svgImportTests } from './testcases/svg-import';
import { colorFilteringTests } from './testcases/filtering';

export const renderTests: renderTestType[] = [
  {
    size: [450, 220],
    percentage: 0.05,
    title: 'polygon boundingbox with skew',
    golden: 'polygonbboxWithSkew.png',
    renderFunction: async function render(canvas, fabric) {
      const pts = () => [
        {
          x: 300,
          y: 200,
        },
        {
          x: 440,
          y: 340,
        },
        {
          x: 520,
          y: 220,
        },
        {
          x: 580,
          y: 400,
        },
      ];
      const polygon = new fabric.Polygon(pts(), {
        fill: 'blue',
        skewX: 10,
        strokeWidth: 2,
        stroke: 'red',
      });
      canvas.add(polygon);
      canvas.centerObject(polygon);
      canvas.setActiveObject(polygon);
    },
  },
  {
    size: [450, 220],
    percentage: 0.01,
    title: 'pixelate filter',
    golden: 'pixelate-filter.png',
    renderFunction: async function render(canvas, fabric) {
      const imgSource = fabric.getFabricDocument().createElement('canvas');
      imgSource.width = 450;
      imgSource.height = 220;
      const ctx = imgSource.getContext('2d')!;
      const gradient = ctx.createLinearGradient(0, 0, 450, 220);
      gradient.addColorStop(0, 'yellow');
      gradient.addColorStop(0.5, 'black');
      gradient.addColorStop(1, 'cyan');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, imgSource.width, imgSource.height);
      const img = new fabric.FabricImage(imgSource);
      canvas.add(img);
      img.filters[0] = new fabric.filters.Pixelate({
        blocksize: 20,
      });
      img.applyFilters();
    },
  },
  selectedTextWithClipPath,
  ...zSvgExport,
  ...dataURLExports,
  ...textPathTests,
  ...controlsRenderingTests,
  ...clipPathRenderingTests,
  ...groupLayoutTests,
  ...genericRenderingTests,
  ...globalCompositeOperationTests,
  ...resizeFilterTests,
  ...textRenderingTests,
  ...freedrawTests,
  ...svgImportTests,
  ...colorFilteringTests,
];
