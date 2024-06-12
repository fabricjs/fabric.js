import type { ObjectEvents } from '../../EventTypeDefs';
import type { Group } from '../Group';
import type { Canvas } from '../../canvas/Canvas';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { ObjectGeometry } from './ObjectGeometry';

// Check if an object is a Group without using the class to avoid circular dependency
const isGroup = (obj: StackedObject): obj is Group => {
  return typeof (obj as Group).enterGroup === 'function';
};

type TAncestor = StackedObject | Canvas | StaticCanvas;
type TCollection = Group | Canvas | StaticCanvas;

/**
 * Strict: only ancestors that are objects (without canvas)
 */
export type Ancestors<Strict> = Strict extends true
  ? Group[]
  : [...Group[], Canvas | StaticCanvas] | [(Canvas | StaticCanvas)?];

export type AncestryComparison<Strict> = {
  /**
   * common ancestors of `this` and`other`(may include`this` | `other`)
   */
  common:
    | [StackedObject, ...Ancestors<Strict>]
    | Ancestors<Strict>
    | [StackedObject?];
  /**
   * ancestors that are of `this` only
   */
  fork: [StackedObject, ...Ancestors<Strict>] | [StackedObject?];
  /**
   * ancestors that are of `other` only
   */
  otherFork: [StackedObject, ...Ancestors<Strict>] | [StackedObject?];
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
   *
   * @param {boolean} [strict] returns only ancestors that are objects (without canvas)
   * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
   */
  getAncestors<T extends boolean>(strict?: T): Ancestors<T> {
    const ancestors: TAncestor[] = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let parent: TAncestor | undefined = this;
    do {
      parent =
        parent instanceof StackedObject
          ? parent.parent ?? (!strict ? parent.canvas : undefined)
          : undefined;
      parent && ancestors.push(parent);
    } while (parent);
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
        common: [this, ...(this.getAncestors(strict) as Ancestors<S>)],
      };
    }

    type AncestorsTuple = Omit<Ancestors<S>, 'slice'> & {
      // Don't widen the tuple to a generic array
      slice: (from?: number, to?: number) => Ancestors<S>;
    };
    const ancestors = this.getAncestors(strict) as AncestorsTuple;
    const otherAncestors = other.getAncestors(strict) as AncestorsTuple;

    //  if `this` has no ancestors and `this` is top ancestor of `other` we must handle the following case
    if (
      ancestors.length === 0 &&
      otherAncestors.length > 0 &&
      isGroup(this) &&
      this === otherAncestors[otherAncestors.length - 1]
    ) {
      return {
        fork: [],
        otherFork: [
          other,
          ...otherAncestors.slice(0, otherAncestors.length - 1),
        ],
        common: [this],
      };
    }
    //  compare ancestors
    for (let i = 0, ancestor; i < ancestors.length; i++) {
      ancestor = ancestors[i];
      if (isGroup(other) && ancestor === other) {
        return {
          fork: [this, ...ancestors.slice(0, i)],
          otherFork: [],
          common: ancestors.slice(i),
        };
      }
      for (let j = 0; j < otherAncestors.length; j++) {
        if (isGroup(this) && this === otherAncestors[j]) {
          return {
            fork: [],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: [this, ...ancestors.slice()],
          };
        }
        if (ancestor === otherAncestors[j]) {
          return {
            fork: [this, ...ancestors.slice(0, i)],
            otherFork: [other, ...otherAncestors.slice(0, j)],
            common: ancestors.slice(i),
          };
        }
      }
    }
    // nothing shared
    return {
      fork: [this, ...ancestors.slice()],
      otherFork: [other, ...otherAncestors.slice()],
      common: [],
    };
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
    if (ancestorData.fork.includes(other)) {
      return true;
    }
    if (ancestorData.otherFork.includes(this)) {
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
