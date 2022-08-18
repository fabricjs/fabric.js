import { clamp } from "../util";
import { ifNaN } from "../util/internals";

// export const RE_PERCENT = /%$/;

const RE_PERCENT = /^(\d+\.\d+)%|(\d+)%$/;

export function isPercent(value: string | null) {
    return value && RE_PERCENT.test(value);
}

export function parsePercent(value: string | number | null, valueIfNaN?: number) {
    const parsed = typeof value == 'number' ?
        value :
        typeof value == 'string' ?
            parseFloat(value) / (isPercent(value) ? 100 : 1) :
            NaN;
    return ifNaN(
        clamp(0, parsed, 1),
        valueIfNaN
    );
}
