import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/fabricObject.class';
import type { Group } from '../shapes/group.class';
import type { Canvas, StaticCanvas } from '../__types__';

type TAncestor = FabricObject | Canvas | StaticCanvas;

/**
 * Strict: only ancestors that are objects (without canvas)
 */
export type Ancestors<Strict> = Strict extends true
  ? [FabricObject | Group] | [FabricObject | Group, ...Group[]] | Group[]
  :
      | [FabricObject | Group | Canvas | StaticCanvas]
      | [FabricObject | Group, Canvas | StaticCanvas]
      | [FabricObject, ...Group[]]
      | Group[]
      | [FabricObject | Group, ...Group[], Canvas | StaticCanvas];

export type AncestryComparison<Strict> = {
  /**
   * common ancestors of `this` and`other`(may include`this` | `other`)
   */
  common: Ancestors<Strict>;
  /**
   * ancestors that are of `this` only
   */
  fork: Ancestors<Strict>;
  /**
   * ancestors that are of `other` only
   */
  otherFork: Ancestors<Strict>;
};

export class FabricObjectAncestryMixin {
  group?: Group;
  canvas?: StaticCanvas | Canvas;

  /**
   * Checks if object is descendant of target
   * Should be used instead of @link {Collection.contains} for performance reasons
   * @param {TAncestor} target
   * @returns {boolean}
   */
  isDescendantOf(target: TAncestor): boolean {
    let parent = this.group || this.canvas;
    while (parent) {
      if (target === parent) {
        return true;
      } else if (parent instanceof fabric.StaticCanvas) {
        //  happens after all parents were traversed through without a match
        return false;
      }
      parent = parent.group || parent.canvas;
    }
    return false;
  }

  /**
   *
   * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
   * @returns {Ancestors} ancestors from bottom to top
   */
  getAncestors<T extends boolean>(strict?: T): Ancestors<T> {
    const ancestors: TAncestor[] = [];
    let parent = this.group || (strict ? undefined : this.canvas);
    while (parent) {
      ancestors.push(parent);
      parent = parent.group || (strict ? undefined : parent.canvas);
    }
    return ancestors as Ancestors<T>;
  }

  /**
   * Compare ancestors
   *
   * @param {FabricObject} other
   * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors<T extends boolean>(
    this: FabricObject & this,
    other: FabricObject & this,
    strict?: T
  ): AncestryComparison<T> {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors(strict)],
      } as AncestryComparison<T>;
    }
    const ancestors = this.getAncestors(strict);
    const otherAncestors = other.getAncestors(strict);
    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (
      ancestors.length === 0 &&
      otherAncestors.length > 0 &&
      this === otherAncestors[otherAncestors.length - 1]
    ) {
      return {
        fork: [],
        otherFork: [
          other,
          ...otherAncestors.slice(0, otherAncestors.length - 1),
        ],
        common: [this],
      } as AncestryComparison<T>;
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i),
        } as AncestryComparison<T>;
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors],
          } as AncestryComparison<T>;
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i),
          } as AncestryComparison<T>;
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: [],
    } as AncestryComparison<T>;
  }

  /**
   *
   * @param {FabricObject} other
   * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
   * @returns {boolean}
   */
  hasCommonAncestors(
    this: FabricObject & this,
    other: FabricObject & this,
    strict?: boolean
  ): boolean {
    const commonAncestors = this.findCommonAncestors(other, strict);
    return commonAncestors && !!commonAncestors.common.length;
  }
}
