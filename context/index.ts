import { version } from '../package.json';
export const VERSION = version;

//import { context as browser } from './browser_context';
import { context as node } from './node_context';

// assume we're running under node.js when document/window are not present
export const context = typeof document !== 'undefined' && typeof window !== 'undefined' ?
    null :
    node;