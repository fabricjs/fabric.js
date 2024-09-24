import { halfPI, twoMathPi } from '../../constants.mjs';

/**
 * Easing functions
 * @see {@link http://gizma.com/easing/ Easing Equations by Robert Penner}
 */

const normalize = (a, c, p, s) => {
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    //handle the 0/0 case:
    if (c === 0 && a === 0) {
      s = p / twoMathPi * Math.asin(1);
    } else {
      s = p / twoMathPi * Math.asin(c / a);
    }
  }
  return {
    a,
    c,
    p,
    s
  };
};
const elastic = (a, s, p, t, d) => a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * twoMathPi / p);

/**
 * Default sinusoidal easing
 */
const defaultEasing = (t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b;

/**
 * Cubic easing in
 */
const easeInCubic = (t, b, c, d) => c * (t / d) ** 3 + b;

/**
 * Cubic easing out
 */
const easeOutCubic = (t, b, c, d) => c * ((t / d - 1) ** 3 + 1) + b;

/**
 * Cubic easing in and out
 */
const easeInOutCubic = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 3 + b;
  }
  return c / 2 * ((t - 2) ** 3 + 2) + b;
};

/**
 * Quartic easing in
 */
const easeInQuart = (t, b, c, d) => c * (t /= d) * t ** 3 + b;

/**
 * Quartic easing out
 */
const easeOutQuart = (t, b, c, d) => -c * ((t = t / d - 1) * t ** 3 - 1) + b;

/**
 * Quartic easing in and out
 */
const easeInOutQuart = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 4 + b;
  }
  return -c / 2 * ((t -= 2) * t ** 3 - 2) + b;
};

/**
 * Quintic easing in
 */
const easeInQuint = (t, b, c, d) => c * (t / d) ** 5 + b;

/**
 * Quintic easing out
 */
const easeOutQuint = (t, b, c, d) => c * ((t / d - 1) ** 5 + 1) + b;

/**
 * Quintic easing in and out
 */
const easeInOutQuint = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 5 + b;
  }
  return c / 2 * ((t - 2) ** 5 + 2) + b;
};

/**
 * Sinusoidal easing in
 */
const easeInSine = (t, b, c, d) => -c * Math.cos(t / d * halfPI) + c + b;

/**
 * Sinusoidal easing out
 */
const easeOutSine = (t, b, c, d) => c * Math.sin(t / d * halfPI) + b;

/**
 * Sinusoidal easing in and out
 */
const easeInOutSine = (t, b, c, d) => -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;

/**
 * Exponential easing in
 */
const easeInExpo = (t, b, c, d) => t === 0 ? b : c * 2 ** (10 * (t / d - 1)) + b;

/**
 * Exponential easing out
 */
const easeOutExpo = (t, b, c, d) => t === d ? b + c : c * -(2 ** (-10 * t / d) + 1) + b;

/**
 * Exponential easing in and out
 */
const easeInOutExpo = (t, b, c, d) => {
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
};

/**
 * Circular easing in
 */
const easeInCirc = (t, b, c, d) => -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;

/**
 * Circular easing out
 */
const easeOutCirc = (t, b, c, d) => c * Math.sqrt(1 - (t = t / d - 1) * t) + b;

/**
 * Circular easing in and out
 */
const easeInOutCirc = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return -c / 2 * (Math.sqrt(1 - t ** 2) - 1) + b;
  }
  return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};

/**
 * Elastic easing in
 */
const easeInElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
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
  const {
    a: normA,
    s: normS,
    p: normP
  } = normalize(a, c, p, s);
  return -elastic(normA, normS, normP, t, d) + b;
};

/**
 * Elastic easing out
 */
const easeOutElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
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
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  return normA * 2 ** (-10 * t) * Math.sin((t * d - normS) * twoMathPi / normP) + normC + b;
};

/**
 * Elastic easing in and out
 */
const easeInOutElastic = (t, b, c, d) => {
  const s = 1.70158,
    a = c;
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
  const {
    a: normA,
    s: normS,
    p: normP,
    c: normC
  } = normalize(a, c, p, s);
  if (t < 1) {
    return -0.5 * elastic(normA, normS, normP, t, d) + b;
  }
  return normA * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - normS) * twoMathPi / normP) * 0.5 + normC + b;
};

/**
 * Backwards easing in
 */
const easeInBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
};

/**
 * Backwards easing out
 */
const easeOutBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};

/**
 * Backwards easing in and out
 */
const easeInOutBack = function (t, b, c, d) {
  let s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  t /= d / 2;
  if (t < 1) {
    return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  }
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
};

/**
 * Bouncing easing out
 */
const easeOutBounce = (t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
  }
};

/**
 * Bouncing easing in
 */
const easeInBounce = (t, b, c, d) => c - easeOutBounce(d - t, 0, c, d) + b;

/**
 * Bouncing easing in and out
 */
const easeInOutBounce = (t, b, c, d) => t < d / 2 ? easeInBounce(t * 2, 0, c, d) * 0.5 + b : easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;

/**
 * Quadratic easing in
 */
const easeInQuad = (t, b, c, d) => c * (t /= d) * t + b;

/**
 * Quadratic easing out
 */
const easeOutQuad = (t, b, c, d) => -c * (t /= d) * (t - 2) + b;

/**
 * Quadratic easing in and out
 */
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) {
    return c / 2 * t ** 2 + b;
  }
  return -c / 2 * (--t * (t - 2) - 1) + b;
};

export { defaultEasing, easeInBack, easeInBounce, easeInCirc, easeInCubic, easeInElastic, easeInExpo, easeInOutBack, easeInOutBounce, easeInOutCirc, easeInOutCubic, easeInOutElastic, easeInOutExpo, easeInOutQuad, easeInOutQuart, easeInOutQuint, easeInOutSine, easeInQuad, easeInQuart, easeInQuint, easeInSine, easeOutBack, easeOutBounce, easeOutCirc, easeOutCubic, easeOutElastic, easeOutExpo, easeOutQuad, easeOutQuart, easeOutQuint, easeOutSine };
//# sourceMappingURL=easing.mjs.map
