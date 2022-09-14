//@ts-nocheck
import { attributesMap } from './constants';

export function normalizeAttr(attr) {
  // transform attribute names
  if (attr in attributesMap) {
    return attributesMap[attr];
  }
  return attr;
}
