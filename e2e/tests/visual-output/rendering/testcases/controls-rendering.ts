import { renderTestType } from '../../../types';

export const controlsRenderingTests: renderTestType[] = [
  {
    title: 'Rect with default controls',
    golden: 'controls1.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Rect with padding',
    golden: 'controls2.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 8,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Rect with padding under group',
    golden: 'controls2.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 8,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      const group = new fabric.Group([rect]);
      group.set({ scaleX: 2 });
      rect.set({ scaleX: 0.5 });

      canvas.add(group);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Transparent corner square',
    golden: 'controls3.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 8,
        transparentCorners: false,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Circle corners green',
    golden: 'controls4.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 8,
        cornerStyle: 'circle',
        cornerColor: 'green',
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Circle corners solid red',
    golden: 'controls5.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 8,
        cornerStyle: 'circle',
        cornerColor: 'red',
        transparentCorners: false,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Corner size 20 rect style',
    golden: 'controls6.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 4,
        cornerSize: 20,
        cornerColor: 'yellow',
        transparentCorners: false,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Corner size 20 circle style',
    golden: 'controls7.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 4,
        cornerStyle: 'circle',
        cornerSize: 20,
        cornerColor: 'purple',
        transparentCorners: false,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Control visibility',
    golden: 'controls8.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 4,
        cornerSize: 20,
        cornerColor: 'blue',
        transparentCorners: false,
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      rect.setControlVisible('tl', false);
      rect.setControlVisible('br', false);

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Control with fill and stroke and dash array',
    golden: 'controls9.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 4,
        cornerSize: 17,
        cornerColor: 'green',
        cornerStrokeColor: 'pink',
        transparentCorners: false,
        cornerDashArray: [3, 3],
        fill: 'orange',
        stroke: 'green',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Control with fill and stroke and dash array with borderScaleFactor',
    golden: 'controls10.png',
    percentage: 0.02,
    size: [200, 200],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        strokeWidth: 2,
        padding: 4,
        cornerSize: 15,
        cornerColor: 'green',
        cornerStrokeColor: 'pink',
        transparentCorners: false,
        cornerDashArray: [3, 3],
        borderScaleFactor: 3,
        fill: 'red',
        stroke: 'blue',
        top: 55,
        left: 55,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox with flipped X',
    golden: 'controls11.png',
    percentage: 0.004,
    size: [150, 170],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 4,
        angle: 15,
        flipX: true,
        cornerSize: 12,
        cornerColor: 'green',
        cornerStrokeColor: 'pink',
        transparentCorners: true,
        borderScaleFactor: 3,
        fill: 'red',
        top: 35,
        left: 35,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox with flipped X in group',
    golden: 'controls11group.png',
    percentage: 0.004,
    size: [150, 180],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 9,
        angle: 0,
        flipX: true,
        cornerSize: 12,
        cornerColor: 'green',
        cornerStrokeColor: 'blue',
        transparentCorners: false,
        borderScaleFactor: 3,
        fill: 'red',
        top: 50,
        left: 35,
      });

      const group = new fabric.Group([rect], {
        interactive: true,
        subTargetCheck: true,
      });

      canvas.add(group);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox with flipped Y in rotated group',
    golden: 'controls11group90r.png',
    percentage: 0.004,
    size: [180, 180],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 9,
        angle: 0,
        flipX: false,
        cornerSize: 12,
        cornerColor: 'green',
        cornerStrokeColor: 'blue',
        transparentCorners: false,
        borderScaleFactor: 3,
        fill: 'red',
        top: 50,
        left: 35,
      });

      const group = new fabric.Group([rect], {
        angle: 90,
        left: 110,
        flipY: true,
        interactive: true,
        subTargetCheck: true,
      });

      canvas.add(group);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox opacity single',
    golden: 'controls12.png',
    percentage: 0.004,
    size: [110, 110],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 3,
        opacity: 0.4,
        cornerSize: 12,
        cornerColor: 'black',
        cornerStrokeColor: 'black',
        borderColor: 'black',
        borderScaleFactor: 4,
        fill: 'cyan',
        top: 10,
        left: 10,
        isMoving: true,
        borderOpacityWhenMoving: 0.4,
      });

      canvas.add(rect);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox opacity in group',
    golden: 'controls13.png',
    percentage: 0.004,
    size: [110, 110],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 3,
        opacity: 0.4,
        cornerSize: 12,
        cornerColor: 'black',
        cornerStrokeColor: 'black',
        borderColor: 'black',
        borderScaleFactor: 4,
        fill: 'cyan',
        isMoving: true,
        borderOpacityWhenMoving: 0.4,
      });

      const group = new fabric.Group([rect], {
        interactive: true,
        subTargetCheck: true,
        top: 10,
        left: 10,
      });

      canvas.preserveObjectStacking = false;
      canvas.add(group);
      canvas.setActiveObject(rect);
    },
  },

  {
    title: 'Controlbox opacity group and as',
    golden: 'controls14.png',
    percentage: 0.004,
    size: [220, 110],
    async renderFunction(canvas, fabric) {
      const rect = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 3,
        opacity: 0.4,
        cornerSize: 12,
        cornerColor: 'black',
        cornerStrokeColor: 'black',
        borderColor: 'black',
        borderScaleFactor: 4,
        fill: 'cyan',
        isMoving: true,
        borderOpacityWhenMoving: 0.4,
      });

      const rect2 = new fabric.Rect({
        width: 90,
        height: 90,
        padding: 3,
        opacity: 0.4,
        top: 10,
        left: 120,
        cornerSize: 12,
        cornerColor: 'black',
        cornerStrokeColor: 'black',
        borderColor: 'black',
        borderScaleFactor: 4,
        fill: 'lime',
        isMoving: true,
        borderOpacityWhenMoving: 0.4,
      });

      const group = new fabric.Group([rect], {
        interactive: true,
        subTargetCheck: true,
        top: 10,
        left: 10,
      });

      canvas.add(group, rect2);

      const activeSelection = new fabric.ActiveSelection([rect, rect2], {
        canvas: canvas,
        // @ts-expect-error -- TODO: why is `isMoving` not part of options?
        isMoving: true,
        cornerSize: 12,
        cornerColor: 'black',
        cornerStrokeColor: 'black',
        borderColor: 'black',
        borderScaleFactor: 4,
      });

      canvas.setActiveObject(activeSelection);
    },
  },
];
