
export function parseType(el) {
  return el.nodeName === 'linearGradient' || el.nodeName === 'LINEARGRADIENT' ?
    'linear' :
    'radial'
}

export function getLinearCoords(el) {
  return {
    x1: el.getAttribute('x1') || 0,
    y1: el.getAttribute('y1') || 0,
    x2: el.getAttribute('x2') || '100%',
    y2: el.getAttribute('y2') || 0
  };
}

export function getRadialCoords(el) {
  return {
    x1: el.getAttribute('fx') || el.getAttribute('cx') || '50%',
    y1: el.getAttribute('fy') || el.getAttribute('cy') || '50%',
    r1: 0,
    x2: el.getAttribute('cx') || '50%',
    y2: el.getAttribute('cy') || '50%',
    r2: el.getAttribute('r') || '50%'
  };
}

export function parseCoords(el) {
  return parseType(el) === 'linear' ? getLinearCoords(el) : getRadialCoords(el)
}