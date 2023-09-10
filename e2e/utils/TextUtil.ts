import { ObjectUtil } from './ObjectUtil';
import type { IText, Point } from 'fabric';

export class TextUtil<T extends IText = IText> extends ObjectUtil<T> {
  async getCanvasCursorPositionAt(index: number): Promise<Point> {
    return this.executeInBrowser(
      (object, { index }) => {
        // should i consider topOffset, leftOffset
        const { left, top, topOffset, leftOffset } =
          object._getCursorBoundaries(index, true);
        // add extra 5 pixels
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
