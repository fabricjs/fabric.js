import { version } from '../package.json';
export const VERSION = version;
// assume we're running under node.js when document/window are not present
export const context = typeof document !== 'undefined' && typeof window !== 'undefined' ?
    require('./browser_context') :
    require('./node_context')
