import { attributesMap } from './constants';

export const normalizeAttr = (
  attr: keyof typeof attributesMap | string,
): string => attributesMap[attr as keyof typeof attributesMap] ?? attr;
