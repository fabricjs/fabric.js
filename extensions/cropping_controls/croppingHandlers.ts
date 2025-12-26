import type { TModificationEvents } from 'fabric';
import {
  controlsUtils,
  type TransformActionHandler,
  type FabricImage,
} from 'fabric';

const { wrapWithFixedAnchor, wrapWithFireEvent } = controlsUtils;

/**
 * Wrap controlsUtils.changeObjectWidth with image constrains
 */
export const changeImageWidth: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const { width } = target;
  const image = target as FabricImage;
  const modified = controlsUtils.changeObjectWidth(eventData, transform, x, y);
  const availableWidth = image._element.width - image.cropX;
  if (modified) {
    if (image.width > availableWidth) {
      image.width = availableWidth;
    }
    if (image.width < 0) {
      image.width = 1;
    }
  }
  return width != image.width;
};

export const changeCropWidth = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageWidth),
);

/**
 * Wrap controlsUtils.changeObjectHeight with image constrains
 */
export const changeImageHeight: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const { height } = target;
  const image = target as FabricImage;
  const modified = controlsUtils.changeObjectHeight(eventData, transform, x, y);
  const availableHeight = image._element.height - image.cropY;
  if (modified) {
    if (image.height > availableHeight) {
      image.height = availableHeight;
    }
    if (image.height < 0) {
      image.height = 1;
    }
  }
  return height != image.height;
};

export const changeCropHeight = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageHeight),
);

export const changeImageCropX: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const image = target as FabricImage;
  const { width, cropX } = image;
  const modified = controlsUtils.changeObjectWidth(eventData, transform, x, y);
  let newCropX = cropX + width - image.width;
  image.width = width;
  if (modified) {
    if (newCropX < 0) {
      newCropX = 0;
    }
    if (newCropX + image.width > image._element.width) {
      newCropX = image._element.width - image.width;
    }
    image.cropX = newCropX;
    // calculate new width on the base of how much crop we have now
    image.width += cropX - newCropX;
  }
  return newCropX != cropX;
};

export const changeImageCropY: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target } = transform;
  const image = target as FabricImage;
  const { height, cropY } = image;
  const modified = controlsUtils.changeObjectHeight(eventData, transform, x, y);
  let newCropY = cropY + height - image.height;
  image.height = height;
  if (modified) {
    if (newCropY < 0) {
      newCropY = 0;
    }
    if (newCropY + image.height > image._element.height) {
      newCropY = image._element.height - image.height;
    }
    image.cropY = newCropY;
    image.height += cropY - newCropY;
  }
  return newCropY != cropY;
};

export const changeCropX = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageCropX),
);

export const changeCropY = wrapWithFireEvent(
  'CROPPING' as TModificationEvents,
  wrapWithFixedAnchor(changeImageCropY),
);

export const dragTransformHandler: TransformActionHandler = (
  eventData,
  transform,
  x,
  y,
) => {
  const { target, offsetX, offsetY } = transform;
  const cropX = x - offsetX,
    cropY = y - offsetY;

  const moved =
    (target as FabricImage).cropX !== cropX ||
    (target as FabricImage).cropY !== cropY;
  target.set({ cropX, cropY });
  return moved;
};
