import type { Polyline, XY } from 'fabric';

export type TestSpec = {
  type: 'polyline' | 'polygon';
  test: string;
  points: XY[];
  group?: boolean;
  options: Partial<
    Pick<
      Polyline,
      | 'strokeUniform'
      | 'skewX'
      | 'skewY'
      | 'strokeLineCap'
      | 'strokeLineJoin'
      | 'strokeMiterLimit'
    >
  >;
};

export const toTestName = ({
  type,
  test,
  group,
  options: {
    strokeLineCap,
    strokeLineJoin,
    strokeMiterLimit,
    strokeUniform,
    skewX,
    skewY,
  },
}: TestSpec) =>
  `${test} for ${type} ${group ? 'in group ' : ''}with ${
    strokeUniform ? 'strokeUniform ' : ''
  }${strokeLineCap ? `strokeLineCap='${strokeLineCap}' ` : ''}${
    strokeLineJoin ? `strokeLineJoin='${strokeLineJoin}' ` : ''
  }${strokeMiterLimit ? `strokeMiterLimit='${strokeMiterLimit}' ` : ''}${
    skewX || skewY ? `skew(${skewX}, ${skewY})` : ''
  }`;

export const toKeyName = (spec: TestSpec) =>
  toTestName(spec).replaceAll(/\s|'|=/g, '');
