import type { CollectionEvents, ObjectEvents } from '../EventTypeDefs';
import { Point } from '../point.class';
import type { TClassProperties } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
export type LayoutContextType = 'initialization' | 'object_modified' | 'added' | 'removed' | 'layout_change' | 'imperative';
export type LayoutContext = {
    type: LayoutContextType;
    /**
     * array of objects starting from the object that triggered the call to the current one
     */
    path?: Group[];
    [key: string]: any;
};
export type GroupEvents = ObjectEvents & CollectionEvents & {
    layout: {
        context: LayoutContext;
        result: LayoutResult;
        diff: Point;
    };
};
export type LayoutStrategy = 'fit-content' | 'fit-content-lazy' | 'fixed' | 'clip-path';
/**
 * positioning and layout data **relative** to instance's parent
 */
export type LayoutResult = {
    /**
     * new centerX as measured by the containing plane (same as `left` with `originX` set to `center`)
     */
    centerX: number;
    /**
     * new centerY as measured by the containing plane (same as `top` with `originY` set to `center`)
     */
    centerY: number;
    /**
     * correctionX to translate objects by, measured as `centerX`
     */
    correctionX?: number;
    /**
     * correctionY to translate objects by, measured as `centerY`
     */
    correctionY?: number;
    width: number;
    height: number;
};
declare const Group_base: {
    new (...args: any[]): {
        _objects: FabricObject<ObjectEvents>[];
        _onObjectAdded(object: FabricObject<ObjectEvents>): void;
        _onObjectRemoved(object: FabricObject<ObjectEvents>): void;
        _onStackOrderChanged(object: FabricObject<ObjectEvents>): void;
        add(...objects: FabricObject<ObjectEvents>[]): number;
        insertAt(index: number, ...objects: FabricObject<ObjectEvents>[]): number;
        remove(...objects: FabricObject<ObjectEvents>[]): FabricObject<ObjectEvents>[];
        forEachObject(callback: (object: FabricObject<ObjectEvents>, index: number, array: FabricObject<ObjectEvents>[]) => any): void;
        getObjects(...types: string[]): FabricObject<ObjectEvents>[];
        item(index: number): FabricObject<ObjectEvents>;
        isEmpty(): boolean;
        size(): number;
        contains(object: FabricObject<ObjectEvents>, deep?: boolean | undefined): boolean;
        complexity(): number;
        sendObjectToBack(object: FabricObject<ObjectEvents>): boolean;
        bringObjectToFront(object: FabricObject<ObjectEvents>): boolean;
        sendObjectBackwards(object: FabricObject<ObjectEvents>, intersecting?: boolean | undefined): boolean;
        bringObjectForward(object: FabricObject<ObjectEvents>, intersecting?: boolean | undefined): boolean;
        moveObjectTo(object: FabricObject<ObjectEvents>, index: number): boolean;
        findNewLowerIndex(object: FabricObject<ObjectEvents>, idx: number, intersecting?: boolean | undefined): number;
        findNewUpperIndex(object: FabricObject<ObjectEvents>, idx: number, intersecting?: boolean | undefined): number;
    };
} & {
    new (options?: Record<string, unknown> | undefined): FabricObject<GroupEvents>;
    _fromObject(object: Record<string, unknown>, { extraParam, ...options }?: {
        extraParam?: any;
        signal?: AbortSignal | undefined;
    }): Promise<import("./Object/Object").FabricObject<ObjectEvents>>;
    fromObject(object: Record<string, unknown>, options?: {
        signal?: AbortSignal | undefined;
    } | undefined): Promise<import("./Object/Object").FabricObject<ObjectEvents>>;
};
/**
 * @fires object:added
 * @fires object:removed
 * @fires layout once layout completes
 */
export declare class Group extends Group_base {
    /**
     * Specifies the **layout strategy** for instance
     * Used by `getLayoutStrategyResult` to calculate layout
     * `fit-content`, `fit-content-lazy`, `fixed`, `clip-path` are supported out of the box
     * @type LayoutStrategy
     * @default
     */
    layout: LayoutStrategy;
    /**
     * Used to optimize performance
     * set to `false` if you don't need contained objects to be targets of events
     * @default
     * @type boolean
     */
    subTargetCheck: boolean;
    /**
     * Used to allow targeting of object inside groups.
     * set to true if you want to select an object inside a group.\
     * **REQUIRES** `subTargetCheck` set to true
     * @default
     * @type boolean
     */
    interactive: boolean;
    /**
     * Used internally to optimize performance
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     * @private
     */
    protected _activeObjects: FabricObject[];
    /**
     * Constructor
     *
     * @param {FabricObject[]} [objects] instance objects
     * @param {Object} [options] Options object
     * @param {boolean} [objectsRelativeToGroup] true if objects exist in group coordinate plane
     */
    constructor(objects?: FabricObject[], options?: any, objectsRelativeToGroup?: boolean);
    /**
     * Checks if object can enter group and logs relevant warnings
     * @private
     * @param {FabricObject} object
     * @returns
     */
    canEnterGroup(object: FabricObject): boolean;
    /**
     * Override this method to enhance performance (for groups with a lot of objects).
     * If Overriding, be sure not pass illegal objects to group - it will break your app.
     * @private
     */
    protected _filterObjectsBeforeEnteringGroup(objects: FabricObject[]): FabricObject<ObjectEvents>[];
    /**
     * Add objects
     * @param {...FabricObject[]} objects
     */
    add(...objects: FabricObject[]): number;
    /**
     * Inserts an object into collection at specified index
     * @param {FabricObject[]} objects Object to insert
     * @param {Number} index Index to insert object at
     */
    insertAt(index: number, ...objects: FabricObject[]): number;
    /**
     * Remove objects
     * @param {...FabricObject[]} objects
     * @returns {FabricObject[]} removed objects
     */
    remove(...objects: FabricObject[]): FabricObject<ObjectEvents>[];
    _onObjectAdded(object: FabricObject): void;
    _onRelativeObjectAdded(object: FabricObject): void;
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
     */
    _onObjectRemoved(object: FabricObject, removeParentTransform?: boolean): void;
    /**
     * @private
     * @param {'added'|'removed'} type
     * @param {FabricObject[]} targets
     */
    _onAfterObjectsChange(type: 'added' | 'removed', targets: FabricObject[]): void;
    _onStackOrderChanged(): void;
    /**
     * @private
     * @param {string} key
     * @param {*} value
     */
    _set(key: string, value: any): this;
    /**
     * @private
     */
    _shouldSetNestedCoords(): boolean;
    /**
     * Remove all objects
     * @returns {FabricObject[]} removed objects
     */
    removeAll(): FabricObject<ObjectEvents>[];
    /**
     * invalidates layout on object modified
     * @private
     */
    __objectMonitor(opt: any): void;
    /**
     * keeps track of the selected objects
     * @private
     */
    __objectSelectionMonitor(selected: boolean, opt: any): void;
    /**
     * @private
     * @param {boolean} watch
     * @param {FabricObject} object
     */
    _watchObject(watch: boolean, object: FabricObject): void;
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
     * @returns {boolean} true if object entered group
     */
    enterGroup(object: FabricObject, removeParentTransform?: boolean): boolean;
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object is in canvas coordinate plane
     */
    _enterGroup(object: FabricObject, removeParentTransform?: boolean): void;
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
     */
    exitGroup(object: FabricObject, removeParentTransform?: boolean): void;
    /**
     * @private
     * @param {FabricObject} object
     * @param {boolean} [removeParentTransform] true if object should exit group without applying group's transform to it
     */
    _exitGroup(object: FabricObject, removeParentTransform?: boolean): void;
    /**
     * Decide if the object should cache or not. Create its own cache level
     * needsItsOwnCache should be used when the object drawing method requires
     * a cache step. None of the fabric classes requires it.
     * Generally you do not cache objects in groups because the group is already cached.
     * @return {Boolean}
     */
    shouldCache(): boolean;
    /**
     * Check if this object or a child object will cast a shadow
     * @return {Boolean}
     */
    willDrawShadow(): boolean;
    /**
     * Check if instance or its group are caching, recursively up
     * @return {Boolean}
     */
    isOnACache(): boolean;
    /**
     * Execute the drawing operation for an object on a specified context
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    drawObject(ctx: CanvasRenderingContext2D): void;
    /**
     * Check if cache is dirty
     */
    isCacheDirty(skipCanvas?: boolean): boolean;
    /**
     * @override
     * @return {Boolean}
     */
    setCoords(): void;
    /**
     * Renders instance on a given context
     * @param {CanvasRenderingContext2D} ctx context to render instance on
     */
    render(ctx: CanvasRenderingContext2D): void;
    /**
     * @public
     * @param {Partial<LayoutResult> & { layout?: string }} [context] pass values to use for layout calculations
     */
    triggerLayout(context: any): void;
    /**
     * @private
     * @param {FabricObject} object
     * @param {Point} diff
     */
    _adjustObjectPosition(object: FabricObject, diff: Point): void;
    /**
     * initial layout logic:
     * calculate bbox of objects (if necessary) and translate it according to options received from the constructor (left, top, width, height)
     * so it is placed in the center of the bbox received from the constructor
     *
     * @private
     * @param {LayoutContext} context
     */
    _applyLayoutStrategy(context: any): void;
    /**
     * Override this method to customize layout.
     * If you need to run logic once layout completes use `onLayout`
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    getLayoutStrategyResult(layoutDirective: LayoutStrategy, objects: FabricObject[], context: LayoutContext): any;
    /**
     * Override this method to customize layout.
     * A wrapper around {@link Group#getObjectsBoundingBox}
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    prepareBoundingBox(layoutDirective: LayoutStrategy, objects: FabricObject[], context: LayoutContext): any;
    /**
     * Calculates center taking into account originX, originY while not being sure that width/height are initialized
     * @public
     * @param {string} layoutDirective
     * @param {FabricObject[]} objects
     * @param {LayoutContext} context
     * @returns {LayoutResult | undefined}
     */
    prepareInitialBoundingBox(layoutDirective: LayoutStrategy, objects: FabricObject[], context: LayoutContext): {
        centerX: number;
        centerY: number;
        correctionX: number;
        correctionY: number;
        width: number;
        height: number;
    } | undefined;
    /**
     * Calculate the bbox of objects relative to instance's containing plane
     * @public
     * @param {FabricObject[]} objects
     * @returns {LayoutResult | null} bounding box
     */
    getObjectsBoundingBox(objects: FabricObject[], ignoreOffset?: boolean): LayoutResult | null;
    /**
     * Hook that is called once layout has completed.
     * Provided for layout customization, override if necessary.
     * Complements `getLayoutStrategyResult`, which is called at the beginning of layout.
     * @public
     * @param {LayoutContext} context layout context
     * @param {LayoutResult} result layout result
     */
    onLayout(context: LayoutContext, result: LayoutResult): void;
    /**
     *
     * @private
     * @param {'toObject'|'toDatalessObject'} [method]
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @returns {FabricObject[]} serialized objects
     */
    __serializeObjects(method: 'toObject' | 'toDatalessObject', propertiesToInclude?: (keyof this)[]): Record<string, any>[];
    /**
     * Returns object representation of an instance
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude?: (keyof this)[]): Record<string, any>;
    toString(): string;
    dispose(): void;
    /**
     * @private
     */
    _createSVGBgRect(reviver?: (markup: string) => any): string;
    /**
     * Returns svg representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG(reviver?: (markup: string) => any): string[];
    /**
     * Returns styles-string for svg-export, specific version for group
     * @return {String}
     */
    getSvgStyles(): string;
    /**
     * Returns svg clipPath representation of an instance
     * @param {Function} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG(reviver?: (markup: string) => any): string;
    /**
     * @todo support loading from svg
     * @private
     * @static
     * @memberOf Group
     * @param {Object} object Object to create a group from
     * @returns {Promise<Group>}
     */
    static fromObject({ objects, ...options }: {
        [x: string]: any;
        objects?: never[] | undefined;
    }): Promise<Group>;
}
export declare const groupDefaultValues: Partial<TClassProperties<Group>>;
export {};
//# sourceMappingURL=group.class.d.ts.map