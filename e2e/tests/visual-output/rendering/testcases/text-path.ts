import type { renderTestType } from '../../../types';

const textpath1: renderTestType = {
  title: 'text on a circle path',
  golden: 'textpath1.png',
  percentage: 0.09,
  size: [200, 200],
  async renderFunction(canvas, fabric) {
    const circlePath = new fabric.Path(
      'M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
      { visible: false },
    );
    const text = new fabric.FabricText(
      'Hello this is a test of text on a path',
      {
        path: circlePath,
        fontSize: 24,
      },
    );
    canvas.add(text);
    canvas.renderAll();
  },
};

const textpath2: renderTestType = {
  title: 'text on a triangle with background color',
  golden: 'textpath2.png',
  percentage: 0.09,
  size: [200, 200],
  async renderFunction(canvas, fabric) {
    const tri = new fabric.Path('M100 5 L 5 195 L 195 195 z', {
      visible: false,
    });
    const txt = new fabric.FabricText(
      'wrapping with thigh corners it is what it is. Maybe one day it will look better',
      {
        left: 0,
        top: 0,
        fontSize: 16,
        fontFamily: 'Arial',
        paintFirst: 'stroke',
        strokeWidth: 2,
        strokeLineJoin: 'round',
        strokeLineCap: 'round',
        fill: 'blue',
        stroke: 'red',
        path: tri,
        textBackgroundColor: 'yellow',
      },
    );
    canvas.add(txt);
    canvas.renderAll();
  },
};

const textpath3: renderTestType = {
  title: 'Textpath on a particular bezier',
  golden: 'textpath3.png',
  percentage: 0.09,
  size: [610, 270],
  async renderFunction(canvas, fabric) {
    const bez = new fabric.Path('M -194 -109 C 538 -300 154 50 98 29', {
      visible: false,
    });
    const txt = new fabric.FabricText(
      'Testing constant distance on bezier curve.',
      {
        path: bez,
        top: 30,
        left: 30,
      },
    );
    canvas.add(txt);
    canvas.renderAll();
  },
};

const textpath4: renderTestType = {
  title: 'textpath aligned right',
  golden: 'textpath4.png',
  percentage: 0.09,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const swirl = new fabric.Path(
      'M 0 0 Q 180 0 180 -101.25 Q 180 -180 90 -180 Q 0 -180 0 -112.5 Q 0 -45 78.75 -45 Q 135 -45 146.25 -90',
      { visible: false },
    );
    const right = new fabric.FabricText(
      'Text on a swirl path with textAlign right',
      {
        left: 50,
        top: 50,
        fontSize: 28,
        textAlign: 'right',
        charSpacing: 50,
        path: swirl,
      },
    );
    const centre = new fabric.FabricText(
      'Text on a swirl path with textAlign center',
      {
        left: 50,
        top: 50,
        fontSize: 28,
        textAlign: 'center',
        charSpacing: 50,
        path: swirl,
      },
    );
    canvas.add(right, centre);
    canvas.renderAll();
  },
};

const textpath5: renderTestType = {
  title: 'various textpath aligned',
  golden: 'textpath5.png',
  percentage: 0.016,
  size: [500, 400],
  async renderFunction(canvas) {
    await canvas.loadFromJSON(
      '{"version":"4.5.1","objects":[{"type":"Path","version":"4.5.1","left":213,"top":163,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":200,"top":6,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":18,"top":164,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"4.5.1","left":9,"top":14,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Text","version":"4.5.1","left":10,"top":14,"width":180,"height":180,"text":"Text on a swirl textAlign right","fontSize":28,"textAlign":"right","charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":15,"top":165,"width":180,"height":180,"text":"Text on a swirl textAlign left","fontSize":28,"charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":201,"top":9,"width":180,"height":180,"text":"Text on a swirl textAlign center","fontSize":28,"textAlign":"center","charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}},{"type":"Text","version":"4.5.1","left":213,"top":164,"width":180,"height":180,"text":"full text to understand better a Text on a swirl textAlign","fontSize":28,"charSpacing":50,"path":{"type":"Path","version":"4.5.1","originX":"left","originY":"top","left":-0.5,"top":-180.5,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"direction":"ltr","styles":{}}]}',
    );
    canvas.renderAll();
  },
};

const textpath6: renderTestType = {
  title: 'textpath with pathSide and pathStartOffset and painted path',
  golden: 'textpath6.png',
  percentage: 0.09,
  size: [300, 200],
  async renderFunction(canvas, fabric) {
    const arc = new fabric.Path('M 0 0 A 150 350 0 0 1 250 0', {
      strokeWidth: 2,
      stroke: 'blue',
      opacity: 0.5,
      left: 25,
      top: 25,
      fill: 'transparent',
    });
    const txt = new fabric.FabricText('Text on the right side of a curve', {
      left: 25,
      top: 25,
      fontSize: 28,
      pathSide: 'right',
      pathStartOffset: 100,
      path: arc,
    });
    canvas.add(txt);
    canvas.renderAll();
  },
};

export const textPathTests = [
  textpath1,
  textpath2,
  textpath3,
  textpath4,
  textpath5,
  textpath6,
];
