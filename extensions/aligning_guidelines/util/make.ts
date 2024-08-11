import type { HorizontalLineProps, VerticalLineProps } from '../typedefs';
import { aligningLineConfig } from '../constant';

export function makeVerticalLine(props: VerticalLineProps) {
  const aligningLineOffset = aligningLineConfig.offset;
  const { x, objectHeight, objectY, activeObjectHeight, activeObjectY } = props;
  const b = objectY < activeObjectY;
  return {
    x,
    y1: b
      ? objectY - objectHeight / 2 - aligningLineOffset
      : objectY + objectHeight / 2 + aligningLineOffset,
    y2: b
      ? activeObjectY + activeObjectHeight / 2 + aligningLineOffset
      : activeObjectY - activeObjectHeight / 2 - aligningLineOffset,
  };
}

export function makeHorizontalLine(props: HorizontalLineProps) {
  const aligningLineOffset = aligningLineConfig.offset;
  const { y, objectX, objectWidth, activeObjectX, activeObjectWidth } = props;
  const b = objectX < activeObjectX;
  return {
    y,
    x1: b
      ? objectX - objectWidth / 2 - aligningLineOffset
      : objectX + objectWidth / 2 + aligningLineOffset,
    x2: b
      ? activeObjectX + activeObjectWidth / 2 + aligningLineOffset
      : activeObjectX - activeObjectWidth / 2 - aligningLineOffset,
  };
}
