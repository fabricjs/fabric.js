//@ts-nocheck
export class AnimationRegistry extends Array {
    /**
     * cancel all running animations at the next requestAnimFrame
     * @returns {AnimationContext[]}
     */
    cancelAll() {
        var animations = this.splice(0);
        animations.forEach(function (animation) {
            animation.cancel();
        });
        return animations;
    },

    /**
     * cancel all running animations attached to canvas at the next requestAnimFrame
     * @param {fabric.Canvas} canvas
     * @returns {AnimationContext[]}
     */
    cancelByCanvas(canvas) {
        if (!canvas) {
            return [];
        }
        var cancelled = this.filter(function (animation) {
            return typeof animation.target === 'object' && animation.target.canvas === canvas;
        });
        cancelled.forEach(function (animation) {
            animation.cancel();
        });
        return cancelled;
    },

    /**
     * cancel all running animations for target at the next requestAnimFrame
     * @param {*} target
     * @returns {AnimationContext[]}
     */
    cancelByTarget(target) {
        var cancelled = this.findAnimationsByTarget(target);
        cancelled.forEach(function (animation) {
            animation.cancel();
        });
        return cancelled;
    },

    /**
     *
     * @param {CancelFunction} cancelFunc the function returned by animate
     * @returns {number}
     */
    findAnimationIndex(cancelFunc) {
        return this.indexOf(this.findAnimation(cancelFunc));
    },

    /**
     *
     * @param {CancelFunction} cancelFunc the function returned by animate
     * @returns {AnimationContext | undefined} animation's options object
     */
    findAnimation(cancelFunc) {
        return this.find(function (animation) {
            return animation.cancel === cancelFunc;
        });
    },

    /**
     *
     * @param {*} target the object that is assigned to the target property of the animation context
     * @returns {AnimationContext[]} array of animation options object associated with target
     */
    findAnimationsByTarget(target) {
        if (!target) {
            return [];
        }
        return this.filter(function (animation) {
            return animation.target === target;
        });
    }
}