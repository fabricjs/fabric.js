import { ifNaN } from '../util/internals/ifNaN.mjs';
import { capValue } from '../util/misc/capValue.mjs';

const RE_PERCENT = /^(\d+\.\d+)%|(\d+)%$/;
function isPercent(value) {
  return value && RE_PERCENT.test(value);
}

/**
 *
 * @param value
 * @param valueIfNaN
 * @returns ∈ [0, 1]
 */
function parsePercent(value, valueIfNaN) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? parseFloat(value) / (isPercent(value) ? 100 : 1) : NaN;
  return capValue(0, ifNaN(parsed, valueIfNaN), 1);
}

export { isPercent, parsePercent };
//# sourceMappingURL=percent.mjs.map
