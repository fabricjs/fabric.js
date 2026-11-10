import { describe, it, expect } from 'vitest';
import { Rect } from '../Rect';
import { Point } from '../../Point';
import { Control } from '../../controls/Control';
import { getLocalPoint } from '../../controls';

describe('fabric.ObjectOrigins', () => {
  const rectOptions = {
    originX: 'left',
    originY: 'top',
    left: 35,
    top: 45,
    width: 20,
    height: 40,
    fill: 'rgb(0,0,0)',
    strokeWidth: 2,
    angle: 0,
    scaleX: 2,
    scaleY: 2,
  } as const;

  function normalizePoint(
    target: Rect,
    point: Point,
    originX?: string | number,
    originY?: string | number,
  ) {
    target.controls = {
      test: new Control({
        offsetX: 0,
        offsetY: 0,
      }),
    };
    return getLocalPoint(
      // @ts-expect-error -- partial of Transform
      { target, corner: 'test' },
      originX,
      originY,
      point.x,
      point.y,
    );
  }

  it('getCenterPoint', () => {
    const rect = new Rect(rectOptions);
    const p = rect.getCenterPoint();
    expect(p).toEqual(new Point(57, 87));
  });

  it('translateToCenterPoint', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = rect.translateToCenterPoint(point, 'center', 'center');
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'center');
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    expect(p).toEqual(new Point(15, 62));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    expect(p).toEqual(new Point(15, -22));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    expect(p).toEqual(new Point(37, 20));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    expect(p).toEqual(new Point(37, 62));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    expect(p).toEqual(new Point(37, -22));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    expect(p).toEqual(new Point(-7, 20));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    expect(p).toEqual(new Point(-7, 62));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    expect(p).toEqual(new Point(-7, -22));
  });

  it('translateToCenterPointRotated', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 'center', 'center');
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 'center', 'top');
    expect(p).toEqual(new Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 'center', 'bottom');
    expect(p).toEqual(new Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 'left', 'center');
    expect(p).toEqual(new Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 'left', 'top');
    expect(p).toEqual(new Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 'left', 'bottom');
    expect(p).toEqual(new Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 'right', 'center');
    expect(p).toEqual(new Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 'right', 'top');
    expect(p).toEqual(new Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 'right', 'bottom');
    expect(p).toEqual(new Point(21.068865352386116, -27.02306745986067));
  });

  it('translateToOriginPoint', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = rect.translateToOriginPoint(point, 'center', 'center');
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    expect(p).toEqual(new Point(15, -22));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    expect(p).toEqual(new Point(15, 62));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    expect(p).toEqual(new Point(-7, 20));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    expect(p).toEqual(new Point(-7, -22));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    expect(p).toEqual(new Point(-7, 62));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    expect(p).toEqual(new Point(37, 20));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    expect(p).toEqual(new Point(37, -22));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    expect(p).toEqual(new Point(37, 62));
  });

  it('translateToOriginPointRotated', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 'center', 'center');
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToOriginPoint(point, 'center', 'top');
    expect(p).toEqual(new Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 'center', 'bottom');
    expect(p).toEqual(new Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 'left', 'center');
    expect(p).toEqual(new Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 'left', 'top');
    expect(p).toEqual(new Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 'left', 'bottom');
    expect(p).toEqual(new Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 'right', 'center');
    expect(p).toEqual(new Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 'right', 'top');
    expect(p).toEqual(new Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 'right', 'bottom');
    expect(p).toEqual(new Point(8.931134647613884, 67.02306745986067));
  });

  it('getLocalPoint', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = normalizePoint(rect, point, 'center', 'center');
    expect(p).toEqual(new Point(-42, -67));

    p = normalizePoint(rect, point, 'center', 'top');
    expect(p).toEqual(new Point(-42, -25));

    p = normalizePoint(rect, point, 'center', 'bottom');
    expect(p).toEqual(new Point(-42, -109));

    p = normalizePoint(rect, point, 'left', 'center');
    expect(p).toEqual(new Point(-20, -67));

    p = normalizePoint(rect, point, 'left', 'top');
    expect(p).toEqual(new Point(-20, -25));

    p = normalizePoint(rect, point, 'left', 'bottom');
    expect(p).toEqual(new Point(-20, -109));

    p = normalizePoint(rect, point, 'right', 'center');
    expect(p).toEqual(new Point(-64, -67));

    p = normalizePoint(rect, point, 'right', 'top');
    expect(p).toEqual(new Point(-64, -25));

    p = normalizePoint(rect, point, 'right', 'bottom');
    expect(p).toEqual(new Point(-64, -109));

    p = normalizePoint(rect, point);
    expect(p).toEqual(new Point(-20, -25));
  });

  it('getLocalPoint rotated', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = normalizePoint(rect, point, 'center', 'center');
    expect(p).toEqual(new Point(-52.72245179455599, -51.00727238020387));

    p = normalizePoint(rect, point, 'center', 'top');
    expect(p).toEqual(new Point(-52.72245179455599, -9.007272380203872));

    p = normalizePoint(rect, point, 'center', 'bottom');
    expect(p).toEqual(new Point(-52.72245179455599, -93.00727238020387));

    p = normalizePoint(rect, point, 'left', 'center');
    expect(p).toEqual(new Point(-30.722451794555987, -51.00727238020387));

    p = normalizePoint(rect, point, 'left', 'top');
    expect(p).toEqual(new Point(-30.722451794555987, -9.007272380203872));

    p = normalizePoint(rect, point, 'left', 'bottom');
    expect(p).toEqual(new Point(-30.722451794555987, -93.00727238020387));

    p = normalizePoint(rect, point, 'right', 'center');
    expect(p).toEqual(new Point(-74.722451794556, -51.00727238020387));

    p = normalizePoint(rect, point, 'right', 'top');
    expect(p).toEqual(new Point(-74.722451794556, -9.007272380203872));

    p = normalizePoint(rect, point, 'right', 'bottom');
    expect(p).toEqual(new Point(-74.722451794556, -93.00727238020387));

    p = normalizePoint(rect, point);
    expect(p).toEqual(new Point(-58.791317146942106, -3.9842049203432026));
  });

  it('translateToCenterPoint with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    expect(p).toEqual(new Point(15, 62));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    expect(p).toEqual(new Point(15, -22));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    expect(p).toEqual(new Point(37, 20));

    p = rect.translateToCenterPoint(point, 0, 0);
    expect(p).toEqual(new Point(37, 62));

    p = rect.translateToCenterPoint(point, 0, 1);
    expect(p).toEqual(new Point(37, -22));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    expect(p).toEqual(new Point(-7, 20));

    p = rect.translateToCenterPoint(point, 1, 0);
    expect(p).toEqual(new Point(-7, 62));

    p = rect.translateToCenterPoint(point, 1, 1);
    expect(p).toEqual(new Point(-7, -22));
  });

  it('translateToCenterPointRotated with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = rect.translateToCenterPoint(point, 0.5, 0.5);
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToCenterPoint(point, 0.5, 0);
    expect(p).toEqual(new Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToCenterPoint(point, 0.5, 1);
    expect(p).toEqual(new Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToCenterPoint(point, 0, 0.5);
    expect(p).toEqual(new Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToCenterPoint(point, 0, 0);
    expect(p).toEqual(new Point(8.931134647613884, 67.02306745986067));

    p = rect.translateToCenterPoint(point, 0, 1);
    expect(p).toEqual(new Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToCenterPoint(point, 1, 0.5);
    expect(p).toEqual(new Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToCenterPoint(point, 1, 0);
    expect(p).toEqual(new Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToCenterPoint(point, 1, 1);
    expect(p).toEqual(new Point(21.068865352386116, -27.02306745986067));
  });

  it('translateToOriginPoint with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    expect(p).toEqual(new Point(15, -22));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    expect(p).toEqual(new Point(15, 62));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    expect(p).toEqual(new Point(-7, 20));

    p = rect.translateToOriginPoint(point, 0, 0);
    expect(p).toEqual(new Point(-7, -22));

    p = rect.translateToOriginPoint(point, 0, 1);
    expect(p).toEqual(new Point(-7, 62));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    expect(p).toEqual(new Point(37, 20));

    p = rect.translateToOriginPoint(point, 1, 0);
    expect(p).toEqual(new Point(37, -22));

    p = rect.translateToOriginPoint(point, 1, 1);
    expect(p).toEqual(new Point(37, 62));
  });

  it('translateToOriginPointRotated with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = rect.translateToOriginPoint(point, 0.5, 0.5);
    expect(p).toEqual(new Point(15, 20));

    p = rect.translateToOriginPoint(point, 0.5, 0);
    expect(p).toEqual(new Point(39.090210326743936, -14.404385860137658));

    p = rect.translateToOriginPoint(point, 0.5, 1);
    expect(p).toEqual(new Point(-9.090210326743936, 54.40438586013766));

    p = rect.translateToOriginPoint(point, 0, 0.5);
    expect(p).toEqual(new Point(-3.0213449743578202, 7.381318400276987));

    p = rect.translateToOriginPoint(point, 0, 0);
    expect(p).toEqual(new Point(21.068865352386116, -27.02306745986067));

    p = rect.translateToOriginPoint(point, 0, 1);
    expect(p).toEqual(new Point(-27.11155530110176, 41.78570426041465));

    p = rect.translateToOriginPoint(point, 1, 0.5);
    expect(p).toEqual(new Point(33.02134497435782, 32.61868159972301));

    p = rect.translateToOriginPoint(point, 1, 0);
    expect(p).toEqual(new Point(57.11155530110176, -1.7857042604146471));

    p = rect.translateToOriginPoint(point, 1, 1);
    expect(p).toEqual(new Point(8.931134647613884, 67.02306745986067));
  });

  it('normalizePoint with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);

    p = normalizePoint(rect, point, 0.5, 0.5);
    expect(p).toEqual(new Point(-42, -67));

    p = normalizePoint(rect, point, 0.5, 0);
    expect(p).toEqual(new Point(-42, -25));

    p = normalizePoint(rect, point, 0.5, 1);
    expect(p).toEqual(new Point(-42, -109));

    p = normalizePoint(rect, point, 0, 0.5);
    expect(p).toEqual(new Point(-20, -67));

    p = normalizePoint(rect, point, 0, 0);
    expect(p).toEqual(new Point(-20, -25));

    p = normalizePoint(rect, point, 0, 1);
    expect(p).toEqual(new Point(-20, -109));

    p = normalizePoint(rect, point, 1, 0.5);
    expect(p).toEqual(new Point(-64, -67));

    p = normalizePoint(rect, point, 1, 0);
    expect(p).toEqual(new Point(-64, -25));

    p = normalizePoint(rect, point, 1, 1);
    expect(p).toEqual(new Point(-64, -109));

    p = normalizePoint(rect, point);
    expect(p).toEqual(new Point(-20, -25));
  });

  it('toLocalPointRotated with numeric origins', () => {
    const rect = new Rect(rectOptions);
    let p;
    const point = new Point(15, 20);
    rect.angle = 35;

    p = normalizePoint(rect, point, 0.5, 0.5);
    expect(p).toEqual(new Point(-52.72245179455599, -51.00727238020387));

    p = normalizePoint(rect, point, 0.5, 0);
    expect(p).toEqual(new Point(-52.72245179455599, -9.007272380203872));

    p = normalizePoint(rect, point, 0.5, 1);
    expect(p).toEqual(new Point(-52.72245179455599, -93.00727238020387));

    p = normalizePoint(rect, point, 0, 0.5);
    expect(p).toEqual(new Point(-30.722451794555987, -51.00727238020387));

    p = normalizePoint(rect, point, 0, 0);
    expect(p).toEqual(new Point(-30.722451794555987, -9.007272380203872));

    p = normalizePoint(rect, point, 0, 1);
    expect(p).toEqual(new Point(-30.722451794555987, -93.00727238020387));

    p = normalizePoint(rect, point, 1, 0.5);
    expect(p).toEqual(new Point(-74.722451794556, -51.00727238020387));

    p = normalizePoint(rect, point, 1, 0);
    expect(p).toEqual(new Point(-74.722451794556, -9.007272380203872));

    p = normalizePoint(rect, point, 1, 1);
    expect(p).toEqual(new Point(-74.722451794556, -93.00727238020387));

    p = normalizePoint(rect, point);
    expect(p).toEqual(new Point(-58.791317146942106, -3.9842049203432026));
  });
});
