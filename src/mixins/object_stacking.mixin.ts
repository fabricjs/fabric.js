// @ts-nocheck
import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';
import type { Group } from '../shapes/group.class';
import type { StaticCanvas } from '../__types__';
import { FabricObjectAncestryMixin } from './object_ancestry.mixin';

type TContainer = Group | StaticCanvas;

export class FabricObjectObjectStackingMixin extends FabricObjectAncestryMixin {
  /**
   * Moves an object to the bottom of the stack of drawn objects
   * @return {FabricObject} thisArg
   * @chainable
   */
  sendToBack() {
    if (this.group) {
      fabric.StaticCanvas.prototype.sendToBack.call(this.group, this);
    } else if (this.canvas) {
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
      fabric.StaticCanvas.prototype.bringToFront.call(this.group, this);
    } else if (this.canvas) {
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
      fabric.StaticCanvas.prototype.sendBackwards.call(
        this.group,
        this,
        intersecting
      );
    } else if (this.canvas) {
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
      fabric.StaticCanvas.prototype.bringForward.call(
        this.group,
        this,
        intersecting
      );
    } else if (this.canvas) {
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
      fabric.StaticCanvas.prototype.moveTo.call(this.group, this, index);
    } else if (this.canvas) {
      this.canvas.moveTo(this, index);
    }
    return this;
  }

  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf(
    this: FabricObject & this,
    other: FabricObject & this
  ): boolean | undefined {
    if (this === other) {
      return undefined;
    }
    const ancestorData = this.findCommonAncestors(other);
    if (!ancestorData) {
      return undefined;
    }
    if (ancestorData.fork.includes(other as any)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this as any)) {
      return false;
    }
    const firstCommonAncestor = ancestorData.common[0];
    if (!firstCommonAncestor) {
      return undefined;
    }
    const headOfFork = ancestorData.fork.pop() as FabricObject,
      headOfOtherFork = ancestorData.otherFork.pop() as FabricObject,
      thisIndex = (firstCommonAncestor as TContainer)._objects.indexOf(
        headOfFork
      ),
      otherIndex = (firstCommonAncestor as TContainer)._objects.indexOf(
        headOfOtherFork
      );
    return thisIndex > -1 && thisIndex > otherIndex;
  }
}
