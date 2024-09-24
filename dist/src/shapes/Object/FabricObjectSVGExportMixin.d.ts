import type { TSVGReviver } from '../../typedefs';
import type { FabricObject } from './FabricObject';
export declare class FabricObjectSVGExportMixin {
    /**
     * When an object is being exported as SVG as a clippath, a reference inside the SVG is needed.
     * This reference is a UID in the fabric namespace and is temporary stored here.
     * @type {String}
     */
    clipPathId?: string;
    /**
     * Returns styles-string for svg-export
     * @param {Boolean} skipShadow a boolean to skip shadow filter output
     * @return {String}
     */
    getSvgStyles(this: FabricObjectSVGExportMixin & FabricObject, skipShadow?: boolean): string;
    /**
     * Returns filter for svg shadow
     * @return {String}
     */
    getSvgFilter(this: FabricObjectSVGExportMixin & FabricObject): string;
    /**
     * Returns id attribute for svg output
     * @return {String}
     */
    getSvgCommons(this: FabricObjectSVGExportMixin & FabricObject & {
        id?: string;
    }): string;
    /**
     * Returns transform-string for svg-export
     * @param {Boolean} use the full transform or the single object one.
     * @return {String}
     */
    getSvgTransform(this: FabricObjectSVGExportMixin & FabricObject, full?: boolean, additionalTransform?: string): string;
    /**
     * Returns svg representation of an instance
     * This function is implemented in each subclass
     * This is just because typescript otherwise cryies all the time
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    _toSVG(_reviver?: TSVGReviver): string[];
    /**
     * Returns svg representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG(this: FabricObjectSVGExportMixin & FabricObject, reviver?: TSVGReviver): string;
    /**
     * Returns svg clipPath representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG(this: FabricObjectSVGExportMixin & FabricObject, reviver?: TSVGReviver): string;
    /**
     * @private
     */
    _createBaseClipPathSVGMarkup(this: FabricObjectSVGExportMixin & FabricObject, objectMarkup: string[], { reviver, additionalTransform, }?: {
        reviver?: TSVGReviver;
        additionalTransform?: string;
    }): string;
    /**
     * @private
     */
    _createBaseSVGMarkup(this: FabricObjectSVGExportMixin & FabricObject, objectMarkup: string[], { noStyle, reviver, withShadow, additionalTransform, }?: {
        noStyle?: boolean;
        reviver?: TSVGReviver;
        withShadow?: boolean;
        additionalTransform?: string;
    }): string;
    addPaintOrder(this: FabricObjectSVGExportMixin & FabricObject): string;
}
//# sourceMappingURL=FabricObjectSVGExportMixin.d.ts.map