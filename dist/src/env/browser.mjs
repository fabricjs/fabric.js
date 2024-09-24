import { WebGLProbe } from '../filters/GLProbes/WebGLProbe.mjs';

/* eslint-disable no-restricted-globals */
const copyPasteData = {};
const getEnv = () => {
  return {
    document,
    window,
    isTouchSupported: 'ontouchstart' in window || 'ontouchstart' in document || window && window.navigator && window.navigator.maxTouchPoints > 0,
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData
  };
};

export { getEnv };
//# sourceMappingURL=browser.mjs.map
