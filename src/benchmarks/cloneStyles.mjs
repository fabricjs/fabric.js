/* eslint-disable no-restricted-syntax */
import { cloneStyles } from '../../dist/src/util/internals/cloneStyles.mjs';
import { cloneDeep } from './cloneDeep.mjs';

const style = {
  fill: 'blue',
  stroke: 'red',
  strokeWidth: 8,
  fontSize: 44,
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  fontStyle: 'italic',
  textBackgroundColor: 'green',
  deltaY: -5,
  overline: true,
  underline: false,
  linethrough: true,
};

const testObject = {
  0: {
    0: style,
    6: { ...style, fill: 'green' },
  },
  1: {
    0: { ...style },
    3: { ...style },
  },
  2: {
    0: { ...style },
    3: { ...style },
  },
};

const benchmark = async (callback) => {
  const start = Date.now();
  await callback();
  return Date.now() - start;
};

const size = 100_000;

const cloneDeepTest = await benchmark(async () => {
  for (let i = 0; i < size; i++) {
    cloneDeep(testObject);
  }
});

const cloneStylesTest = await benchmark(async () => {
  for (let i = 0; i < size; i++) {
    await cloneStyles(testObject);
  }
});

console.log({
  cloneDeepTest,
  cloneStylesTest,
});

/**
 * results on a m1pro
 * { cloneDeepTest: 742, cloneStylesTest: 364 }
 */
