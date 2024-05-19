import { util } from '../../dist/index.mjs';

// perf(composeMatrix): 25% improv by restoring v5 implementation #9851

// OLD CODE FOR REFERENCE AND IMPLEMENTATION TEST

const util2 = { ...util };

util2.calcDimensionsMatrix = ({
  scaleX = 1,
  scaleY = 1,
  flipX = false,
  flipY = false,
  skewX = 0,
  skewY = 0,
}) => {
  return util2.multiplyTransformMatrixArray(
    [
      util2.createScaleMatrix(
        flipX ? -scaleX : scaleX,
        flipY ? -scaleY : scaleY
      ),
      skewX && util2.createSkewXMatrix(skewX),
      skewY && util2.createSkewYMatrix(skewY),
    ],
    true
  );
};

util2.composeMatrix = ({
  translateX = 0,
  translateY = 0,
  angle = 0,
  ...otherOptions
}) => {
  return util2.multiplyTransformMatrixArray([
    util2.createTranslateMatrix(translateX, translateY),
    angle && util2.createRotateMatrix({ angle }),
    util2.calcDimensionsMatrix(otherOptions),
  ]);
};

// END OF OLD CODE

const benchmark = (callback) => {
  const start = Date.now();
  callback();
  return Date.now() - start;
};

const optionsComplex = {
  skewY: 10,
  skewX: 4,
  scaleX: 5,
  scaleY: 4,
  angle: 20,
  flipY: true,
};

const simpleCase = {
  scaleX: 5,
  scaleY: 4,
  angle: 20,
};

const complexOld = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    util2.composeMatrix(optionsComplex);
  }
});

const complexNew = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    util.composeMatrix(optionsComplex);
  }
});

console.log({ complexOld, complexNew });

const simpleOld = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    util2.composeMatrix(simpleCase);
  }
});

const simpleNew = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    util.composeMatrix(simpleCase);
  }
});

console.log({ simpleOld, simpleNew });

/**
 * On Node 18.17
 * { complexOld: 749, complexNew: 627 }
 * { simpleOld: 537, simpleNew: 374 }
 */

/**
 * After removing the spread operator
 * { complexOld: 761, complexNew: 446 }
 * { simpleOld: 526, simpleNew: 271 }
 */
