import { type FabricImage, type TPointerEventInfo } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import { cropPanMoveHandler, renderGhostImage } from './croppingHandlers';
/**
 * Coordinates the change to image to enter crop mode and returns
 * a function to exit crop mode
 */
export const enterCropMode = function enterCropMode(
  this: (args: TPointerEventInfo) => void,
  { target }: TPointerEventInfo,
) {
  const fabricImage = target as FabricImage;
  const { controls, padding } = fabricImage;
  fabricImage.padding = 0;
  fabricImage.controls = createImageCroppingControls();
  fabricImage.on('moving', cropPanMoveHandler);
  fabricImage.on('before:render', renderGhostImage);
  fabricImage.setCoords();
  const exitCropMode = () => {
    fabricImage.padding = padding;
    fabricImage.off('moving', cropPanMoveHandler);
    fabricImage.off('before:render', renderGhostImage);
    fabricImage.controls = controls;
    fabricImage.setCoords();
    fabricImage.once('mousedblclick', enterCropMode);
    fabricImage.canvas?.requestRenderAll();
  };
  fabricImage.once('mousedblclick', exitCropMode);
  fabricImage.canvas?.requestRenderAll();
};
