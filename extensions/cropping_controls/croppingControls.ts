import { Control, controlsUtils } from 'fabric';
import {
  changeCropHeight,
  changeCropWidth,
  changeCropX,
  changeCropY,
  ghostScalePositionHandler,
} from './croppingHandlers';
import { renderCornerControl } from './renderCornerControl';

const { scaleCursorStyleHandler } = controlsUtils;

const cropActionName = () => 'crop';
// use this function if you want to generate new controls for every instance
export const createImageCroppingControls = () => ({
  tls: new Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
  }),
  brs: new Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
  }),
  trs: new Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
  }),
  bl: new Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: scaleCursorStyleHandler,
    positionHandler: ghostScalePositionHandler,
  }),
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
