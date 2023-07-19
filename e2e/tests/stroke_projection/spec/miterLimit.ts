import cases from './cases';
import type { TestSpec } from './util';

const tests: TestSpec[] = [];

const selectedMiterLimitCases = {
  acuteAngle: cases.acuteAngle,
  obtuseAngle: cases.obtuseAngle,
  convex: cases.convex,
  concave: cases.concave,
  complex: cases.complex,
} as const;

for (const [test, casePoints] of Object.entries(selectedMiterLimitCases)) {
  [5, 20, 120].forEach((strokeMiterLimit) => {
    [true, false].forEach((strokeUniform) => {
      tests.push({
        test,
        type: 'polygon',
        points: casePoints,
        options: {
          strokeLineJoin: 'miter',
          strokeUniform,
          strokeMiterLimit,
        },
      });
    });
  });
}

export default tests;
