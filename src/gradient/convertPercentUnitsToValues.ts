
const RE_PERCENT = /^(\d+\.\d+)%|(\d+)%$/;

export function convertPercentUnitsToValues(values, svgOptions, gradientUnits) {
  let finalValue;
  return Object.keys(values).reduce((acc, prop) => {
    const propValue = values[prop];
    if (propValue === 'Infinity') {
      finalValue = 1;
    }
    else if (propValue === '-Infinity') {
      finalValue = 0;
    }
    else {
      finalValue = parseFloat(values[prop], 10);
      if (typeof propValue === 'string' && RE_PERCENT.test(propValue)) {
        finalValue *= 0.01;
        if (gradientUnits === 'pixels') {
          // then we need to fix those percentages here in svg parsing
          if (prop === 'x1' || prop === 'x2' || prop === 'r2') {
            finalValue *= svgOptions.viewBoxWidth || svgOptions.width;
          }
          if (prop === 'y1' || prop === 'y2') {
            finalValue *= svgOptions.viewBoxHeight || svgOptions.height;
          }
        }
      }
    }
    acc[prop] = finalValue;
    return acc;
  }, {});
}
