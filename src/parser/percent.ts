import { ifNaN } from '../util/internals/ifNaN';
import { capValue } from '../util/misc/capValue';

const RE_PERCENT = /^(\d+\.\d+)%|(\d+)%$/;

export function isPercent(value: string | null) {
  return value && RE_PERCENT.test(value);
}

/**
 *
 * @param value
 * @param valueIfNaN
 * @returns ∈ [0, 1]
 */
export function parsePercent(
  value: string | number | null | undefined,
  valueIfNaN?: number,
) {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseFloat(value) / (isPercent(value) ? 100 : 1)
        : NaN;
  return capValue(0, ifNaN(parsed, valueIfNaN), 1);
}
