import { ObjectEvents } from '../../EventTypeDefs';
import type { Group } from '../group.class';
import type { Canvas } from '../../canvas/canvas_events';
import { StaticCanvas } from '../../canvas/static_canvas.class';
import { ObjectGeometry } from './ObjectGeometry';

type TAncestor = StackedObject | Canvas | StaticCanvas;
type TCollection = Group | Canvas | StaticCanvas;

/**
 * Strict: only ancestors that are objects (without canvas)
 */
export type Ancestors<Strict> = Strict extends true
  ? [StackedObject | Group] | [StackedObject | Group, ...Group[]] | Group[]
  :
      | [StackedObject | Group | Canvas | StaticCanvas]
      | [StackedObject | Group, Canvas | StaticCanvas]
      | [StackedObject, ...Group[]]
      | Group[]
      | [StackedObject | Group, ...Group[], Canvas | StaticCanvas];

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

export class StackedObject<
  EventSpec extends ObjectEvents = ObjectEvents
> extends ObjectGeometry<EventSpec> {
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
      } else if (parent instanceof StaticCanvas) {
        //  happens after all parents were traversed through without a match
        return false;
      }
      parent = (parent as Group).group || (parent as Group).canvas;
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
      parent =
        (parent as Group).group ||
        (strict ? undefined : (parent as Group).canvas);
    }
    return ancestors as Ancestors<T>;
  }

  /**
   * Compare ancestors
   *
   * @param {StackedObject} other
   * @param {boolean} [strict] finds only ancestors that are objects (without canvas)
   * @returns {AncestryComparison} an object that represent the ancestry situation.
   */
  findCommonAncestors<T extends this, S extends boolean>(
    other: T,
    strict?: S
  ): AncestryComparison<S> {
    if (this === other) {
      return {
        fork: [],
        otherFork: [],
        common: [this, ...this.getAncestors(strict)],
      } as AncestryComparison<S>;
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
      } as AncestryComparison<S>;
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i),
        } as AncestryComparison<S>;
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors],
          } as AncestryComparison<S>;
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i),
          } as AncestryComparison<S>;
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors],
      otherFork: [other, ...otherAncestors],
      common: [],
    } as AncestryComparison<S>;
  }

  /**
   *
   * @param {StackedObject} other
   * @param {boolean} [strict] checks only ancestors that are objects (without canvas)
   * @returns {boolean}
   */
  hasCommonAncestors<T extends this>(other: T, strict?: boolean): boolean {
    const commonAncestors = this.findCommonAncestors(other, strict);
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
