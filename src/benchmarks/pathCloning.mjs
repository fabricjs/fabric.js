import { Path, FabricObject, util } from '../../dist/index.mjs';
import lodash from 'lodash';
import { normalPath, insanelyLongButRealPath } from './pathData.mjs';

class OldPath extends Path {
  /**
   * Returns object representation of an instance
   * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
   * @return {Object} object representation of an instance
   */
  toObject(propertiesToInclude = []) {
    return {
      ...FabricObject.prototype.toObject.call(this, propertiesToInclude),
      path: this.path.map((pathCmd) => pathCmd.slice()),
    };
  }
}

const benchmark = async (callback) => {
  const start = Date.now();
  await callback();
  return Date.now() - start;
};

const size = 1;

const pathCloneDeep = await benchmark(async () => {
  const path = new Path(insanelyLongButRealPath);
  for (let i = 0; i < size; i++) {
    await path.clone();
  }
});

const pathOldCode = await benchmark(async () => {
  const path = new OldPath(insanelyLongButRealPath);
  for (let i = 0; i < size; i++) {
    await path.clone();
  }
});

console.log({
  pathCloneDeep,
  pathOldCode,
});

const parsedPath = util.parsePath(insanelyLongButRealPath);

const parsedNormalPath = util.parsePath(normalPath);

const size2 = 100;

const cloningSimple = await benchmark(async () => {
  for (let i = 0; i < size2; i++) {
    const cloned = JSON.parse(JSON.stringify(parsedPath));
  }
});

const cloningLodash = await benchmark(async () => {
  for (let i = 0; i < size2; i++) {
    const cloned = lodash.cloneDeep(parsedPath);
  }
});

const cloningCustom = await benchmark(async () => {
  for (let i = 0; i < size2; i++) {
    const cloned = parsedPath.map((pathCmd) => pathCmd.slice());
  }
});

console.log({
  cloningLodash,
  cloningSimple,
  cloningCustom,
});

const size3 = 10_000;

const cloningSimpleNormal = await benchmark(async () => {
  for (let i = 0; i < size3; i++) {
    const cloned = JSON.parse(JSON.stringify(parsedNormalPath));
  }
});

const cloningLodashNormal = await benchmark(async () => {
  for (let i = 0; i < size3; i++) {
    const cloned = lodash.cloneDeep(parsedNormalPath);
  }
});

const cloningCustomNormal = await benchmark(async () => {
  for (let i = 0; i < size3; i++) {
    const cloned = parsedNormalPath.map((pathCmd) => pathCmd.slice());
  }
});

console.log({
  cloningLodashNormal,
  cloningSimpleNormal,
  cloningCustomNormal,
});

/**
 * results on a m1pro
 * { pathCloneDeep: 649, pathOldCode: 497 }
 * { cloningLodash: 384, cloningSimple: 778, cloningCustom: 26 }
 * {
 *   cloningLodashNormal: 56,
 *   cloningSimpleNormal: 139,
 *   cloningCustomNormal: 7
 * }
 */
