import { FILL, STROKE } from '../constants';

/**
 * Attributes parsed from all SVG elements
 * @type array
 */
export const SHARED_ATTRIBUTES = [
  'display',
  'transform',
  FILL,
  'fill-opacity',
  'fill-rule',
  'opacity',
  STROKE,
  'stroke-dasharray',
  'stroke-linecap',
  'stroke-dashoffset',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'id',
  'paint-order',
  'vector-effect',
  'instantiated_by_use',
  'clip-path',
];
