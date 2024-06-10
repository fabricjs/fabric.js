import type { ObjectEvents } from '../../EventTypeDefs';
import type { Group } from '../Group';
import type { Canvas } from '../../canvas/Canvas';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { ObjectGeometry } from './ObjectGeometry';
import type { FabricObject } from './FabricObject';

type TAncestor = StackedObject | Canvas | StaticCanvas;
type TCollection = Group | Canvas | StaticCanvas;

export type Ancestors =
  | [StackedObject | Group]
  | [StackedObject | Group, ...Group[]]
  | Group[];

export type AncestryComparison = {
  /**
   * common ancestors of `this` and`other`(may include`this` | `other`)
   */
  common: Ancestors;
  /**
   * ancestors that are of `this` only
   */
  fork: Ancestors;
  /**
   * ancestors that are of `other` only
   */
  otherFork: Ancestors;
};

export class StackedObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectGeometry<EventSpec> {
  /**
   * A reference to the parent of the object
   * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
   */
  declare parent?: Group;

  /**
   * Checks if object is descendant of target
   * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
   * @param {TAncestor} target
   * @returns {boolean}
   */
  isDescendantOf(target: TAncestor): boolean {
    const { parent, group } = this;
    return (
      parent === target ||
      group === target ||
      this.canvas === target ||
      // walk up
      (!!parent && parent.isDescendantOf(target)) ||
      (!!group && group !== parent && group.isDescendantOf(target))
    );
  }

  /**
   * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
   */
  getAncestors(): Ancestors {
    const ancestors: TAncestor[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let parent: TAncestor | undefined = this;
    do {
      parent = parent instanceof StackedObject ? parent.parent : undefined;
      parent && ancestors.push(parent);
    } while (parent);
    return ancestors as Ancestors;
  }

  /**
   * Compare ancestors
   *
   * @param {StackedObject} other
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors<T extends this>(other: T): AncestryComparison {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors()],
      } as AncestryComparison;
    }
    const ancestors = this.getAncestors();
    const otherAncestors = other.getAncestors();
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
      } as AncestryComparison;
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i),
        } as AncestryComparison;
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors],
          } as AncestryComparison;
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i),
          } as AncestryComparison;
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: [],
    } as AncestryComparison;
  }

  /**
   *
   * @param {StackedObject} other
   * @returns {boolean}
   */
  hasCommonAncestors<T extends this>(other: T): boolean {
    const commonAncestors = this.findCommonAncestors(other);
    return commonAncestors && !!commonAncestors.common.length;
  }

  /**
   *
   * @param {FabricObject} other object to compare against
   * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
   */
  isInFrontOf<T extends this>(other: T): boolean | undefined {
    if (this === other) {
      return undefined;
    }
    const ancestorData = this.findCommonAncestors(other);

    if (ancestorData.fork.includes(other as any)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this as any)) {
      return false;
    }
    // if there isn't a common ancestor, we take the canvas.
    // if there is no canvas, there is nothing to compare
    const firstCommonAncestor = ancestorData.common[0] || this.canvas;
    if (!firstCommonAncestor) {
      return undefined;
    }
    const headOfFork = ancestorData.fork.pop(),
      headOfOtherFork = ancestorData.otherFork.pop(),
      thisIndex = (firstCommonAncestor as TCollection)._objects.indexOf(
        headOfFork as any
      ),
      otherIndex = (firstCommonAncestor as TCollection)._objects.indexOf(
        headOfOtherFork as any
      );
    return thisIndex > -1 && thisIndex > otherIndex;
  }
}
