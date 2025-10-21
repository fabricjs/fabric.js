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
    txt.setPositionByOrigin(new fabric.Point(0, 0), 'left', 'top');
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
      '{"version":"7.0.0-beta1","objects":[{"type":"Path","version":"7.0.0-beta1","left":304,"top":254,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"7.0.0-beta1","left":291,"top":97,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"7.0.0-beta1","left":109,"top":255,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"type":"Path","version":"7.0.0-beta1","left":100,"top":105,"width":180,"height":180,"fill":"","stroke":"red","strokeWidth":2,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},{"fontSize":28,"text":"Text on a swirl textAlign right","charSpacing":50,"textAlign":"right","styles":[],"path":{"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":90,"top":-90,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"type":"Text","version":"7.0.0-beta1","left":100.5,"top":104.5,"width":180,"height":180},{"fontSize":28,"text":"Text on a swirl textAlign left","charSpacing":50,"styles":[],"path":{"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":90,"top":-90,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"type":"Text","version":"7.0.0-beta1","left":105.5,"top":255.5,"width":180,"height":180},{"fontSize":28,"text":"Text on a swirl textAlign center","charSpacing":50,"textAlign":"center","styles":[],"path":{"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":90,"top":-90,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"type":"Text","version":"7.0.0-beta1","left":291.5,"top":99.5,"width":180,"height":180},{"fontSize":28,"text":"full text to understand better a Text on a swirl textAlign","charSpacing":50,"styles":[],"path":{"type":"Path","version":"7.0.0-beta1","originX":"center","originY":"center","left":90,"top":-90,"width":180,"height":180,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":false,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"path":[["M",0,0],["Q",180,0,180,-101.25],["Q",180,-180,90,-180],["Q",0,-180,0,-112.5],["Q",0,-45,78.75,-45],["Q",135,-45,146.25,-90]]},"type":"Text","version":"7.0.0-beta1","left":303.5,"top":254.5,"width":180,"height":180}]}',
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
