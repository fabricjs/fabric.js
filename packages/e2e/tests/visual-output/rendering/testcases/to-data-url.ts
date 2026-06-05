import { Point } from 'fabric';
import type { renderTestType } from '../../../types';

const canvasWithObjects = String.raw`{"version":"7.0.0-beta1","objects":[{"type":"Rect","version":"7.0.0-beta1","left":400,"top":299.59,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":50,"y2":0},"colorStops":[{"offset":0,"color":"rgb(109,67,57)","opacity":1},{"offset":1,"color":"rgb(51,167,218)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":16,"scaleY":12.18,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":41.895,"top":159.555,"width":100,"height":100,"fill":"#0ec6ba","scaleX":0.57,"scaleY":0.57,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":394.435,"top":269.735,"width":50,"height":50,"fill":"#b99503","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":152.725,"top":130.875,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":0,"y2":50},"colorStops":[{"offset":0,"color":"rgb(12,101,114)","opacity":1},{"offset":1,"color":"rgb(206,164,109)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Polygon","version":"7.0.0-beta1","left":622.1049,"top":130.8695,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":0},"colorStops":[{"offset":0,"color":"rgb(151,164,232)","opacity":1},{"offset":1,"color":"rgb(68,30,248)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":0.49,"scaleY":0.49,"angle":-24.56,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Line","version":"7.0.0-beta1","left":235.56,"top":125.07,"width":150,"height":100,"stroke":"#d11594","scaleX":0.46,"scaleY":0.46,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Triangle","version":"7.0.0-beta1","left":211.865,"top":151.445,"width":50,"height":50,"fill":"#c560ff","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":539.43,"top":54.72,"width":100,"height":100,"fill":"#033516","scaleX":0.62,"scaleY":0.62,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":141.145,"top":300.595,"width":50,"height":50,"fill":"#ceada8","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":305.52,"top":150.6,"width":100,"height":100,"fill":"#439867","scaleX":0.52,"scaleY":0.52,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":211.865,"top":246.595,"width":50,"height":50,"fill":"#a84956","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Line","version":"7.0.0-beta1","left":176.105,"top":187.015,"width":150,"height":100,"stroke":"#06150b","scaleX":0.49,"scaleY":0.49,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Polygon","version":"7.0.0-beta1","left":515.7642,"top":222.2847,"width":385,"height":245,"fill":"#78ef2e","stroke":"#4ea2d7","strokeWidth":3,"scaleX":0.54,"scaleY":0.54,"angle":33.18,"opacity":0.84,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Line","version":"7.0.0-beta1","left":291.53,"top":339.05,"width":150,"height":100,"stroke":"#636d31","scaleX":0.98,"scaleY":0.98,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Triangle","version":"7.0.0-beta1","left":262.005,"top":195.165,"width":50,"height":50,"fill":"#21fdd6","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":25.87,"top":72.17,"width":100,"height":100,"fill":"#aff4ab","scaleX":0.38,"scaleY":0.38,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":467.725,"top":55.015,"width":50,"height":50,"fill":"#0004f0","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":542.225,"top":126.955,"width":100,"height":100,"fill":"#d3abcf","scaleX":0.65,"scaleY":0.65,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":138.575,"top":366.165,"width":50,"height":50,"fill":"#dd30e6","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Line","version":"7.0.0-beta1","left":440.68,"top":259.39,"width":150,"height":100,"stroke":"#6f48ec","scaleX":0.98,"scaleY":0.98,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Polygon","version":"7.0.0-beta1","left":102.51,"top":172.13,"width":385,"height":245,"fill":"#e5dc30","scaleX":0.27,"scaleY":0.27,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Line","version":"7.0.0-beta1","left":143.7142,"top":65.7891,"width":150,"height":100,"stroke":"#b99297","scaleX":0.62,"scaleY":0.62,"angle":93.47,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Triangle","version":"7.0.0-beta1","left":211.865,"top":318.595,"width":50,"height":50,"fill":"#34c5c9","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":347.625,"top":244.775,"width":100,"height":100,"fill":"#b19c03","scaleX":0.59,"scaleY":0.59,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":278.725,"top":264.595,"width":50,"height":50,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":50,"y2":0},"colorStops":[{"offset":0,"color":"rgb(166,239,249)","opacity":1},{"offset":1,"color":"rgb(179,252,126)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":85.66,"top":117.81,"width":100,"height":100,"fill":"#e622ed","scaleX":0.52,"scaleY":0.52,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":98.725,"top":227.305,"width":50,"height":50,"fill":"#27592d","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Line","version":"7.0.0-beta1","left":426.795,"top":96.265,"width":150,"height":100,"stroke":"#2aad0c","scaleX":1.29,"scaleY":1.29,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Polygon","version":"7.0.0-beta1","left":67.1107,"top":75.8956,"width":385,"height":245,"fill":"#9f018a","scaleX":0.28,"scaleY":0.28,"angle":103.34,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Polygon","version":"7.0.0-beta1","left":383.84,"top":151.8,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":0},"colorStops":[{"offset":0,"color":"rgb(191,3,90)","opacity":1},{"offset":1,"color":"rgb(89,41,35)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":0.55,"scaleY":0.55,"opacity":0.78,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Rect","version":"7.0.0-beta1","left":195.965,"top":62.905,"width":50,"height":50,"fill":"#2b14e3","scaleX":1.07,"scaleY":1.07,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":281.91,"top":72.35,"width":100,"height":100,"fill":"#d4a8de","scaleX":1.02,"scaleY":1.02,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":89.283,"top":43.0136,"width":50,"height":50,"fill":"#d9df91","scaleX":0.87,"scaleY":0.87,"angle":176.42,"opacity":0.8},{"type":"Line","version":"7.0.0-beta1","left":38.695,"top":201.245,"width":150,"height":100,"stroke":"#54d6b2","scaleX":0.39,"scaleY":0.39,"x1":-75,"x2":75,"y1":-50,"y2":50},{"type":"Polygon","version":"7.0.0-beta1","left":68.0353,"top":344.2153,"width":385,"height":245,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":385,"y2":245},"colorStops":[{"offset":0,"color":"rgb(227,86,178)","opacity":1},{"offset":1,"color":"rgb(229,227,6)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":0.39,"scaleY":0.39,"angle":142.19,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"type":"Triangle","version":"7.0.0-beta1","left":39.575,"top":241.455,"width":50,"height":50,"fill":"#8eab91","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":158.525,"top":226.045,"width":100,"height":100,"fill":"#85ddb5","scaleX":0.69,"scaleY":0.69,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":24.035,"top":34.335,"width":50,"height":50,"fill":"#794b0d","scaleX":0.63,"scaleY":0.63,"opacity":0.8},{"fontFamily":"helvetica","text":"Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam,\nquis nostrud exercitation ullamco\nlaboris nisi ut ","styles":[],"type":"Text","version":"7.0.0-beta1","left":468.8894,"top":379.8418,"width":598.125,"height":359.792,"fill":"#96062c","scaleX":0.32,"scaleY":0.32,"angle":9},{"fontFamily":"helvetica","text":"Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et dolore magna aliqua.\nUt enim ad minim veniam,\nquis nostrud exer","styles":[],"type":"Text","version":"7.0.0-beta1","left":690.1175,"top":56.3204,"width":598.125,"height":307.36,"fill":"#67586c","scaleX":0.23,"scaleY":0.23,"angle":-7},{"type":"Rect","version":"7.0.0-beta1","left":271.005,"top":388.025,"width":50,"height":50,"fill":"#f1750c","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":336.875,"top":325.965,"width":100,"height":100,"fill":"#b091e0","scaleX":0.53,"scaleY":0.53,"opacity":0.8},{"fontFamily":"helvetica","text":"Lorem ipsum dolor sit amet,\nconsectetur adipisicing elit,\nsed do eiusmod tempor incididunt\nut labore et","styles":[],"type":"Text","version":"7.0.0-beta1","left":104.5827,"top":435.3454,"width":598.125,"height":202.496,"fill":"#1a11a8","scaleX":0.28,"scaleY":0.24,"angle":8},{"type":"Triangle","version":"7.0.0-beta1","left":202.745,"top":390.595,"width":50,"height":50,"fill":"#312567","scaleX":0.63,"scaleY":1.29,"opacity":0.8},{"type":"Group","version":"7.0.0-beta1","left":610.2718,"top":237.7767,"width":151,"height":151,"scaleX":0.41,"scaleY":0.41,"angle":7,"objects":[{"type":"Path","version":"7.0.0-beta1","left":-0.175,"top":-0.055,"width":150.01,"height":150.01,"fill":"#5E0000","path":[["M",121.32,0],["L",44.58,0],["C",36.67,0,29.5,3.22,24.31,8.41],["C",19.119999999999997,13.600000000000001,15.899999999999999,20.78,15.899999999999999,28.69],["C",15.899999999999999,44.510000000000005,28.769999999999996,57.38,44.59,57.38],["C",44.59,57.38,48.99,57.38,52.07000000000001,57.38],["C",36.66,72.78,8.4,101.04,8.4,101.04],["C",2.98,106.45,0,113.66,0,121.32],["C",0,128.98,2.98,136.19,8.4,141.60999999999999],["L",8.4,141.60999999999999],["C",13.82,147.02999999999997,21.02,150.01,28.68,150.01],["C",36.34,150.01,43.55,147.03,48.97,141.60999999999999],["C",48.97,141.60999999999999,77.23,113.35999999999999,92.63,97.94999999999999],["C",92.63,101.02999999999999,92.63,105.42999999999999,92.63,105.42999999999999],["C",92.63,121.25,105.5,134.12,121.32,134.12],["C",128.98,134.12,136.19,131.13,141.60999999999999,125.72],["C",147.02999999999997,120.3,150.01,113.1,150.01,105.44],["L",150.01,28.700000000000003],["C",150.01,21.040000000000003,147.03,13.830000000000004,141.60999999999999,8.410000000000004],["C",136.19,2.98,128.98,0,121.32,0],["Z"]]},{"type":"Path","version":"7.0.0-beta1","left":-0.175,"top":-0.055,"width":134.83,"height":134.83,"fill":"#961B1E","path":[["M",142.42,105.43],["L",142.42,28.69],["C",142.42,17.04,132.97,7.59,121.32,7.59],["L",44.58,7.59],["C",32.93,7.59,23.479999999999997,17.04,23.479999999999997,28.69],["C",23.479999999999997,40.34,32.92999999999999,49.790000000000006,44.58,49.790000000000006],["L",70.37,49.790000000000006],["L",13.77,106.4],["C",5.529999999999999,114.64,5.529999999999999,128,13.77,136.24],["C",22.009999999999998,144.48000000000002,35.370000000000005,144.48000000000002,43.61,136.24],["L",100.22,79.63000000000001],["L",100.22,105.42000000000002],["C",100.22,117.07000000000002,109.67,126.52000000000001,121.32,126.52000000000001],["C",132.97,126.53,142.42,117.08,142.42,105.43],["Z"]]}]},{"type":"Rect","version":"7.0.0-beta1","left":562.44,"top":331.66,"width":50,"height":50,"fill":"#f75873","scaleX":0.92,"scaleY":0.92,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":686.325,"top":195.185,"width":100,"height":100,"fill":"#66df30","scaleX":0.83,"scaleY":0.83,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":330.155,"top":411.165,"width":50,"height":50,"fill":"#85d3e3","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":620.725,"top":300.595,"width":50,"height":50,"fill":"#99a934","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":242.18,"top":467.2,"width":50,"height":50,"fill":"#d1ab33","scaleX":1.42,"scaleY":1.42,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":751.875,"top":121.875,"width":50,"height":50,"fill":"#649cf2","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":100.62,"top":487.64,"width":100,"height":100,"fill":"#787bd8","scaleX":0.74,"scaleY":0.74,"opacity":0.8},{"type":"Rect","version":"7.0.0-beta1","left":604.015,"top":395.735,"width":50,"height":50,"fill":"#1a7f06","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":319.525,"top":484.105,"width":100,"height":100,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":0,"y2":100},"colorStops":[{"offset":0,"color":"rgb(103,118,26)","opacity":1},{"offset":1,"color":"rgb(164,77,104)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":0.67,"scaleY":0.67,"opacity":0.8},{"type":"Polygon","version":"7.0.0-beta1","left":411.1,"top":486.28,"width":385,"height":245,"fill":"#ee833f","scaleX":0.43,"scaleY":0.43,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":471.65,"top":457.52,"width":100,"height":100,"fill":"#4ac9fa","scaleX":0.5,"scaleY":0.5,"opacity":0.8},{"fontSize":20,"fontFamily":"helvetica","text":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut la","styles":[],"type":"Textbox","version":"7.0.0-beta1","left":419.1662,"top":568.6305,"width":674.96,"height":48.816,"fill":"#722561","scaleX":1.19,"scaleY":1.19},{"type":"Rect","version":"7.0.0-beta1","left":533.295,"top":503.735,"width":50,"height":50,"fill":"#a51907","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":717.265,"top":303.275,"width":100,"height":100,"fill":{"type":"linear","coords":{"x1":0,"y1":0,"x2":100,"y2":0},"colorStops":[{"offset":0,"color":"rgb(29,69,103)","opacity":1},{"offset":1,"color":"rgb(206,159,161)","opacity":1}],"offsetX":0,"offsetY":0,"gradientUnits":"pixels"},"scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":760.875,"top":200.305,"width":50,"height":50,"fill":"#9f2237","scaleX":1.29,"scaleY":1.29,"opacity":0.8},{"type":"Polygon","version":"7.0.0-beta1","left":661.19,"top":473.99,"width":385,"height":245,"fill":"#ba0975","scaleX":0.48,"scaleY":0.48,"points":[{"x":185,"y":0},{"x":250,"y":100},{"x":385,"y":170},{"x":0,"y":245}]},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":581.49,"top":456.79,"width":100,"height":100,"fill":"#869412","scaleX":0.46,"scaleY":0.46,"opacity":0.8},{"radius":50,"type":"Circle","version":"7.0.0-beta1","left":713.135,"top":415.505,"width":100,"height":100,"fill":"#1a6248","scaleX":0.75,"scaleY":0.75,"opacity":0.8},{"type":"Triangle","version":"7.0.0-beta1","left":744.155,"top":505.025,"width":50,"height":50,"fill":"#6acbfa","scaleX":1.29,"scaleY":1.29,"opacity":0.8}]}`;

const raw: renderTestType[] = [
  {
    title: 'Text to DataURL',
    golden: 'dataurl1.png',
    percentage: 0.1,
    size: [388, 70],
    async renderFunction(canvas, fabric) {
      fabric.FabricObject.ownDefaults.objectCaching = false;
      const text = new fabric.FabricText('Hi i m an image', {
        strokeWidth: 2,
        stroke: 'red',
        fontSize: 60,
        objectCaching: false,
      });
      canvas.add(text);
      text.setPositionByOrigin(new Point(0, 0), 'left', 'top');
      return canvas.toDataURL();
    },
  },
  {
    title: 'Text to DataURL with shadow no offset',
    golden: 'dataurl2.png',
    percentage: 0.1,
    size: [399, 80],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('Hi i m an image', {
        strokeWidth: 0,
        fontSize: 60,
        objectCaching: false,
      });
      text.shadow = new fabric.Shadow({
        color: 'purple',
        offsetX: 0,
        offsetY: 0,
        blur: 6,
      });
      return text.toDataURL();
    },
  },
  {
    title: 'Text to DataURL with shadow large offset',
    golden: 'dataurl3.png',
    percentage: 0.09,
    size: [467, 168],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('Hi i m an image', {
        strokeWidth: 0,
        fontSize: 60,
        objectCaching: false,
      });
      text.shadow = new fabric.Shadow({
        color: 'purple',
        offsetX: -30,
        offsetY: +40,
        blur: 10,
      });
      return text.toDataURL();
    },
  },
  {
    title: 'A flipped text',
    golden: 'dataurl31.png',
    percentage: 0.09,
    size: [386, 68],
    async renderFunction(canvas, fabric) {
      const text = new fabric.FabricText('Hi i m an image', {
        strokeWidth: 0,
        fontSize: 60,
        objectCaching: false,
        flipX: true,
      });
      canvas.add(text);
      text.setPositionByOrigin(new Point(0, 0), 'left', 'top');
      return canvas.toDataURL();
    },
  },
  {
    title: 'Canvas toDataURL with objects',
    golden: 'dataurl4.png',
    percentage: 0.09,
    size: [800, 600],
    async renderFunction(canvas) {
      await canvas.loadFromJSON(canvasWithObjects);
      return canvas.toDataURL();
    },
  },
  {
    title: 'Canvas toDataURL with objects and multiplier 0.3',
    golden: 'dataurl5.png',
    percentage: 0.09,
    size: [800, 600],
    async renderFunction(canvas, fabric) {
      await canvas.loadFromJSON(canvasWithObjects);
      return canvas.toDataURL({ multiplier: 0.3 });
    },
  },
  {
    title: 'Canvas toDataURL with objects and multiplier 4',
    golden: 'dataurl6.png',
    percentage: 0.09,
    size: [80, 60],
    async renderFunction(canvas, fabric) {
      canvas.setZoom(0.1);
      await canvas.loadFromJSON(canvasWithObjects);
      return canvas.toDataURL({ multiplier: 4 });
    },
  },
  {
    title: 'Canvas toDataURL with objects and cropping and high multiplier',
    golden: 'dataurl7.png',
    percentage: 0.09,
    size: [80, 60],
    async renderFunction(canvas) {
      canvas.setZoom(0.1);
      await canvas.loadFromJSON(canvasWithObjects);

      return canvas.toDataURL({
        multiplier: 12,
        left: 20,
        top: 20,
        width: 20,
        height: 20,
      });
    },
  },
  {
    title: 'Canvas toDataURL with objects and cropping with standard size',
    golden: 'dataurl7.png',
    percentage: 0.09,
    size: [800, 600],
    async renderFunction(canvas) {
      await canvas.loadFromJSON(canvasWithObjects);

      return canvas.toDataURL({
        multiplier: 1.2,
        left: 200,
        top: 200,
        width: 200,
        height: 200,
      });
    },
  },
  {
    title: 'Canvas toDataURL with objects and cropping and small multiplier',
    golden: 'dataurl7.png',
    percentage: 0.09,
    size: [2400, 1800],
    async renderFunction(canvas) {
      canvas.setZoom(3);
      await canvas.loadFromJSON(canvasWithObjects);

      return canvas.toDataURL({
        multiplier: 0.4,
        left: 600,
        top: 600,
        width: 600,
        height: 600,
      });
    },
  },
  {
    title: 'Shadow offsets dataURL with retina',
    golden: 'dataurl10.png',
    percentage: 0.09,
    size: [300, 300],
    async renderFunction(canvas, fabric) {
      canvas.enableRetinaScaling = true;
      fabric.config.configure({ devicePixelRatio: 2 });

      const shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 1,
        offsetX: 50,
        offsetY: 10,
        opacity: 0.6,
      };

      const rect = new fabric.Rect({
        left: 60,
        top: 60,
        fill: '#FF0000',
        stroke: '#000',
        width: 100,
        height: 100,
        strokeWidth: 10,
        opacity: 0.8,
      });

      rect.shadow = new fabric.Shadow(shadow);
      canvas.add(rect);
      return canvas.toDataURL({ multiplier: 0.5 });
    },
  },
  {
    title: 'Shadow offsets dataURL without retina',
    golden: 'dataurl10.png',
    percentage: 0.09,
    size: [300, 300],
    async renderFunction(canvas, fabric) {
      canvas.enableRetinaScaling = false;
      fabric.config.configure({ devicePixelRatio: 1 });

      const shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 1,
        offsetX: 50,
        offsetY: 10,
        opacity: 0.6,
      };

      const rect = new fabric.Rect({
        left: 60,
        top: 60,
        fill: '#FF0000',
        stroke: '#000',
        width: 100,
        height: 100,
        strokeWidth: 10,
        opacity: 0.8,
      });

      rect.shadow = new fabric.Shadow(shadow);
      canvas.add(rect);

      return canvas.toDataURL({ multiplier: 0.5 });
    },
  },
  {
    title:
      'Shadow offsets dataURL with retina and retinaScaling enable in export',
    golden: 'dataurl12.png',
    percentage: 0.09,
    size: [300, 300],
    async renderFunction(canvas, fabric) {
      canvas.enableRetinaScaling = true;
      fabric.config.configure({ devicePixelRatio: 2 });

      const shadow = {
        color: 'rgba(0,0,0,0.6)',
        blur: 1,
        offsetX: 50,
        offsetY: 10,
        opacity: 0.6,
      };

      const rect = new fabric.Rect({
        left: 60,
        top: 60,
        fill: '#FF0000',
        stroke: '#000',
        width: 100,
        height: 100,
        strokeWidth: 10,
        opacity: 0.8,
      });

      rect.shadow = new fabric.Shadow(shadow);
      canvas.add(rect);

      const dataurl = canvas.toDataURL({
        multiplier: 0.5,
        enableRetinaScaling: true,
      });

      fabric.config.configure({ devicePixelRatio: 1 });

      return dataurl;
    },
  },
  {
    title: 'Images with odd pixels will render crisp',
    golden: 'dataurl13.png',
    percentage: 0.09,
    size: [99, 99],
    async renderFunction(canvas, fabric) {
      const imgsrc =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABjAQMAAAC19SzWAAAABlBMVEUAAAD///+l2Z/dAAAAG0lEQVR4XmNABf+RwANqyI3KjcqNyo3KjcoBACFidLMGY3BLAAAAAElFTkSuQmCC';

      const img = await fabric.FabricImage.fromURL(imgsrc);
      canvas.add(img);

      return img.toDataURL();
    },
  },
  {
    title: 'Images with even pixels will render crisp',
    golden: 'dataurl14.png',
    percentage: 0.09,
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const imgsrc =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAD///+l2Z/dAAAAG0lEQVR4XmNABf+RwAfqy43KjcqNyo3KjcoBAEFzhKc6XssoAAAAAElFTkSuQmCC';

      const img = await fabric.FabricImage.fromURL(imgsrc);

      return img.toDataURL();
    },
  },
  {
    title: 'Images with odd strokeWidth will not render crisp',
    golden: 'dataurl15.png',
    percentage: 0.09,
    disabled: true,
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const imgsrc =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABjAQMAAAC19SzWAAAABlBMVEUAAAD///+l2Z/dAAAAG0lEQVR4XmNABf+RwANqyI3KjcqNyo3KjcoBACFidLMGY3BLAAAAAElFTkSuQmCC';

      const img = await fabric.FabricImage.fromURL(imgsrc);
      img.set({
        strokeWidth: 1,
        stroke: 'orange',
      });

      img.toDataURL();
    },
  },
  {
    title: 'Images with even strokeWidth will render crisp',
    golden: 'dataurl16.png',
    percentage: 0.09,
    size: [100, 100],
    async renderFunction(canvas, fabric) {
      const imgsrc =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABjAQMAAAC19SzWAAAABlBMVEUAAAD///+l2Z/dAAAAG0lEQVR4XmNABf+RwANqyI3KjcqNyo3KjcoBACFidLMGY3BLAAAAAElFTkSuQmCC';
      const img = await fabric.FabricImage.fromURL(imgsrc);
      img.set({
        strokeWidth: 2,
        stroke: 'orange',
      });

      return img.toDataURL();
    },
  },
  {
    title: 'Canvas toDataURL with filtered objects',
    golden: 'dataurl4-filter.png',
    percentage: 0.09,
    size: [800, 600],
    async renderFunction(canvas) {
      await canvas.loadFromJSON(canvasWithObjects);

      // @ts-expect-error: TODO fix this, filter should be part of types
      return canvas.toDataURL({
        filter: (object) => object.isType('Polygon', 'Rect'),
      });
    },
  },
];

export const dataURLExports: renderTestType[] = raw;
