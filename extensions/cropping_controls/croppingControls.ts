import { Control, controlsUtils } from 'fabric';
import {
  changeCropHeight,
  changeCropWidth,
  changeCropX,
  changeCropY,
} from './croppingHandlers';
import { renderCornerControl } from './renderCornerControl';

const { scaleCursorStyleHandler } = controlsUtils;

const cropActionName = () => 'crop';
// use this function if you want to generate new controls for every instance
export const createImageCroppingControls = () => ({
  ml: new Control({
    x: -0.5,
    y: 0,
    sizeX: 4,
    sizeY: 20,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropX,
    getActionName: cropActionName,
  }),

  mr: new Control({
    x: 0.5,
    y: 0,
    sizeX: 4,
    sizeY: 20,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropWidth,
    getActionName: cropActionName,
  }),

  mb: new Control({
    x: 0,
    y: 0.5,
    sizeX: 20,
    sizeY: 4,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropHeight,
    getActionName: cropActionName,
  }),

  mt: new Control({
    x: 0,
    y: -0.5,
    sizeX: 20,
    sizeY: 4,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeCropY,
    getActionName: cropActionName,
  }),

  tl: new Control({
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

  tr: new Control({
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

  bl: new Control({
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

  br: new Control({
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
