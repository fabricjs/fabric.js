import cases from './cases';
import type { TestSpec } from './util';

const spec = [
  {
    type: 'polyline',
    strokeLineType: 'strokeLineCap',
    strokeLineTypes: ['butt', 'square', 'round'],
    tests: [] as TestSpec[],
  },
  {
    type: 'polygon',
    strokeLineType: 'strokeLineJoin',
    strokeLineTypes: ['miter', 'round', 'bevel'],
    tests: [] as TestSpec[],
  },
] as const;

for (const [test, casePoints] of Object.entries(cases)) {
  spec.forEach(({ type, strokeLineType, strokeLineTypes, tests }) => {
    strokeLineTypes.forEach((strokeLineTypeCase) => {
      [true, false].forEach((strokeUniform) => {
        [false, true].forEach((group) => {
          [
            [0, 0],
            [0, 30],
            [20, 0],
            [25, 35],
          ].forEach(([skewX, skewY]) => {
            tests.push({
              type,
              test,
              points: casePoints,
              group,
              options: {
                [strokeLineType]: strokeLineTypeCase,
                strokeUniform,
                skewX,
                skewY,
              },
            });
          });
        });
      });
    });
  });
}

export default spec;
