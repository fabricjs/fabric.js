import type { TestSpec } from './util';

const tests: TestSpec[] = [];

(['polyline', 'polygon'] as const).forEach((type) => {
  (['square', 'round'] as const).forEach((strokeLineCap) => {
    [true, false].forEach((strokeUniform) => {
      [
        [0, 0],
        [0, 30],
        [20, 0],
        [25, 35],
      ].forEach(([skewX, skewY]) => {
        tests.push({
          type,
          test: 'singlePoint',
          points: [{ x: 100, y: 100 }],
          options: {
            strokeLineCap,
            strokeUniform,
            skewX,
            skewY,
          },
        });
      });
    });
  });
});

export default tests;
