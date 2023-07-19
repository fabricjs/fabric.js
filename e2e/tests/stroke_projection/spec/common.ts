import cases from './cases';
import type { TestSpec } from './util';

const tests: TestSpec[] = [];

const spec = [
  {
    type: 'polyline',
    strokeLineType: 'strokeLineCap',
    strokeLineTypes: ['butt', 'square', 'round'],
  },
  {
    type: 'polygon',
    strokeLineType: 'strokeLineJoin',
    strokeLineTypes: ['miter', 'round', 'bevel'],
  },
] as const;

for (const [test, casePoints] of Object.entries(cases)) {
  spec.forEach(({ type, strokeLineType, strokeLineTypes }) => {
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

export default tests;
