import { GradientType, GradientUnit } from "../typedefs";

export function parseType(el: SVGGradientElement): GradientType {
  return el.nodeName === 'linearGradient' || el.nodeName === 'LINEARGRADIENT' ?
    'linear' :
    'radial'
}

export function parseGradientUnits(el: SVGGradientElement): GradientUnit {
  return el.getAttribute('gradientUnits') === 'userSpaceOnUse' ?
    'pixels' :
    'percentage';
}