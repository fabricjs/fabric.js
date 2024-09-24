/**
 * Array holding all running animations
 */
class AnimationRegistry extends Array {
  /**
   * Remove a single animation using an animation context
   * @param {AnimationBase} context
   */
  remove(context) {
    const index = this.indexOf(context);
    index > -1 && this.splice(index, 1);
  }

  /**
   * Cancel all running animations on the next frame
   */
  cancelAll() {
    const animations = this.splice(0);
    animations.forEach(animation => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations attached to a canvas on the next frame
   * @param {StaticCanvas} canvas
   */
  cancelByCanvas(canvas) {
    if (!canvas) {
      return [];
    }
    const animations = this.filter(animation => {
      var _animation$target;
      return animation.target === canvas || typeof animation.target === 'object' && ((_animation$target = animation.target) === null || _animation$target === void 0 ? void 0 : _animation$target.canvas) === canvas;
    });
    animations.forEach(animation => animation.abort());
    return animations;
  }

  /**
   * Cancel all running animations for target on the next frame
   * @param target
   */
  cancelByTarget(target) {
    if (!target) {
      return [];
    }
    const animations = this.filter(animation => animation.target === target);
    animations.forEach(animation => animation.abort());
    return animations;
  }
}
const runningAnimations = new AnimationRegistry();

export { runningAnimations };
//# sourceMappingURL=AnimationRegistry.mjs.map
