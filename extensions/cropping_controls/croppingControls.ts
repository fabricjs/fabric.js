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
  withFlip,
} from './croppingHandlers';
import {
  renderCornerControl,
  renderRoundedSegmentControl,
  shouldActivateCorner,
} from './controlRendering';

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
    angle: 90,
    sizeX: 8,
    sizeY: 16,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: withFlip(changeCropX, changeCropWidth, 'flipX'),
    getActionName: cropActionName,
  }),

  mrc: new Control({
    x: 0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 16,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: withFlip(changeCropWidth, changeCropX, 'flipX'),
    getActionName: cropActionName,
  }),

  mbc: new Control({
    x: 0,
    y: 0.5,
    angle: 0,
    sizeX: 16,
    sizeY: 8,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: withFlip(changeCropHeight, changeCropY, 'flipY'),
    getActionName: cropActionName,
  }),

  mtc: new Control({
    x: 0,
    y: -0.5,
    angle: 0,
    sizeX: 16,
    sizeY: 8,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: withFlip(changeCropY, changeCropHeight, 'flipY'),
    getActionName: cropActionName,
  }),

  tlc: new Control({
    angle: 0,
    x: -0.5,
    y: -0.5,
    sizeX: 12,
    sizeY: 8,
    render: renderCornerControl,
    shouldActivate: shouldActivateCorner,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const [, transform] = args;
      const target = transform.target as FabricImage;
      const xResult = (target.flipX ? changeCropWidth : changeCropX)(...args);
      const yResult = (target.flipY ? changeCropHeight : changeCropY)(...args);
      return xResult || yResult;
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
    shouldActivate: shouldActivateCorner,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const [, transform] = args;
      const target = transform.target as FabricImage;
      const xResult = (target.flipX ? changeCropX : changeCropWidth)(...args);
      const yResult = (target.flipY ? changeCropHeight : changeCropY)(...args);
      return xResult || yResult;
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
    shouldActivate: shouldActivateCorner,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const [, transform] = args;
      const target = transform.target as FabricImage;
      const xResult = (target.flipX ? changeCropWidth : changeCropX)(...args);
      const yResult = (target.flipY ? changeCropY : changeCropHeight)(...args);
      return xResult || yResult;
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
    shouldActivate: shouldActivateCorner,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: (...args) => {
      const [, transform] = args;
      const target = transform.target as FabricImage;
      const xResult = (target.flipX ? changeCropX : changeCropWidth)(...args);
      const yResult = (target.flipY ? changeCropY : changeCropHeight)(...args);
      return xResult || yResult;
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
    sizeY: 16,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeWidth,
    getActionName: edgeActionName,
  }),

  mre: new Control({
    x: 0.5,
    y: 0,
    angle: 90,
    sizeX: 8,
    sizeY: 16,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeWidth,
    getActionName: edgeActionName,
  }),

  mte: new Control({
    x: 0,
    y: -0.5,
    angle: 0,
    sizeX: 16,
    sizeY: 8,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeHeight,
    getActionName: edgeActionName,
  }),

  mbe: new Control({
    x: 0,
    y: 0.5,
    angle: 0,
    sizeX: 16,
    sizeY: 8,
    render: renderRoundedSegmentControl,
    cursorStyleHandler: scaleCursorStyleHandler,
    actionHandler: changeEdgeHeight,
    getActionName: edgeActionName,
  }),
});
