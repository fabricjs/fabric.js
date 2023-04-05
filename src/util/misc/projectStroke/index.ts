import { XY } from '../../../Point';
import { StrokeLineCapProjections } from './StrokeLineCapProjections';
import { StrokeLineJoinProjections } from './StrokeLineJoinProjections';
import { TProjection, TProjectStrokeOnPointsOptions } from './types';

/**
 *
 * Used to calculate object's bounding box
 *
 * @see https://github.com/fabricjs/fabric.js/pull/8344
 *
 */
export const projectStrokeOnPoints = (
  points: XY[],
  options: TProjectStrokeOnPointsOptions,
  openPath = false
): TProjection[] => {
  const projections: TProjection[] = [];

  if (points.length <= 1) {
    return projections;
  }

  points.forEach((A, index) => {
    let B: XY, C: XY;
    if (index === 0) {
      C = points[1];
      B = openPath ? A : points[points.length - 1];
    } else if (index === points.length - 1) {
      B = points[index - 1];
      C = openPath ? A : points[0];
    } else {
      B = points[index - 1];
      C = points[index + 1];
    }

    if (openPath && (index === 0 || index === points.length - 1)) {
      projections.push(
        ...new StrokeLineCapProjections(
          A,
          index === 0 ? C : B,
          options
        ).project()
      );
    } else {
      projections.push(
        ...new StrokeLineJoinProjections(A, B, C, options).project()
      );
    }
  });

  return projections;
};
