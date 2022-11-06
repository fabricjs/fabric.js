import { TAxis, TAxisKey } from '../typedefs';

export const AXIS_KEYS: Record<
  TAxis,
  {
    counterAxis: TAxis;
    scale: TAxisKey<'scale'>;
    skew: TAxisKey<'skew'>;
    lockSkewing: TAxisKey<'lockSkewing'>;
    origin: TAxisKey<'origin'>;
    flip: TAxisKey<'flip'>;
    size: 'width' | 'height';
  }
> = {
  x: {
    counterAxis: 'y',
    scale: 'scaleX',
    skew: 'skewX',
    lockSkewing: 'lockSkewingX',
    origin: 'originX',
    flip: 'flipX',
    size: 'width',
  },
  y: {
    counterAxis: 'x',
    scale: 'scaleY',
    skew: 'skewY',
    lockSkewing: 'lockSkewingY',
    origin: 'originY',
    flip: 'flipY',
    size: 'height',
  },
};
