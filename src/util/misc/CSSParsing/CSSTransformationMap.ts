import { Shadow } from '../../../Shadow';
import type { FabricObject } from '../../../shapes/Object/FabricObject';
import { numberRestorer, colorTransformer } from './util';
import { CSSTransformConfigMap } from './types';

export const CSSTransformationMap: CSSTransformConfigMap<
  FabricObject,
  | 'fill'
  | 'stroke'
  | 'backgroundColor'
  | 'visible'
  | 'fillRule'
  | 'paintFirst'
  | 'opacity'
  | 'strokeWidth'
  | 'strokeDashArray'
  | 'strokeDashOffset'
  | 'strokeLineJoin'
  | 'strokeMiterLimit'
  | 'strokeLineCap'
  | 'shadow'
> = {
  visible: {
    key: 'visibility',
    transformValue: (value) => (!value ? 'hidden' : ''),
    restoreValue: (value) => (value === 'hidden' ? false : undefined),
  },
  opacity: {
    key: 'opacity',
    transformValue: (value = 1) => value,
    restoreValue: numberRestorer,
  },
  fill: {
    key: 'color',
    transform: colorTransformer,
  },
  stroke: {
    transform: colorTransformer,
  },
  backgroundColor: {
    key: 'background',
    transform: colorTransformer,
  },
  fillRule: {
    key: 'fill-rule',
    transformValue: (value = 'nonzero') => value,
  },
  paintFirst: {
    key: 'paint-order',
    transformValue: (value = 'fill') => value,
  },
  strokeWidth: {
    key: 'stroke-width',
    transformValue: (value = 0) => value,
    restoreValue: numberRestorer,
  },
  strokeDashArray: {
    key: 'stroke-dasharray',
    transformValue: (value) => (value ? value.join(' ') : 'none'),
    restoreValue: (value) =>
      value ? value.split(' ').map(Number.parseFloat) : null,
  },
  strokeDashOffset: {
    key: 'stroke-dashoffset',
    transformValue: (value = 0) => value,
    restoreValue: numberRestorer,
  },
  strokeLineJoin: {
    key: 'stroke-linejoin',
    transformValue: (value = 'miter') => value,
  },
  strokeMiterLimit: {
    key: 'stroke-miterlimit',
    transformValue: (value = 4) => value,
  },
  strokeLineCap: {
    key: 'stroke-linecap',
    transformValue: (value = 'butt') => value,
  },
  shadow: {
    key: 'filter',
    transformValue: (value) =>
      value
        ? `drop-shadow(${value.offsetX}px ${value.offsetY}px ${value.blur}px ${value.color})`
        : '',
    restoreValue: (value) => {
      if (!value) return null;
      const [offsetX, offsetY, blur, color] = value.split(/\(|\)|px /g);
      // TODO: classRegistry
      return new Shadow({
        offsetX: Number.parseFloat(offsetX),
        offsetY: Number.parseFloat(offsetY),
        blur: Number.parseFloat(blur),
        color,
      });
    },
  },
};
