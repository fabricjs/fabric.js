import type { CollectionEvents, ObjectEvents } from '../EventTypeDefs';
import type { TClassProperties, TSVGReviver, TOptions, Abortable } from '../typedefs';
import { FabricObject } from './Object/FabricObject';
import type { FabricObjectProps, SerializedObjectProps } from './Object/types';
import type { ImperativeLayoutOptions, LayoutBeforeEvent, LayoutAfterEvent } from '../LayoutManager/types';
import { LayoutManager } from '../LayoutManager/LayoutManager';
import type { SerializedLayoutManager } from '../LayoutManager/LayoutManager';
export interface GroupEvents extends ObjectEvents, CollectionEvents {
    'layout:before': LayoutBeforeEvent;
    'layout:after': LayoutAfterEvent;
}
export interface GroupOwnProps {
    subTargetCheck: boolean;
    interactive: boolean;
}
export interface SerializedGroupProps extends SerializedObjectProps, GroupOwnProps {
    objects: SerializedObjectProps[];
    layoutManager: SerializedLayoutManager;
}
export interface GroupProps extends FabricObjectProps, GroupOwnProps {
    layoutManager: LayoutManager;
}
export declare const groupDefaultValues: Partial<TClassProperties<Group>>;
declare const Group_base: {
    new (...args: any[]): {
        _objects: FabricObject[];
        _onObjectAdded(object: FabricObject): void;
        _onObjectRemoved(object: FabricObject): void;
        _onStackOrderChanged(object: FabricObject): void;
        add(...objects: FabricObject[]): number;
        insertAt(index: number, ...objects: FabricObject[]): number;
        remove(...objects: FabricObject[]): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
        forEachObject(callback: (object: FabricObject, index: number, array: FabricObject[]) => any): void;
        getObjects(...types: string[]): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
        item(index: number): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>;
        isEmpty(): boolean;
        size(): number;
        contains(object: FabricObject, deep?: boolean): boolean;
        complexity(): number;
        sendObjectToBack(object: FabricObject): boolean;
        bringObjectToFront(object: FabricObject): boolean;
        sendObjectBackwards(object: FabricObject, intersecting?: boolean): boolean;
        bringObjectForward(object: FabricObject, intersecting?: boolean): boolean;
        moveObjectTo(object: FabricObject, index: number): boolean;
        findNewLowerIndex(object: FabricObject, idx: number, intersecting?: boolean): number;
        findNewUpperIndex(object: FabricObject, idx: number, intersecting?: boolean): number;
        collectObjects({ left, top, width, height }: import("../typedefs").TBBox, { includeIntersecting }?: {
            includeIntersecting?: boolean;
        }): import("./Object/InteractiveObject").InteractiveFabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
    };
} & {
    new (options?: GroupProps | undefined): FabricObject<GroupProps, SerializedGroupProps, GroupEvents>;
    ownDefaults: Partial<TClassProperties<import("./Object/InteractiveObject").InteractiveFabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>>>;
    getDefaults(): Record<string, any>;
    createControls(): {
        controls: Record<string, import("../..").Control>;
    };
    stateProperties: string[];
    cacheProperties: string[];
    type: string;
    colorProperties: string[];
    customProperties: string[];
    _fromObject<S extends import("./Object/Object").FabricObject>({ type, ...serializedObjectOptions }: Record<string, unknown>, { extraParam, ...options }?: Abortable & {
        extraParam?: string;
    }): Promise<S>;
    fromObject<T extends TOptions<SerializedObjectProps>>(object: T, options?: Abortable): Promise<import("./Object/Object").FabricObject<Partial<import("./Object/types/ObjectProps").ObjectProps>, SerializedObjectProps, ObjectEvents>>;
};
/**
 * @fires object:added
 * @fires object:removed
 * @fires layout:before
 * @fires layout:after
 */
export declare class Group extends Group_base implements GroupProps {
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
     * This will be not removed but slowly replaced with a method setInteractive
     * that will take care of enabling subTargetCheck and necessary object events.
     * There is too much attached to group interactivity to just be evaluated by a
     * boolean in the code
     * @default
     * @deprecated
     * @type boolean
     */
    interactive: boolean;
    layoutManager: LayoutManager;
    /**
     * Used internally to optimize performance
     * Once an object is selected, instance is rendered without the selected object.
     * This way instance is cached only once for the entire interaction with the selected object.
     * @private
     */
    protected _activeObjects: FabricObject[];
    static type: string;
    static ownDefaults: Record<string, any>;
    private __objectSelectionTracker;
    private __objectSelectionDisposer;
    static getDefaults(): Record<string, any>;
    /**
     * Constructor
     *
     * @param {FabricObject[]} [objects] instance objects
     * @param {Object} [options] Options object
     */
    constructor(objects?: FabricObject[], options?: Partial<GroupProps>);
    /**
     * Shared code between group and active selection
     * Meant to be used by the constructor.
     */
    protected groupInit(objects: FabricObject[], options: {
        layoutManager?: LayoutManager;
        top?: number;
        left?: number;
    }): void;
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
    protected _filterObjectsBeforeEnteringGroup(objects: FabricObject[]): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
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
    remove(...objects: FabricObject[]): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
    _onObjectAdded(object: FabricObject): void;
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
    removeAll(): FabricObject<Partial<FabricObjectProps>, SerializedObjectProps, ObjectEvents>[];
    /**
     * keeps track of the selected objects
     * @private
     */
    __objectSelectionMonitor<T extends boolean>(selected: T, { target: object, }: ObjectEvents[T extends true ? 'selected' : 'deselected']): void;
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
     */
    enterGroup(object: FabricObject, removeParentTransform?: boolean): void;
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
     * Executes the inner fabric logic of exiting a group.
     * - Stop watching the object
     * - Remove the object from the optimization map this._activeObjects
     * - unset the group property of the object
     * @protected
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
     * @override
     * @return {Boolean}
     */
    setCoords(): void;
    triggerLayout(options?: ImperativeLayoutOptions): void;
    /**
     * Renders instance on a given context
     * @param {CanvasRenderingContext2D} ctx context to render instance on
     */
    render(ctx: CanvasRenderingContext2D): void;
    /**
     *
     * @private
     * @param {'toObject'|'toDatalessObject'} [method]
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @returns {FabricObject[]} serialized objects
     */
    __serializeObjects(method: 'toObject' | 'toDatalessObject', propertiesToInclude?: string[]): any[];
    /**
     * Returns object representation of an instance
     * @param {string[]} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject<T extends Omit<GroupProps & TClassProperties<this>, keyof SerializedGroupProps>, K extends keyof T = never>(propertiesToInclude?: K[]): Pick<T, K> & SerializedGroupProps;
    toString(): string;
    dispose(): void;
    /**
     * @private
     */
    _createSVGBgRect(reviver?: TSVGReviver): string;
    /**
     * Returns svg representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    _toSVG(reviver?: TSVGReviver): string[];
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
    toClipPathSVG(reviver?: TSVGReviver): string;
    /**
     * @todo support loading from svg
     * @private
     * @static
     * @memberOf Group
     * @param {Object} object Object to create a group from
     * @returns {Promise<Group>}
     */
    static fromObject<T extends TOptions<SerializedGroupProps>>({ type, objects, layoutManager, ...options }: T, abortable?: Abortable): Promise<Group>;
}
export {};
//# sourceMappingURL=Group.d.ts.map