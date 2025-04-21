/**
 * Runs from both the browser and node
 */

import { selectedTextWithClipPath } from './testcases/textWithClipPath';
import { renderTestType } from '../../types';
import { zSvgExport } from './testcases/z-svg-export';

const emptyTest: renderTestType = {
  size: [450, 220],
  percentage: 0.05,
  title: '',
  golden: '*.png',
  renderFunction: async function render(canvas, fabric) {
    // put render code here
  },
};

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
    percentage: 0.09,
    size: [150, 60],
    title: 'Rect with strokeUniform true',
    golden: 'generic1.png',
    renderFunction: async function render(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 20,
        height: 40,
        strokeWidth: 2,
        scaleX: 6,
        scaleY: 0.5,
        strokeUniform: true,
        fill: '',
        stroke: 'red',
      });
      const rect2 = new fabric.Rect({
        width: 60,
        height: 60,
        top: 4,
        left: 4,
        strokeWidth: 2,
        scaleX: 2,
        scaleY: 0.5,
        strokeUniform: false,
        fill: '',
        stroke: 'blue',
      });
      canvas.add(rect);
      canvas.add(rect2);
    },
  },
  {
    size: [100, 100],
    percentage: 0.011,
    golden: 'strokeNegativeScale.png',
    title: 'Rect with strokeUniform: true and negative scaling',
    disabled: 'node',
    renderFunction: async function render(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 10,
        height: 10,
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 15,
        strokeUniform: true,
        strokeDashArray: [2, 2],
        top: 65,
        left: 30,
      });
      // do not do this at init time or they will be positive
      rect.scaleX = -2;
      rect.scaleY = -4;

      const rect2 = new fabric.Rect({
        width: 10,
        height: 10,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 15,
        scaleX: -2,
        scaleY: -4,
        strokeDashArray: [2, 2],
        strokeUniform: true,
        top: 10,
        left: 55,
      });
      canvas.add(rect, rect2);
    },
  },
  {
    size: [150, 60],
    percentage: 0.09,
    title: 'Rect DropShadow with nonScaling: true',
    golden: 'shadownonscaling.png',
    renderFunction: async function render(canvas, fabric) {
      const obj = new fabric.Rect();
      obj.set({
        width: 10,
        height: 10,
        scaleX: 12,
        scaleY: 3,
        top: 10,
        left: 5,
        fill: '#f55',
      });
      obj.set(
        'shadow',
        new fabric.Shadow({
          color: 'rgba(0,100,0,0.9)',
          blur: 5,
          offsetX: 8,
          offsetY: 8,
          nonScaling: true,
        }),
      );
      canvas.add(obj);
    },
  },
  {
    size: [210, 210],
    percentage: 0.09,
    golden: 'polygonWithStroke.png',
    title: 'polygon position independently from strokeWidth and origin',
    renderFunction: async function render(canvas, fabric) {
      canvas.set({ backgroundColor: '#AAAA77' });
      const p1 = new fabric.Polygon(
        [
          { x: 0, y: 216 },
          { x: 125, y: 433 },
          { x: 375, y: 433 },
          { x: 500, y: 216 },
          { x: 375, y: 0 },
          { x: 125, y: 0 },
        ],
        {
          fill: 'white',
        },
      );
      canvas.add(p1);
      const p2 = new fabric.Polygon(
        [
          { x: 0, y: 216 },
          { x: 125, y: 433 },
          { x: 375, y: 433 },
          { x: 500, y: 216 },
          { x: 375, y: 0 },
          { x: 125, y: 0 },
        ],
        {
          fill: 'transparent',
          stroke: '#00AAFFAA',
          strokeWidth: 15,
          originX: 'center',
          originY: 'center',
        },
      );
      canvas.add(p2);
      canvas.setZoom(0.4);
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
      const ctx = imgSource.getContext('2d');
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
];

// function polygonWithStroke(canvas, callback) {
//
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'polygon position independently from strokeWidth and origin',
//   code: polygonWithStroke,
//   golden: 'polygonWithStroke.png',
//   percentage: 0.09,
//   width: 210,
//   height: 210,
// });

// function backgroundWithGradient(canvas, callback) {
//   var g = new fabric.Gradient({
//     type: 'linear',
//     gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
//     coords: {
//       x1: 0,
//       y1: 0,
//       x2: 200,
//       y2: 0,
//     },
//     colorStops: [
//       {
//         offset: 0,
//         color: 'green',
//       },
//       {
//         offset: 0.5,
//         color: 'white',
//       },
//       {
//         offset: 1,
//         color: 'blue',
//       },
//     ],
//   });
//   canvas.set({ backgroundColor: g });
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'canvas can have a gradient background',
//   code: backgroundWithGradient,
//   golden: 'backgroundWithGradient.png',
//   percentage: 0.09,
//   width: 300,
//   height: 300,
// });

// function backgroundWithGradientZoom(canvas, callback) {
//   canvas.setZoom(0.1);
//   var g = new fabric.Gradient({
//     type: 'linear',
//     gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
//     coords: {
//       x1: 0,
//       y1: 0,
//       x2: 300,
//       y2: 0,
//     },
//     colorStops: [
//       {
//         offset: 0,
//         color: 'green',
//       },
//       {
//         offset: 0.5,
//         color: 'white',
//       },
//       {
//         offset: 1,
//         color: 'blue',
//       },
//     ],
//   });
//   canvas.set({ backgroundColor: g });
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'canvas can have a gradient background and being zoomed',
//   code: backgroundWithGradientZoom,
//   golden: 'backgroundWithGradientZoom.png',
//   percentage: 0.09,
//   width: 300,
//   height: 300,
// });

// function backgroundWithGradientNoVpt(canvas, callback) {
//   canvas.setZoom(0.1);
//   canvas.backgroundVpt = false;
//   var g = new fabric.Gradient({
//     type: 'linear',
//     gradientTransform: [0.4, -0.4, 0.2, 0.1, 3, 5],
//     coords: {
//       x1: 0,
//       y1: 0,
//       x2: 200,
//       y2: 0,
//     },
//     colorStops: [
//       {
//         offset: 0,
//         color: 'green',
//       },
//       {
//         offset: 0.5,
//         color: 'white',
//       },
//       {
//         offset: 1,
//         color: 'blue',
//       },
//     ],
//   });
//   canvas.set({ backgroundColor: g });
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'canvas can have a gradient background with zoom but being unaffected',
//   code: backgroundWithGradientNoVpt,
//   golden: 'backgroundWithGradient.png',
//   percentage: 0.09,
//   width: 300,
//   height: 300,
// });

// function objectsInActiveSelections(canvas, callback) {
//   canvas.setZoom(0.1);
//   var rect1 = new fabric.Rect({
//     fill: 'purple',
//     top: 30,
//     left: 50,
//     width: 30,
//     height: 100,
//     angle: 10,
//   });
//   var rect2 = new fabric.Rect({
//     fill: 'green',
//     top: 150,
//     left: 10,
//     width: 300,
//     height: 30,
//     angle: -10,
//   });
//   new fabric.ActiveSelection([rect1, rect2]);
//   var output = rect1.toCanvasElement();
//   callback(output);
// }

// tests.push({
//   test: 'objects in activeSelection toCanvasElement',
//   code: objectsInActiveSelections,
//   golden: 'objectsInActiveSelections.png',
//   percentage: 0.09,
//   width: 300,
//   height: 300,
// });

// function canvasPattern(fabricCanvas, callback) {
//   getFixture('diet.jpeg', false, function (img) {
//     var pattern = new fabric.Pattern({
//       source: img,
//       repeat: 'repeat',
//       offsetX: -120,
//       offsetY: 50,
//     });
//     fabricCanvas.backgroundColor = pattern;
//     var canvas = fabricCanvas.toCanvasElement();
//     callback(canvas);
//   });
// }

// function bgOverlayVpt(canvas, callback) {
//   var rectbg = new fabric.Rect({
//     width: 300,
//     height: 300,
//     top: 0,
//     left: 0,
//     fill: 'rgba(255,0,0,0.5)',
//     canvas,
//   });
//   var rectoverlay = new fabric.Rect({
//     width: 300,
//     height: 300,
//     top: 0,
//     left: 0,
//     fill: 'rgba(0,0,255,0.5)',
//     canvas,
//   });
//   canvas.overlayVpt = false;
//   canvas.backgroundVpt = false;
//   canvas.backgroundImage = rectbg;
//   canvas.overlayImage = rectoverlay;
//   canvas.setViewportTransform([0.1, 0, 0, 0.1, 7000, 7000]);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'bg-overlay and vpts',
//   code: bgOverlayVpt,
//   golden: 'bgOverlayVpt.png',
//   percentage: 0.04,
//   width: 300,
//   height: 300,
// });

// function bgOverlayRespectingVpt(canvas, callback) {
//   var rectbg = new fabric.Rect({
//     width: 300,
//     height: 300,
//     top: 0,
//     left: 0,
//     fill: 'rgba(255,0,0,0.5)',
//     canvas,
//   });
//   var rectoverlay = new fabric.Rect({
//     width: 300,
//     height: 300,
//     top: 0,
//     left: 0,
//     fill: 'rgba(0,0,255,0.5)',
//     canvas,
//   });
//   canvas.overlayVpt = true;
//   canvas.backgroundVpt = true;
//   canvas.backgroundImage = rectbg;
//   canvas.overlayImage = rectoverlay;
//   canvas.setViewportTransform([0.9, 0, 0, 0.9, 150, 150]);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'bg-overlay and vpts applied',
//   code: bgOverlayRespectingVpt,
//   golden: 'bgOverlayRespectVpt.png',
//   percentage: 0.04,
//   width: 300,
//   height: 300,
// });

// tests.push({
//   test: 'canvas with background pattern and export',
//   code: canvasPattern,
//   // use the same golden on purpose
//   golden: 'canvasPattern.png',
//   percentage: 0.09,
//   width: 500,
//   height: 500,
// });

// function canvasPatternMultiplier(fabricCanvas, callback) {
//   getFixture('diet.jpeg', false, function (img2) {
//     var pattern = new fabric.Pattern({
//       source: img2,
//       repeat: 'repeat',
//       offsetX: -120,
//       offsetY: 50,
//     });
//     fabricCanvas.backgroundColor = pattern;
//     var canvas = fabricCanvas.toCanvasElement(0.3);
//     callback(canvas);
//   });
// }

// tests.push({
//   test: 'canvas with background pattern and multiplier',
//   code: canvasPatternMultiplier,
//   // use the same golden on purpose
//   golden: 'canvasPatternMultiplier.png',
//   percentage: 0.09,
//   width: 500,
//   height: 500,
// });

// function imageSmoothing(fabricCanvas, callback) {
//   getFixture('greyfloral.png', false, function (img2) {
//     var fImg = new fabric.Image(img2, {
//       imageSmoothing: false,
//       scaleX: 10,
//       scaleY: 10,
//     });
//     var fImg2 = new fabric.Image(img2, { left: 400, scaleX: 10, scaleY: 10 });
//     fabricCanvas.add(fImg);
//     fabricCanvas.add(fImg2);
//     fabricCanvas.renderAll();
//     callback(fabricCanvas.lowerCanvasEl);
//   });
// }

// tests.push({
//   test: 'fabric.Image with imageSmoothing false',
//   code: imageSmoothing,
//   // use the same golden on purpose
//   golden: 'imageSoothingOnObject.png',
//   percentage: 0.09,
//   width: 800,
//   height: 400,
// });

// function pathWithGradient(canvas, callback) {
//   var pathWithGradient = new fabric.Path(
//     'M 0 0 L 0 100 L 100 100 L 100 0 Z',
//     {
//       fill: new fabric.Gradient({
//         gradientUnits: 'percentage',
//         coords: { x1: 0, y1: 0, x2: 0, y2: 1 },
//         colorStops: [
//           { offset: 0, color: 'red' },
//           { offset: 1, color: 'black' },
//         ],
//       }),
//       height: 100,
//       width: 100,
//       top: 0,
//       left: 0,
//     }
//   );
//   canvas.add(pathWithGradient);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'gradient should be applied to path',
//   code: pathWithGradient,
//   golden: 'pathWithGradient.png',
//   percentage: 0.06,
//   width: 100,
//   height: 100,
// });

// function gradientStroke(canvas, callback) {
//   var line = new fabric.Line([10, 10, 200, 200], {
//     stroke: new fabric.Gradient({
//       type: 'linear',
//       coords: {
//         x1: 20,
//         y1: 0,
//         x2: 80,
//         y2: 0,
//       },
//       colorStops: [
//         {
//           offset: 0,
//           color: 'green',
//         },
//         {
//           offset: 0.4,
//           color: 'cyan',
//         },
//         {
//           offset: 1,
//           color: 'red',
//         },
//       ],
//       gradientTransform: [1, 0, 0, 1, 50, 0],
//     }),
//     strokeWidth: 20,
//   });
//   canvas.add(line);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'Use the gradient strokeStyle for line(other shape is ok)',
//   code: gradientStroke,
//   golden: 'gradientStroke.png',
//   newModule: 'Gradient stroke',
//   // loose diff because firefox
//   percentage: 0.04,
//   width: 300,
//   height: 300,
// });

// function textGradientFill(canvas, callback) {
//   var text = new fabric.Text('Some Text', {
//     fontSize: 40,
//     left: 25,
//     top: -25,
//     fontWeight: 'bold',
//     fill: new fabric.Gradient({
//       type: 'radial',
//       coords: {
//         x1: 0,
//         y1: 0,
//         r1: 100,
//         x2: 0,
//         y2: 0,
//         r2: 50,
//       },
//       colorStops: [
//         {
//           offset: 0,
//           color: 'white',
//         },
//         {
//           offset: 0.5,
//           color: 'indianred',
//         },
//         {
//           offset: 1,
//           color: 'green',
//         },
//       ],
//       gradientTransform: [1, 0, 0, 1, 50, 50],
//     }),
//   });
//   canvas.add(text);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'Use the gradient fillStyle for text',
//   code: textGradientFill,
//   golden: 'textGradientFill.png',
//   newModule: 'Text gradient fill',
//   percentage: 0.04,
//   width: 300,
//   height: 100,
// });

// function polygonAndPaths(canvas, callback) {
//   canvas.backgroundColor = 'yellow';
//   for (let i = 0; i < 30; i++) {
//     var line = new fabric.Line([i, 0, i, 30], {
//       strokeWidth: 0.2,
//       stroke: 'lightgrey',
//       objectCaching: false,
//     });
//     var line2 = new fabric.Line([0, i, 30, i], {
//       strokeWidth: 0.2,
//       stroke: 'lightgrey',
//       objectCaching: false,
//     });
//     canvas.add(line);
//     canvas.add(line2);
//   }
//   const points = [
//     {
//       x: 2,
//       y: 2,
//     },
//     {
//       x: 10,
//       y: 2,
//     },
//     {
//       x: 9,
//       y: 10,
//     },
//     {
//       x: 4,
//       y: 10,
//     },
//   ];
//   var polygon = new fabric.Polygon(points, {
//     strokeWidth: 2,
//     opacity: 0.5,
//     stroke: 'pink',
//     originX: 'right',
//     originY: 'top',
//     fill: '',
//     objectCaching: false,
//   });
//   var polygon2 = new fabric.Polygon(points, {
//     strokeWidth: 0.2,
//     stroke: 'black',
//     originX: 'left',
//     originY: 'bottom',
//     fill: '',
//     objectCaching: false,
//   });
//   var path = 'M 15 2 H 25 L 28 14 25 16 H 17 Z';
//   var path1 = new fabric.Path(path, {
//     strokeWidth: 2,
//     opacity: 0.5,
//     stroke: 'blue',
//     originX: 'right',
//     originY: 'top',
//     fill: '',
//     objectCaching: false,
//   });
//   var path2 = new fabric.Path(path, {
//     strokeWidth: 0.2,
//     stroke: 'black',
//     originX: 'left',
//     originY: 'bottom',
//     fill: '',
//     objectCaching: false,
//   });
//   var line1 = new fabric.Line([6, 22, 24, 22], {
//     strokeWidth: 2,
//     stroke: 'green',
//     originX: 'right',
//     originY: 'top',
//     opacity: 0.5,
//     objectCaching: false,
//   });
//   var line2 = new fabric.Line([6, 22, 24, 22], {
//     strokeWidth: 0.2,
//     stroke: 'black',
//     objectCaching: false,
//     originX: 'left',
//     originY: 'bottom',
//   });

//   var line3 = new fabric.Line([6, 26, 24, 26], {
//     strokeWidth: 2,
//     stroke: 'blue',
//     originX: 'right',
//     originY: 'top',
//     opacity: 0.5,
//     strokeLineCap: 'round',
//   });

//   var line4 = new fabric.Line([6, 26, 24, 26], {
//     strokeWidth: 0.2,
//     stroke: 'black',
//     objectCaching: false,
//     originX: 'left',
//     originY: 'bottom',
//   });

//   canvas.setZoom(10);
//   canvas.add(polygon, polygon2, path1, path2, line1, line2, line3, line4);
//   canvas.renderAll();
//   callback(canvas.lowerCanvasEl);
// }

// tests.push({
//   test: 'polygon and paths',
//   code: polygonAndPaths,
//   golden: 'polygonAndPaths.png',
//   newModule: 'Polygon and paths positioning',
//   percentage: 0.04,
//   width: 300,
//   height: 300,
// });
