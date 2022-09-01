//@ts-nocheck
import { twoMathPi, halfPI } from "../constants";

/**
 * Easing functions
 * See <a href="http://gizma.com/easing/">Easing Equations by Robert Penner</a>
 * @namespace fabric.util.ease
 */

const normalize = (a, c, p, s) => {
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  }
  else {
    //handle the 0/0 case:
    if (c === 0 && a === 0) {
      s = p / twoMathPi * Math.asin(1);
    }
    else {
      s = p / twoMathPi * Math.asin(c / a);
    }
  }
  return { a: a, c: c, p: p, s: s };
}

const elastic = (opts, t, d) => opts.a *
    Math.pow(2, 10 * (t -= 1)) *
    Math.sin((t * d - opts.s) * twoMathPi / opts.p);

/**
 * Cubic easing out
 * @memberOf fabric.util.ease
 */
export const easeOutCubic = (t, b, c, d) => c * ((t /= d - 1) * t ** 2 + 1) + b;

/**
 * Cubic easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutCubic = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 3 + b;
  }
  return c / 2 * ((t -= 2) * t ** 2 + 2) + b;
}

/**
 * Quartic easing in
 * @memberOf fabric.util.ease
 */
export const easeInQuart = (t, b, c, d) => c * (t /= d) * t ** 3 + b;

/**
 * Quartic easing out
 * @memberOf fabric.util.ease
 */
export const easeOutQuart = (t, b, c, d) => -c * ((t = t / d - 1) * t ** 3 - 1) + b;

/**
 * Quartic easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutQuart = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 4 + b;
  }
  return -c / 2 * ((t -= 2) * t ** 3 - 2) + b;
}

/**
 * Quintic easing in
 * @memberOf fabric.util.ease
 */
export const easeInQuint = (t, b, c, d) => c * (t /= d) * t ** 4 + b;

/**
 * Quintic easing out
 * @memberOf fabric.util.ease
 */
export const easeOutQuint = (t, b, c, d) => c * ((t /= d - 1) * t ** 4 + 1) + b;

/**
 * Quintic easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutQuint = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 5 + b;
  }
  return c / 2 * ((t -= 2) * t ** 4 + 2) + b;
}

/**
 * Sinusoidal easing in
 * @memberOf fabric.util.ease
 */
export const easeInSine = (t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b;

/**
 * Sinusoidal easing out
 * @memberOf fabric.util.ease
 */
export const easeOutSine = (t, b, c, d) => c * Math.sin(t / d * halfPI) + b;

/**
 * Sinusoidal easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutSine = (t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;

/**
 * Exponential easing in
 * @memberOf fabric.util.ease
 */
export const easeInExpo = (t, b, c, d) => (t === 0) ? b : c * 2 ** (10 * (t / d - 1)) + b;

/**
 * Exponential easing out
 * @memberOf fabric.util.ease
 */
export const easeOutExpo = (t, b, c, d) => (t === d) ? b + c : c * -(2 ** (-10 * t / d) + 1) + b;

/**
 * Exponential easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutExpo = (t, b, c, d) => {
  if (t === 0) {
    return b;
  }
  if (t === d) {
    return b + c;
  }
  t /= d / 2;
  if (t < 1) {
    return c / 2 * 2 ** (10 * (t - 1)) + b;
  }
  return c / 2 * -(2 ** (-10 * --t) + 2) + b;
}

/**
 * Circular easing in
 * @memberOf fabric.util.ease
 */
export const easeInCirc = (t, b, c, d) => -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;

/**
 * Circular easing out
 * @memberOf fabric.util.ease
 */
export const easeOutCirc = (t, b, c, d) => c * Math.sqrt(1 - (t = t / d - 1) * t) + b;

/**
 * Circular easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutCirc = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return -c / 2 * (Math.sqrt(1 - t ** 2) - 1) + b;
  }
  return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
}

/**
 * Elastic easing in
 * @memberOf fabric.util.ease
 */
export const easeInElastic = (t, b, c, d) => {
  const s = 1.70158, a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const opts = normalize(a, c, p, s);
  return -elastic(opts, t, d) + b;
}

/**
 * Elastic easing out
 * @memberOf fabric.util.ease
 */
export const easeOutElastic = (t, b, c, d) => {
  const s = 1.70158, a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d;
  if (t === 1) {
    return b + c;
  }
  if (!p) {
    p = d * 0.3;
  }
  const opts = normalize(a, c, p, s);
  return opts.a * 2 ** (-10 * t) * Math.sin((t * d - opts.s) * (twoMathPi) / opts.p ) + opts.c + b;
}

/**
 * Elastic easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutElastic = (t, b, c, d) => {
  const s = 1.70158, a = c;
  let p = 0;
  if (t === 0) {
    return b;
  }
  t /= d / 2;
  if (t === 2) {
    return b + c;
  }
  if (!p) {
    p = d * (0.3 * 1.5);
  }
  const opts = normalize(a, c, p, s);
  if (t < 1) {
    return -0.5 * elastic(opts, t, d) + b;
  }
  return opts.a * Math.pow(2, -10 * (t -= 1)) *
    Math.sin((t * d - opts.s) * (twoMathPi) / opts.p ) * 0.5 + opts.c + b;
}

/**
 * Backwards easing in
 * @memberOf fabric.util.ease
 */
export const easeInBack = (t, b, c, d, s = 1.70158) => c * (t /= d) * t * ((s + 1) * t - s) + b;

/**
 * Backwards easing out
 * @memberOf fabric.util.ease
 */
export const easeOutBack = (t, b, c, d, s = 1.70158) => c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;

/**
 * Backwards easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutBack = (t, b, c, d, s = 1.70158) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

/**
 * Bouncing easing out
 * @memberOf fabric.util.ease
 */
export const easeOutBounce = (t, b, c, d) => {
  if ((t /= d) < (1 / 2.75)) {
    return c * (7.5625 * t * t) + b;
  }
  else if (t < (2 / 2.75)) {
    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
  }
  else if (t < (2.5 / 2.75)) {
    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
  }
  else {
    return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
  }
}

/**
 * Bouncing easing in
 * @memberOf fabric.util.ease
 */
 export const easeInBounce = (t, b, c, d) => c - easeOutBounce(d - t, 0, c, d) + b;

/**
 * Bouncing easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutBounce = (t, b, c, d) =>
  t < d / 2 ?
  easeInBounce(t * 2, 0, c, d) * 0.5 + b :
  easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;


/**
 * Quadratic easing in
 * @memberOf fabric.util.ease
 */
export const easeInQuad = (t, b, c, d) => c * (t /= d) * t + b;

/**
 * Quadratic easing out
 * @memberOf fabric.util.ease
 */
export const easeOutQuad = (t, b, c, d) => -c * (t /= d) * (t - 2) + b;

/**
 * Quadratic easing in and out
 * @memberOf fabric.util.ease
 */
export const easeInOutQuad = (t, b, c, d) => {
  t /= (d / 2);
  if (t < 1) {
    return c / 2 * t ** 2 + b;
  }
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

/**
 * Cubic easing in
 * @memberOf fabric.util.ease
 */
export const easeInCubic = (t, b, c, d) => c * (t /= d) * t * t + b;
