import type { ObjectEvents } from '../../EventTypeDefs';
import type { Group } from '../Group';
import type { Canvas } from '../../canvas/Canvas';
import type { StaticCanvas } from '../../canvas/StaticCanvas';
import { ObjectGeometry } from './ObjectGeometry';
type TAncestor = StackedObject | Canvas | StaticCanvas;
export type Ancestors = [StackedObject | Group] | [StackedObject | Group, ...Group[]] | Group[];
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
export declare class StackedObject<EventSpec extends ObjectEvents = ObjectEvents> extends ObjectGeometry<EventSpec> {
    /**
     * A reference to the parent of the object
     * Used to keep the original parent ref when the object has been added to an ActiveSelection, hence loosing the `group` ref
     */
    parent?: Group;
    /**
     * Checks if object is descendant of target
     * Should be used instead of {@link Group.contains} or {@link StaticCanvas.contains} for performance reasons
     * @param {TAncestor} target
     * @returns {boolean}
     */
    isDescendantOf(target: TAncestor): boolean;
    /**
     * @returns {Ancestors} ancestors (excluding `ActiveSelection`) from bottom to top
     */
    getAncestors(): Ancestors;
    /**
     * Compare ancestors
     *
     * @param {StackedObject} other
     * @returns {AncestryComparison} an object that represent the ancestry situation.
     */
    findCommonAncestors<T extends this>(other: T): AncestryComparison;
    /**
     *
     * @param {StackedObject} other
     * @returns {boolean}
     */
    hasCommonAncestors<T extends this>(other: T): boolean;
    /**
     *
     * @param {FabricObject} other object to compare against
     * @returns {boolean | undefined} if objects do not share a common ancestor or they are strictly equal it is impossible to determine which is in front of the other; in such cases the function returns `undefined`
     */
    isInFrontOf<T extends this>(other: T): boolean | undefined;
}
export {};
//# sourceMappingURL=StackedObject.d.ts.map