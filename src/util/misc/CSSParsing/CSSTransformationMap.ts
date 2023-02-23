import { Shadow } from '../../../Shadow';
import type { FabricObject } from '../../../shapes/Object/FabricObject';
import { numberRestorer, colorTransformer, colorRestorer } from './util';
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
    transformValue: (value = 1) => value,
    restoreValue: numberRestorer,
  },
  fill: {
    key: 'fill',
    transformValue: colorTransformer,
    restoreValue: colorRestorer,
  },
  stroke: {
    transformValue: colorTransformer,
    restoreValue: colorRestorer,
  },
  backgroundColor: {
    key: 'background',
    transformValue: colorTransformer,
    restoreValue: colorRestorer,
  },
  fillRule: {
    key: 'fill-rule',
  },
  paintFirst: {
    key: 'paint-order',
  },
  strokeWidth: {
    key: 'stroke-width',
    restoreValue: numberRestorer,
  },
  strokeDashArray: {
    key: 'stroke-dasharray',
    transformValue: (value) => (value ? value.join(' ') : 'none'),
    restoreValue: (value) =>
      value && value !== 'none'
        ? value.split(' ').map(Number.parseFloat)
        : null,
  },
  strokeDashOffset: {
    key: 'stroke-dashoffset',
    transformValue: (value = 0) => value,
    restoreValue: numberRestorer,
  },
  strokeLineJoin: {
    key: 'stroke-linejoin',
  },
  strokeMiterLimit: {
    key: 'stroke-miterlimit',
  },
  strokeLineCap: {
    key: 'stroke-linecap',
  },
  shadow: {
    key: 'filter',
    transformValue: (value) =>
      value
        ? `drop-shadow(${value.offsetX}px ${value.offsetY}px ${value.blur}px ${value.color})`
        : '',
    restoreValue: (value) => {
      if (!value || value === 'none') return null;
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
