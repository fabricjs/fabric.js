import { Control, controlsUtils } from 'fabric';
import {
  changeCropHeight,
  changeCropWidth,
  changeCropX,
  changeCropY,
  ghostScalePositionHandler,
  scaleEquallyCropGenerator,
  changeEdgeWidth,
  changeEdgeHeight,
} from './croppingHandlers';
import { renderCornerControl } from './renderCornerControl';
import { renderEdgeControl } from './renderEdgeControl';

const { scaleCursorStyleHandler } = controlsUtils;

const cropActionName = () => 'crop';
// use this function if you want to generate new controls for every instance
export const createImageCroppingControls = () => ({
  // scaling image
  tls: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
    actionHandler: scaleEquallyCropGenerator(-0.5, -0.5),
  }),
  brs: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
    actionHandler: scaleEquallyCropGenerator(0.5, 0.5),
  }),
  trs: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
    actionHandler: scaleEquallyCropGenerator(0.5, -0.5),
  }),
  bls: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
    actionHandler: scaleEquallyCropGenerator(-0.5, 0.5),
  }),
  // cropping image
  mlc: new Control({
    x: -0.5,
    y: 0,
    sizeX: 4,
    sizeY: 20,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropX,
    getActionName: cropActionName,
  }),

  mrc: new Control({
    x: 0.5,
    y: 0,
    sizeX: 4,
    sizeY: 20,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropWidth,
    getActionName: cropActionName,
  }),

  mbc: new Control({
    x: 0,
    y: 0.5,
    sizeX: 20,
    sizeY: 4,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropHeight,
    getActionName: cropActionName,
  }),

  mtc: new Control({
    x: 0,
    y: -0.5,
    sizeX: 20,
    sizeY: 4,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropY,
    getActionName: cropActionName,
  }),

  tlc: new Control({
    angle: 0,
    x: -0.5,
    y: -0.5,
    sizeX: 20,
    sizeY: 4,
    render: renderCornerControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const cropX = changeCropX(...args);
      const cropY = changeCropY(...args);
      return cropX || cropY;
    },
    getActionName: cropActionName,
  }),

  trc: new Control({
    angle: 90,
    x: 0.5,
    y: -0.5,
    sizeX: 20,
    sizeY: 4,
    render: renderCornerControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const width = changeCropWidth(...args);
      const cropY = changeCropY(...args);
      return width || cropY;
    },
    getActionName: cropActionName,
  }),

  blc: new Control({
    angle: 270,
    x: -0.5,
    y: 0.5,
    sizeX: 20,
    sizeY: 4,
    render: renderCornerControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const height = changeCropHeight(...args);
      const cropX = changeCropX(...args);
      return height || cropX;
    },
    getActionName: cropActionName,
  }),

  brc: new Control({
    angle: 180,
    x: 0.5,
    y: 0.5,
    sizeX: 20,
    sizeY: 4,
    render: renderCornerControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const height = changeCropHeight(...args);
      const width = changeCropWidth(...args);
      return height || width;
    },
    getActionName: cropActionName,
  }),
});

const edgeActionName = () => 'resizing';

// edge resize controls - resize within crop bounds, then uniform scale when exhausted
export const createImageEdgeResizeControls = () => ({
  mle: new Control({
    x: -0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 20,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeWidth,
    getActionName: edgeActionName,
  }),

  mre: new Control({
    x: 0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 20,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeWidth,
    getActionName: edgeActionName,
  }),

  mte: new Control({
    x: 0,
    y: -0.5,
    angle: 0,
    sizeX: 20,
    sizeY: 8,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeHeight,
    getActionName: edgeActionName,
  }),

  mbe: new Control({
    x: 0,
    y: 0.5,
    angle: 0,
    sizeX: 20,
    sizeY: 8,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeHeight,
    getActionName: edgeActionName,
  }),
});
