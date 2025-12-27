import { type FabricImage, type TPointerEventInfo } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import { cropPanMoveHandler } from './croppingHandlers';
/**
 * Coordinates the change to image to enter crop mode and returns
 * a function to exit crop mode
 */
export const enterCropMode = function enterCropMode(
  this: (args: TPointerEventInfo) => void,
  { target }: TPointerEventInfo,
) {
  const fabricImage = target as FabricImage;
  const { controls } = fabricImage;
  fabricImage.controls = createImageCroppingControls();
  fabricImage.on('moving', cropPanMoveHandler);
  fabricImage.setCoords();
  const exitCropMode = () => {
    fabricImage.off('moving', cropPanMoveHandler);
    fabricImage.controls = controls;
    fabricImage.setCoords();
    fabricImage.once('mousedblclick', enterCropMode);
    fabricImage.canvas?.requestRenderAll();
  };
  fabricImage.once('mousedblclick', exitCropMode);
  fabricImage.canvas?.requestRenderAll();
};
