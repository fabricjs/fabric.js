import type { renderTestType } from '../../../types';

const createGroupForLayoutTests = (fabric: any, text: string, options: any) => {
  const circle = new fabric.Circle({
    radius: 50,
  });
  circle.setPositionByOrigin(new fabric.Point(100, 50), 'left', 'top');

  const itext = new fabric.FabricText(text);
  itext.setPositionByOrigin(new fabric.Point(100, 150), 'left', 'top');

  const rect = new fabric.Rect({
    width: 50,
    height: 50,
    fill: 'red',
    opacity: 0.3,
  });
  rect.setPositionByOrigin(new fabric.Point(0, 200), 'left', 'top');

  const g = new fabric.Group([rect, circle, itext], options);
  return g;
};

const createObjectsForOriginTests = (
  fabric: any,
  originX: string,
  originY: string,
  options: any,
) => {
  const rect1 = new fabric.Rect({
    width: 30,
    height: 10,
    strokeWidth: 0,
  });
  rect1.setPositionByOrigin(new fabric.Point(150, 100), 'left', 'top');

  const rect2 = new fabric.Rect({
    left: 200,
    top: 120,
    width: 10,
    height: 40,
    strokeWidth: 0,
  });
  rect2.setPositionByOrigin(new fabric.Point(200, 120), 'left', 'top');

  const controlPoint = new fabric.Circle({
    radius: 5,
    fill: 'blue',
    left: 150,
    top: 100,
    originX: 'center',
    originY: 'center',
  });

  const tlControlPoint = new fabric.Circle({
    radius: 5,
    fill: 'red',
    strokeWidth: 0,
  });
  tlControlPoint.setPositionByOrigin(new fabric.Point(150, 100), 'left', 'top');

  const g = new fabric.Group(
    [rect1, rect2, tlControlPoint],
    Object.assign({}, options, {
      left: 150,
      top: 100,
      originX,
      originY,
      backgroundColor: 'pink',
    }),
  );

  return [g, controlPoint];
};

const fitContentLayout: renderTestType = {
  title: 'fit-content layout',
  golden: 'fit-content.png',
  percentage: 0.06,
  size: [400, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
    });
    canvas.add(g);
    canvas.renderAll();
  },
};

const fitContentLayoutRelative: renderTestType = {
  title: 'fit-content layout relative',
  golden: 'fit-content.png',
  percentage: 0.06,
  size: [400, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout relative', {
      backgroundColor: 'blue',
    });
    const clone = await g.clone();
    canvas.add(clone);
    canvas.renderAll();
  },
};

const fitContentReLayout: renderTestType = {
  title: 'fit-content relayout',
  golden: 'fit-content.png',
  percentage: 0.06,
  size: [400, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
    });
    const objects = g.removeAll();
    // layout
    objects.forEach((o: any) => g.add(o));
    canvas.add(g);
    canvas.renderAll();
  },
};

const fitContentLayoutWithSkewX: renderTestType = {
  title: 'fit-content layout with skewX',
  golden: 'fit-content-skewX.png',
  percentage: 0.06,
  size: [400 + Math.ceil(300 / Math.SQRT2), 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
    });
    const pos = g.translateToGivenOrigin(
      new fabric.Point(g.left, g.top),
      g.originX,
      g.originY,
      'left',
      'top',
    );
    g.skewX = 45;
    g.positionByLeftTop(pos);
    canvas.add(g);
    canvas.renderAll();
  },
};

const fitContentLayoutWithSkewY: renderTestType = {
  title: 'fit-content layout with skewY',
  golden: 'fit-content-skewY.png',
  percentage: 0.06,
  size: [400, 400 + Math.ceil(400 / Math.SQRT2)],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
    });
    const pos = g.translateToGivenOrigin(
      new fabric.Point(g.left, g.top),
      g.originX,
      g.originY,
      'left',
      'top',
    );
    g.skewY = 45;
    g.positionByLeftTop(pos);
    canvas.add(g);
    canvas.renderAll();
  },
};

const nestedLayout: renderTestType = {
  title: 'unit test scene',
  golden: 'unit-test-scene.png',
  percentage: 0.01,
  size: [120, 210],
  async renderFunction(canvas, fabric) {
    const rect3 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'yellow',
    });
    rect3.setPositionByOrigin(new fabric.Point(0, 0), 'left', 'top');

    const rect4 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'purple',
    });
    rect4.setPositionByOrigin(new fabric.Point(100, 100), 'left', 'top');

    const group3 = new fabric.Group([rect3, rect4], {
      scaleX: 0.5,
      scaleY: 0.5,
    });
    group3.subTargetCheck = true;
    group3.setPositionByOrigin(new fabric.Point(0, 100), 'left', 'top');

    group3.setCoords();

    const rect1 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'red',
    });
    rect1.setPositionByOrigin(new fabric.Point(0, 0), 'left', 'top');

    const rect2 = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'blue',
    });
    rect2.setPositionByOrigin(new fabric.Point(100, 100), 'left', 'top');

    const g = new fabric.Group([rect1, rect2, group3], {
      top: -150,
      left: -50,
    });
    g.subTargetCheck = true;
    g.setPositionByOrigin(new fabric.Point(-50, -150), 'left', 'top');

    canvas.viewportTransform = [0.1, 0, 0, 0.1, 100, 200];
    canvas.add(g);
    canvas.renderAll();
  },
};

const fitContentLayoutChange: renderTestType = {
  title: 'fit-content layout after change',
  golden: 'fit-content2.png',
  percentage: 0.06,
  size: [400, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
    });

    const point = fabric.util.transformPoint(
      new fabric.Point(50, 0),
      fabric.util.invertTransform(g.calcTransformMatrix()),
    );

    g.item(0).setPositionByOrigin(
      new fabric.Point(point.x, g.item(0).y),
      'left',
      g.item(0).originY,
    );
    const pos = g
      .item(1)
      .translateToGivenOrigin(
        new fabric.Point(g.item(1).left, g.item(1).top),
        g.item(1).originX,
        g.item(1).originY,
        'left',
        'top',
      );
    g.item(1).set({ skewX: -45 });
    g.item(1).positionByLeftTop(pos);
    g.item(2).rotate(45);
    g.triggerLayout({ strategy: new fabric.FitContentLayout() });
    canvas.add(g);
    canvas.renderAll();
  },
};

const fitContentLayoutAdd: renderTestType = {
  title: 'fit-content layout add object',
  golden: 'fit-content3.png',
  percentage: 0.06,
  size: [400, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'fit-content layout', {
      backgroundColor: 'blue',
      layoutManager: new fabric.LayoutManager(),
    });

    const rect = new fabric.Rect({
      width: 50,
      height: 50,
      fill: 'red',
      angle: 15,
      skewY: 30,
    });
    rect.setPositionByOrigin(new fabric.Point(50, 200), 'left', 'top');
    g.add(rect);
    canvas.add(g);
    canvas.renderAll();
  },
};

const clipPathLayout: renderTestType = {
  title: 'clip-path layout',
  golden: 'clip-path.png',
  percentage: 0.06,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'clip path layout', {
      backgroundColor: 'magenta',
      clipPath: new fabric.Circle({
        radius: 110,
        originX: 'center',
        originY: 'center',
      }),
      layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
    });

    canvas.add(g);
    canvas.renderAll();
  },
};

const clipPathLayoutWithScale: renderTestType = {
  title: 'clip-path layout scaleX value',
  golden: 'clip-path1.png',
  percentage: 0.06,
  size: [300, 300],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'clip path layout', {
      backgroundColor: 'magenta',
      clipPath: new fabric.Circle({
        radius: 110,
        originX: 'center',
        originY: 'center',
        scaleX: 0.6,
      }),
      layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
    });

    canvas.add(g);
    canvas.renderAll();
  },
};

const clipPathLayout2: renderTestType = {
  title: 'clip-path layout left, top, originX, originY, scaleX values - WRONG',
  golden: 'clip-path2.png',
  percentage: 0.06,
  size: [330, 330],
  async renderFunction(canvas, fabric) {
    const clipPath = new fabric.Circle({
      radius: 110,
      scaleX: 1.5,
    });
    clipPath.setPositionByOrigin(new fabric.Point(-150, -100), 'left', 'top');
    const g = createGroupForLayoutTests(fabric, 'clip path layout', {
      backgroundColor: 'magenta',
      clipPath,
      layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
    });

    canvas.add(g);
    canvas.renderAll();
  },
};

const absClipPathLayout: renderTestType = {
  title: 'absolute clip-path layout',
  golden: 'clip-path3.png',
  percentage: 0.06,
  size: [250, 250],
  async renderFunction(canvas, fabric) {
    const g = createGroupForLayoutTests(fabric, 'clip path layout', {
      backgroundColor: '#0dcaf0',
      clipPath: new fabric.Circle({
        radius: 110,
        originX: 'center',
        originY: 'center',
        absolutePositioned: true,
        left: 50,
        top: 150,
        skewX: 20,
      }),
      layoutManager: new fabric.LayoutManager(new fabric.ClipPathLayout()),
    });

    canvas.add(g);
    canvas.renderAll();
  },
};

const originTests: renderTestType[] = [];
const originX = ['left', 'center', 'right'];
const originY = ['top', 'center', 'bottom'];

for (let angle = 0; angle < 360; angle += 30) {
  originX.forEach((ox) => {
    originY.forEach((oy) => {
      originTests.push({
        title: `layout with originX=${ox}, originY=${oy} and angle=${angle} values`,
        golden: `origin-${ox}-${oy}-${angle}deg.png`,
        percentage: 0.001,
        size: [200, 200],
        async renderFunction(canvas, fabric) {
          const objects = createObjectsForOriginTests(fabric, ox, oy, {
            angle,
          });
          canvas.add(...objects);
          canvas.setViewportTransform([1, 0, 0, 1, -50, 0]);
          canvas.renderAll();
        },
      });
    });
  });
}

for (let angle = 0; angle < 360; angle += 30) {
  originX.forEach((ox) => {
    originY.forEach((oy) => {
      originTests.push({
        title: `layout with position and originX=${ox}, originY=${oy} and angle=${angle} values`,
        golden: `with-position-origin-${ox}-${oy}-${angle}deg.png`,
        percentage: 0.001,
        size: [200, 200],
        async renderFunction(canvas, fabric) {
          const objects = createObjectsForOriginTests(fabric, ox, oy, {
            angle,
            left: 150,
            top: 100,
          });
          canvas.add(...objects);
          canvas.setViewportTransform([1, 0, 0, 1, -50, 0]);
          canvas.renderAll();
        },
      });
    });
  });
}

export const groupLayoutTests: renderTestType[] = [
  fitContentLayout,
  fitContentLayoutRelative,
  fitContentReLayout,
  fitContentLayoutWithSkewX,
  fitContentLayoutWithSkewY,
  nestedLayout,
  fitContentLayoutChange,
  fitContentLayoutAdd,
  clipPathLayout,
  clipPathLayoutWithScale,
  clipPathLayout2,
  absClipPathLayout,
  ...originTests,
].map((test) => ({
  ...test,
  snapshotSuffix: 'group-layout',
}));
