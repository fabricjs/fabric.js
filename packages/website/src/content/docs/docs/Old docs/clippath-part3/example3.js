import * as fabric from 'fabric';

export default function (id) {
    var canvas = new fabric.Canvas(id, { width: 300, height: 200 });
    canvas.controlsAboveOverlay = true;
    var clipPath = new fabric.Rect({ width: 100, height: 100, top: 0, left: 0 });
    function animateLeft() {
      clipPath.animate({
        left: 200,
      }, {
        duration: 900,
        onChange: canvas.requestRenderAll.bind(canvas),
        onComplete: animateRight,
      });
    }
    function animateRight() {
      clipPath.animate({
        left: 0,
      }, {
        duration: 1200,
        onChange: canvas.requestRenderAll.bind(canvas),
        onComplete: animateLeft,
      });
    }
    function animateDown() {
      clipPath.animate({
        top: 100,
      }, {
        duration: 500,
        onChange: canvas.requestRenderAll.bind(canvas),
        onComplete: animateUp,
      });
    }
    function animateUp() {
      clipPath.animate({
        top: 0,
      }, {
        duration: 400,
        onChange: canvas.requestRenderAll.bind(canvas),
        onComplete: animateDown,
      });
    }
    var group = new fabric.Group([
      new fabric.Rect({ width: 100, height: 100, fill: 'red' }),
      new fabric.Rect({ width: 100, height: 100, fill: 'yellow', left: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'blue', top: 100 }),
      new fabric.Rect({ width: 100, height: 100, fill: 'green', left: 100, top: 100 })
    ], {
      scaleX: 1.5
    });
    animateLeft();
    animateDown();
    canvas.clipPath = clipPath;
    canvas.add(group);
}