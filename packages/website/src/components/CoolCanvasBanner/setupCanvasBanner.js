import {
  Canvas,
  Rect,
  Circle,
  Triangle,
  FabricText as Text,
  loadSVGFromURL,
  util,
  Shadow,
  FabricImage as Image,
  filters,
  Ellipse,
  Group,
  FabricObject,
  Path,
  Gradient,
  classRegistry,
} from 'fabric/es';



export const setupCanvasBanner = ({ canvasEl, container }) => {
  classRegistry.setClass(Path);
  classRegistry.setSVGClass(Path);
  classRegistry.setClass(Gradient, 'gradient');
  classRegistry.setClass(Gradient, 'linear');
  classRegistry.setClass(Gradient, 'radial');
  FabricObject.ownDefaults.originX = 'center';
  FabricObject.ownDefaults.originY = 'center';
  FabricObject.ownDefaults.cornerStrokeColor = 'white';
  FabricObject.ownDefaults.cornerStyle = 'circle';
  FabricObject.ownDefaults.cornerColor = '#0C7CAC';
  FabricObject.ownDefaults.transparentCorners = false;
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === container) {
        const bbox = entry.target.getBoundingClientRect();
        const { width, height } = bbox;
        canvas.setDimensions({
          width,
          height,
        }, {});
      }
    }
  });

  const canvas = new Canvas(canvasEl, {
    containerClass: 'canvas-banner',
    allowTouchScrolling: true,
  });
  canvas.wrapperEl.style.position = 'absolute';
  resizeObserver.observe(container);

  // simple shapes
  const rect = new Rect({
    width: 80,
    height: 60,
    left: 400,
    top: 400,
    fill: '#f55',
    strokeWidth: 0,
  });
  const circle = new Circle({
    radius: 30,
    left: 350,
    top: 350,
    fill: 'rgb(50, 205, 50)',
    strokeWidth: 0,
  });
  const triangle = new Triangle({
    width: 80,
    height: 80,
    left: 450,
    top: 430,
    fill: '#55f',
    strokeWidth: 0,
  });

  canvas.add(triangle, rect, circle);

  // text
  const text1 = new Text('Fabric', {
    left: 90,
    top: 270,
    angle: -5,
    fontFamily: 'Helvetica',
    strokeWidth: 0,
    fontSize: 20,
    fill: 'red',
  });
  var text2 = new Text('has', {
    fontSize: 60,
    left: 170,
    top: 260,
    fontFamily: 'Impact',
    fill: '#eee',
    strokeWidth: 2,
    stroke: 'red',
  });
  var text3 = new Text('multiline text', {
    left: 150,
    top: 325,
    angle: -5,
    fontFamily: 'Georgia',
    strokeWidth: 0,
    fontSize: 20,
    fontWeight: 'bold',
    fill: 'green',
    textBackgroundColor: '#efe',
  });
  var text4 = new Text('with extensive \ndecoration support', {
    left: 140,
    top: 360,
    angle: -5,
    fontFamily: 'Courier',
    fontSize: 18,
    underline: true,
    strokeWidth: 0,
    fill: 'blue',
    textAlign: 'center',
  });
  var text5 = new Text('and\neven\nalignment', {
    left: 140,
    top: 430,
    angle: 5,
    fontFamily: 'Arial',
    fontStyle: 'italic',
    fontSize: 20,
    strokeWidth: 0,
    fill: 'grey',
    textAlign: 'right',
  });
  canvas.add(text1, text2, text3, text4, text5);

  loadSVGFromURL('/assets/112.svg').then(({ objects, options }) => {
    var shape = util.groupSVGElements(objects, options);
    shape.set({
      left: 430,
      top: 580,
      angle: -15,
      perPixelTargetFind: true,
      targetFindTolerance: 4,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer',
      originX: 'center',
      originY: 'center',
      shadow: new Shadow({
        color: 'rgba(0,0,0,0.5)',
        offsetX: 10,
        offsetY: 10,
        blur: 10,
      }),
    });

    canvas.add(shape);
  });

  // simple shapes with border
  const rectB = new Rect({
    width: 79,
    height: 59,
    left: 390,
    top: 300,
    fill: '#f55',
    strokeWidth: 1,
    stroke: 'black',
  });
  const circleB = new Circle({
    radius: 29.5,
    left: 340,
    top: 250,
    fill: 'rgb(50, 205, 50)',
    strokeWidth: 1,
    stroke: 'black',
  });
  const triangleB = new Triangle({
    width: 79,
    height: 79,
    left: 440,
    top: 330,
    fill: '#55f',
    strokeWidth: 1,
    stroke: 'black',
  });

  canvas.add(triangleB, rectB, circleB);

  // complex shapes
  loadSVGFromURL('assets/57.svg').then(({ objects, options }) => {
    var shape = util.groupSVGElements(objects, options);
    shape
      .set({
        left: 500,
        top: 210,
        angle: -15,
      })
      .scale(0.3);
    canvas.add(shape);
  });

  // images
  Image.fromURL('assets/printio.png').then((image) => {
    image.set({
      left: 930,
      top: 150,
      angle: 10,
    });
    image.scale(0.3);
    canvas.add(image);

    // filters
    image.clone().then((clone) => {
      clone.set({
        left: 1180,
        top: 450,
      });
      clone.filters.push(new filters.Invert());
      clone.applyFilters();
      canvas.add(clone);
    });
  });

  // arrow
  loadSVGFromURL('assets/156.svg').then(({ objects, options }) => {
    var shape = util.groupSVGElements(objects, options);
    shape.set({
      left: 1130,
      top: 350,
      angle: 70,
      scaleX: 2,
      scaleY: 1.5,
      flipY: true,
    });

    canvas.add(shape);
  });

  // gradients
  loadSVGFromURL('assets/gradients/svg_radial_4.svg').then(
    ({ objects, options }) => {
      var shape = util.groupSVGElements(objects, options);
      shape
        .set({
          left: 780,
          top: 300,
          angle: -15,
          originX: 'center',
          originY: 'center',
        })
        .scale(0.5);

      canvas.add(shape);
    }
  );
  loadSVGFromURL('assets/gradients/svg_linear_8.svg').then(
    ({ objects, options }) => {
      var shape = util.groupSVGElements(objects, options);
      shape
        .set({
          left: 780,
          top: 400,
          angle: 15,
          originX: 'center',
          originY: 'center',
        })
        .scale(0.75);

      canvas.add(shape);
      canvas.calcOffset();
    }
  );

  // group
  const ellipse1 = new Ellipse({
    rx: 80,
    ry: 40,
    fill: '#800080',
    stroke: '#555',
    strokeWidth: 5,
    angle: 30,
  });
  const ellipse2 = new Ellipse({
    rx: 80,
    ry: 40,
    fill: '#FFFF00',
    stroke: '#555',
    strokeWidth: 5,
    angle: -30,
  });
  const text = new Text('I am a group!', {
    fill: '#333',
    fontFamily: 'Helvetica',
    fontSize: 17,
  });
  const group = new Group([ellipse1, ellipse2, text], {
    left: 1200,
    top: 600,
    angle: 30,
  });
  canvas.add(group);

  return {
    resizeObserver,
    fabricCanvas: canvas,
  };
};
