//@ts-nocheck

import type { FabricObject } from "../shapes/object.class";
import { StaticCanvas } from "../static_canvas.class";

export function ObjectStackingMixinGenerator<T extends new (...args: unknown[]) => unknown>(Klass: T) {
  return class ObjectStackingMixin extends Klass {

    /**
     * Moves an object to the bottom of the stack of drawn objects
     * @return {FabricObject} thisArg
     * @chainable
     */
    sendToBack() {
      if (this.group) {
        StaticCanvas.prototype.sendToBack.call(this.group, this);
      }
      else if (this.canvas) {
        this.canvas.sendToBack(this);
      }
      return this;
    }

    /**
     * Moves an object to the top of the stack of drawn objects
     * @return {FabricObject} thisArg
     * @chainable
     */
    bringToFront() {
      if (this.group) {
        StaticCanvas.prototype.bringToFront.call(this.group, this);
      }
      else if (this.canvas) {
        this.canvas.bringToFront(this);
      }
      return this;
    }

    /**
     * Moves an object down in stack of drawn objects
     * @param {Boolean} [intersecting] If `true`, send object behind next lower intersecting object
     * @return {FabricObject} thisArg
     * @chainable
     */
    sendBackwards(intersecting) {
      if (this.group) {
        StaticCanvas.prototype.sendBackwards.call(this.group, this, intersecting);
      }
      else if (this.canvas) {
        this.canvas.sendBackwards(this, intersecting);
      }
      return this;
    }

    /**
     * Moves an object up in stack of drawn objects
     * @param {Boolean} [intersecting] If `true`, send object in front of next upper intersecting object
     * @return {FabricObject} thisArg
     * @chainable
     */
    bringForward(intersecting) {
      if (this.group) {
        StaticCanvas.prototype.bringForward.call(this.group, this, intersecting);
      }
      else if (this.canvas) {
        this.canvas.bringForward(this, intersecting);
      }
      return this;
    }

    /**
     * Moves an object to specified level in stack of drawn objects
     * @param {Number} index New position of object
     * @return {FabricObject} thisArg
     * @chainable
     */
    moveTo(index) {
      if (this.group && this.group.type !== 'activeSelection') {
        StaticCanvas.prototype.moveTo.call(this.group, this, index);
      }
      else if (this.canvas) {
        this.canvas.moveTo(this, index);
      }
      return this;
    }

    /**
     *
     * @param {FabricObject} other object to compare against
     * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
     */
    isInFrontOf(other) {
      if (this === other) {
        return undefined;
      }
      var ancestorData = this.findCommonAncestors(other);
      if (!ancestorData) {
        return undefined;
      }
      if (ancestorData.fork.includes(other)) {
        return true;
      }
      if (ancestorData.otherFork.includes(this)) {
        return false;
      }
      var firstCommonAncestor = ancestorData.common[0];
      if (!firstCommonAncestor) {
        return undefined;
      }
      var headOfFork = ancestorData.fork.pop(),
        headOfOtherFork = ancestorData.otherFork.pop(),
        thisIndex = firstCommonAncestor._objects.indexOf(headOfFork),
        otherIndex = firstCommonAncestor._objects.indexOf(headOfOtherFork);
      return thisIndex > -1 && thisIndex > otherIndex;
    }
  }
}



