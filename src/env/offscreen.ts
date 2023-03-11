/* eslint-disable no-restricted-globals */
import { setEnv } from '.';
import { noop } from '../constants';
import { WebGLProbe } from '../filters/GLProbes/WebGLProbe';
import { TCopyPasteData, TFabricEnv } from './types';

const copyPasteData: TCopyPasteData = {};

export function proxyWebAPIs(target: any = {}) {
  return Object.defineProperties(target, {
    hasAttribute: {
      value(key) {
        return key in this;
      },
    },
    getAttribute: {
      value(key) {
        return this[key];
      },
    },
    setAttribute: {
      value(key, value) {
        this[key] = value;
      },
    },
    style: {
      value: {
        setProperty() {},
      },
    },
    classList: {
      value: {
        add() {},
        remove() {},
      },
    },
    appendChild: {
      value() {},
    },
    remove: { value() {} },
    getBoundingClientRect: {
      value() {
        return {
          left: 0,
          top: 0,
          right: this.width || 0,
          bottom: this.height || 0,
          width: this.width || 0,
          height: this.height || 0,
        };
      },
    },
  });
}

export const getEnv = (): TFabricEnv => {
  return {
    document: {
      createElement(tagName: string) {
        switch (tagName) {
          case 'canvas':
            return proxyWebAPIs(new OffscreenCanvas(0, 0));
          case 'img':
            return proxyWebAPIs(new Image());
          default:
            console.warn('fabric.js: running in offscreen env');
            return proxyWebAPIs();
        }
      },
      addEventListener: noop,
      removeEventListener: noop,
    },
    window: {
      requestAnimationFrame: (...args) => requestAnimationFrame(...args),
      cancelAnimationFrame: (...args) => cancelAnimationFrame(...args),
      addEventListener: noop,
      removeEventListener: noop,
    },
    isTouchSupported: false,
    WebGLProbe: new WebGLProbe(),
    dispose() {
      // noop
    },
    copyPasteData,
  };
};

setEnv(getEnv());
