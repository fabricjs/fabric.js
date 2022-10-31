// @ts-nocheck

import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';
import { FabricObjectAncestryMixin } from './object_ancestry.mixin';

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
}
