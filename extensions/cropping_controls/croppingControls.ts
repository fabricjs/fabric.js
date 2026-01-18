import { Control, controlsUtils } from 'fabric';
import {
  changeCropHeight,
  changeCropWidth,
  changeCropX,
  changeCropY,
  ghostScalePositionHandler,
  scaleEquallyCropGenerator,
} from './croppingHandlers';
import { renderCornerControl, renderEdgeControl } from './controlRendering';

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
  // cropping image - edge controls
  mlc: new Control({
    x: -0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 20,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropX,
    getActionName: cropActionName,
  }),

  mrc: new Control({
    x: 0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 20,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropWidth,
    getActionName: cropActionName,
  }),

  mbc: new Control({
    x: 0,
    y: 0.5,
    angle: 0,
    sizeX: 20,
    sizeY: 8,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropHeight,
    getActionName: cropActionName,
  }),

  mtc: new Control({
    x: 0,
    y: -0.5,
    angle: 0,
    sizeX: 20,
    sizeY: 8,
    render: renderEdgeControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropY,
    getActionName: cropActionName,
  }),

  // cropping image - corner controls
  tlc: new Control({
    angle: 0,
    x: -0.5,
    y: -0.5,
    sizeX: 12,
    sizeY: 8,
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
    sizeX: 12,
    sizeY: 8,
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
    sizeX: 12,
    sizeY: 8,
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
    sizeX: 12,
    sizeY: 8,
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
