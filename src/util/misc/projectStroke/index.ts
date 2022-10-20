import { IPoint, Point } from '../../../point.class';
import { findRight } from '../../internals/findRight';
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
  points: IPoint[],
  options: TProjectStrokeOnPointsOptions,
  openPath = false
): TProjection[] => {
  const projections: TProjection[] = [];

  if (points.length === 0) {
    return projections;
  }

  const reduced = points.reduce(
    (reduced, point) => {
      if (!reduced[reduced.length - 1].eq(point)) {
        reduced.push(new Point(point));
      }
      return reduced;
    },
    [new Point(points[0])]
  );

  if (reduced.length === 1) {
    openPath = true;
  }

  reduced.forEach((A, index, points) => {
    let B: IPoint, C: IPoint;
    if (index === 0) {
      C = points[1];
      B = openPath
        ? A
        : // we search for the last point that affects the projection
          // this is important in case there are points at the end that are equal to the first point
          findRight(points, (point) => !point.eq(A)) || A;
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
