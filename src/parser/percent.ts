import { ifNaN } from '../util/internals/ifNaN';
import { capValue } from '../util/misc/capValue';

/**
 * Will loosely accept as percent numbers that are not like
 * 3.4a%. This function does not check for the correctness of a percentage
 * but it checks that values that are in theory correct are or arent percentages
 */
export function isPercent(value: string | null) {
  // /%$/ Matches strings that end with a percent sign (%)
  return value && /%$/.test(value) && Number.isFinite(parseFloat(value));
}

/**
 * Parse a percentage value in an svg.
 * @param value
 * @param fallback in case of not possible to parse the number
 * @returns ∈ [0, 1]
 */
export function parsePercent(
  value: string | number | null | undefined,
  valueIfNaN?: number,
): number {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? parseFloat(value) / (isPercent(value) ? 100 : 1)
        : NaN;
  return capValue(0, ifNaN(parsed, valueIfNaN), 1);
}
