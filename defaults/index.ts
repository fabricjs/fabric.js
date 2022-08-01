import * as DObject from './Object.json';
import * as DRect from './Rect.json';

export const DEFAULTS = {
    rect: { ...DObject, ...DRect }
};