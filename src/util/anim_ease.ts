
/**
 * Easing functions
 * See <a href="http://gizma.com/easing/">Easing Equations by Robert Penner</a>
 */
export class AnimationEase {

  /**
   * Quadratic easing in
   * @memberOf fabric.util.ease
   */
  easeInQuad(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t + b;
  }

  /**
   * Quadratic easing out
   * @memberOf fabric.util.ease
   */
  easeOutQuad(t: number, b: number, c: number, d: number) {
    return -c * (t /= d) * (t - 2) + b;
  }

  /**
   * Quadratic easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= (d / 2);
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
  }

  /**
   * Cubic easing in
   * @memberOf fabric.util.ease
   */
  easeInCubic(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t + b;
  }

  normalize(a: number, c: number, p: number, s: number) {
    if (a < Math.abs(c)) {
      a = c;
      s = p / 4;
    }
    else {
      //handle the 0/0 case:
      if (c === 0 && a === 0) {
        s = p / (2 * Math.PI) * Math.asin(1);
      }
      else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
    }
    return { a: a, c: c, p: p, s: s };
  }

  elastic(opts: { a: number, c: number, p: number, s: number }, t: number, d: number) {
    return opts.a *
      Math.pow(2, 10 * (t -= 1)) *
      Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p);
  }

  /**
   * Cubic easing out
   * @memberOf fabric.util.ease
   */
  easeOutCubic(t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  }

  /**
   * Cubic easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutCubic(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
  }

  /**
   * Quartic easing in
   * @memberOf fabric.util.ease
   */
  easeInQuart(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t * t + b;
  }

  /**
   * Quartic easing out
   * @memberOf fabric.util.ease
   */
  easeOutQuart(t: number, b: number, c: number, d: number) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  }

  /**
   * Quartic easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutQuart(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t * t * t + b;
    }
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
  }

  /**
   * Quintic easing in
   * @memberOf fabric.util.ease
   */
  easeInQuint(t: number, b: number, c: number, d: number) {
    return c * (t /= d) * t * t * t * t + b;
  }

  /**
   * Quintic easing out
   * @memberOf fabric.util.ease
   */
  easeOutQuint(t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  }

  /**
   * Quintic easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutQuint(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
  }

  /**
   * Sinusoidal easing in
   * @memberOf fabric.util.ease
   */
  easeInSine(t: number, b: number, c: number, d: number) {
    return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
  }

  /**
   * Sinusoidal easing out
   * @memberOf fabric.util.ease
   */
  easeOutSine(t: number, b: number, c: number, d: number) {
    return c * Math.sin(t / d * (Math.PI / 2)) + b;
  }

  /**
   * Sinusoidal easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutSine(t: number, b: number, c: number, d: number) {
    return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
  }

  /**
   * Exponential easing in
   * @memberOf fabric.util.ease
   */
  easeInExpo(t: number, b: number, c: number, d: number) {
    return (t === 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  }

  /**
   * Exponential easing out
   * @memberOf fabric.util.ease
   */
  easeOutExpo(t: number, b: number, c: number, d: number) {
    return (t === d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
  }

  /**
   * Exponential easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutExpo(t: number, b: number, c: number, d: number) {
    if (t === 0) {
      return b;
    }
    if (t === d) {
      return b + c;
    }
    t /= d / 2;
    if (t < 1) {
      return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    }
    return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
  }

  /**
   * Circular easing in
   * @memberOf fabric.util.ease
   */
  easeInCirc(t: number, b: number, c: number, d: number) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  }

  /**
   * Circular easing out
   * @memberOf fabric.util.ease
   */
  easeOutCirc(t: number, b: number, c: number, d: number) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  }

  /**
   * Circular easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutCirc(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) {
      return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
    }
    return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  }

  /**
   * Elastic easing in
   * @memberOf fabric.util.ease
   */
  easeInElastic(t: number, b: number, c: number, d: number) {
    let s = 1.70158, p = 0, a = c;
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
    let opts = this.normalize(a, c, p, s);
    return -this.elastic(opts, t, d) + b;
  }

  /**
   * Elastic easing out
   * @memberOf fabric.util.ease
   */
  easeOutElastic(t: number, b: number, c: number, d: number) {
    let s = 1.70158, p = 0, a = c;
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
    let opts = this.normalize(a, c, p, s);
    return opts.a * Math.pow(2, -10 * t) * Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) + opts.c + b;
  }

  /**
   * Elastic easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutElastic(t: number, b: number, c: number, d: number) {
    let s = 1.70158, p = 0, a = c;
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
    let opts = this.normalize(a, c, p, s);
    if (t < 1) {
      return -0.5 * this.elastic(opts, t, d) + b;
    }
    return opts.a * Math.pow(2, -10 * (t -= 1)) *
      Math.sin((t * d - opts.s) * (2 * Math.PI) / opts.p) * 0.5 + opts.c + b;
  }

  /**
   * Backwards easing in
   * @memberOf fabric.util.ease
   */
  easeInBack(t: number, b: number, c: number, d: number, s: number) {
    if (s === undefined) {
      s = 1.70158;
    }
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  }

  /**
   * Backwards easing out
   * @memberOf fabric.util.ease
   */
  easeOutBack(t: number, b: number, c: number, d: number, s: number) {
    if (s === undefined) {
      s = 1.70158;
    }
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  }

  /**
   * Backwards easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutBack(t: number, b: number, c: number, d: number, s: number) {
    if (s === undefined) {
      s = 1.70158;
    }
    t /= d / 2;
    if (t < 1) {
      return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    }
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
  }

  /**
   * Bouncing easing in
   * @memberOf fabric.util.ease
   */
  easeInBounce(t: number, b: number, c: number, d: number) {
    return c - this.easeOutBounce(d - t, 0, c, d) + b;
  }

  /**
   * Bouncing easing out
   * @memberOf fabric.util.ease
   */
  easeOutBounce(t: number, b: number, c: number, d: number) {
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
   * Bouncing easing in and out
   * @memberOf fabric.util.ease
   */
  easeInOutBounce(t: number, b: number, c: number, d: number) {
    if (t < d / 2) {
      return this.easeInBounce(t * 2, 0, c, d) * 0.5 + b;
    }
    return this.easeOutBounce(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  }
}

/**
 * @namespace fabric.util.ease
 */
fabric.util.ease = new AnimationEase();