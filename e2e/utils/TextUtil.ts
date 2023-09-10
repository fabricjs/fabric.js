import { ObjectUtil } from './ObjectUtil';
import type { IText, Point } from 'fabric';

export class TextUtil<T extends IText = IText> extends ObjectUtil<T> {
  async getCanvasCursorPositionAt(index: number): Promise<Point> {
    return this.executeInBrowser(
      (object, { index }) => {
        const { left, top, topOffset, leftOffset } =
          object._getCursorBoundaries(index, true);
        // add extra 10 pixels to avoid controls
        const point = new fabric.Point(
          left + leftOffset + 10,
          top + topOffset + 10
        );

        const t = point.transform(object.calcTransformMatrix());
        return t;
      },
      { index }
    );
  }
}
