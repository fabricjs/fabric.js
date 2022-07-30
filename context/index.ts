import { version } from '../package.json';
export const VERSION = version;

const a = require.resolve('./browser_context');
const b = require.resolve('./node_context');

// assume we're running under node.js when document/window are not present
export const context = typeof document !== 'undefined' && typeof window !== 'undefined' ?
    require(a) :
    require(b);