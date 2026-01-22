import { type FabricImage, type TPointerEventInfo, type Canvas } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import { cropPanMoveHandler, renderGhostImage } from './croppingHandlers';

type CropModeImage = FabricImage & {
  _cropModeState?: {
    controls: FabricImage['controls'];
    padding: number;
    exitCropMode: () => void;
    onDeselect: () => void;
  };
};

/**
 * Coordinates the change to image to enter crop mode and returns
 * a function to exit crop mode
 */
export const enterCropMode = function enterCropMode(
  this: (args: TPointerEventInfo) => void,
  { target }: TPointerEventInfo,
) {
  const fabricImage = target as CropModeImage;
  if (fabricImage._cropModeState) return;

  const canvas = fabricImage.canvas as Canvas | undefined;
  const { controls, padding } = fabricImage;

  const exitCropMode = () => {
    if (!fabricImage._cropModeState) return;
    fabricImage.off('mousedblclick', exitCropMode);
    fabricImage.off('moving', cropPanMoveHandler);
    fabricImage.off('before:render', renderGhostImage);
    fabricImage.controls = controls;
    fabricImage.padding = padding;
    fabricImage.setCoords();
    canvas?.off('selection:cleared', onDeselect);
    canvas?.off('selection:updated', onDeselect);
    fabricImage._cropModeState = undefined;
    fabricImage.once('mousedblclick', enterCropMode);
    fabricImage.canvas?.requestRenderAll();
  };

  const onDeselect = () => {
    if (canvas?.getActiveObject() !== fabricImage) {
      exitCropMode();
    }
  };

  fabricImage._cropModeState = { controls, padding, exitCropMode, onDeselect };
  fabricImage.padding = 0;
  fabricImage.controls = createImageCroppingControls();
  fabricImage.on('moving', cropPanMoveHandler);
  fabricImage.on('before:render', renderGhostImage);
  fabricImage.setCoords();
  fabricImage.once('mousedblclick', exitCropMode);
  canvas?.on('selection:cleared', onDeselect);
  canvas?.on('selection:updated', onDeselect);
  fabricImage.canvas?.requestRenderAll();
};
