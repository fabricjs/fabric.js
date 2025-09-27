import { styleText } from 'node:util';

export const red = (s) => styleText('red', String(s));
export const redBright = (s) => styleText('redBright', String(s));
export const green = (s) => styleText('green', String(s));
export const yellow = (s) => styleText('yellow', String(s));
export const gray = (s) => styleText('gray', String(s));
export const blue = (s) => styleText('blue', String(s));
export const cyanBright = (s) => styleText('cyanBright', String(s));
export const bold = (s) => styleText('bold', String(s));
