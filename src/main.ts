import config from './config';
import { VERSION } from './context';

export const fabric = {
    version: VERSION,
    get DPI() {
        return config.DPI;
    },
    set DPI(value: number) {
        config.DPI = value;
    },
    get NUM_FRACTION_DIGITS() {
        return config.NUM_FRACTION_DIGITS;
    },
    set NUM_FRACTION_DIGITS(value: number) {
        config.NUM_FRACTION_DIGITS = value;
    },
    get browserShadowBlurConstant() {
        return config.browserShadowBlurConstant;
    },
    set browserShadowBlurConstant(value: number) {
        config.browserShadowBlurConstant = value;
    },
    get cachesBoundsOfCurve() {
        return config.cachesBoundsOfCurve;
    },
    set cachesBoundsOfCurve(value: boolean) {
        config.cachesBoundsOfCurve = value;
    },
    get disableStyleCopyPaste() {
        return config.disableStyleCopyPaste;
    },
    set disableStyleCopyPaste(value: boolean) {
        config.disableStyleCopyPaste = value;
    },
    get enableGLFiltering() {
        return config.enableGLFiltering;
    },
    set enableGLFiltering(value: boolean) {
        config.enableGLFiltering = value;
    },
    get forceGLPutImageData() {
        return config.forceGLPutImageData;
    },
    set forceGLPutImageData(value: boolean) {
        config.forceGLPutImageData = value;
    },
    get maxCacheSideLimit() {
        return config.maxCacheSideLimit;
    },
    set maxCacheSideLimit(value: number) {
        config.maxCacheSideLimit = value;
    },
    get minCacheSideLimit() {
        return config.minCacheSideLimit;
    },
    set minCacheSideLimit(value: number) {
        config.minCacheSideLimit = value;
    },
    get perfLimitSizeTotal() {
        return config.perfLimitSizeTotal;
    },
    set perfLimitSizeTotal(value: number) {
        config.perfLimitSizeTotal = value;
    },
    get textureSize() {
        return config.textureSize;
    },
    set textureSize(value: number) {
        config.textureSize = value;
    },
    get devicePixelRatio() {
        return config.devicePixelRatio;
    },
    set devicePixelRatio(value) {
        config.devicePixelRatio = value;
    }
};