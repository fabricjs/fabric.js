export type TSVGReviver = (markup: string) => string;
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
    getSvgStyles(skipShadow?: boolean): string;
    /**
     * Returns styles-string for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
     * @return {String}
     */
    getSvgSpanStyles(style: any, useWhiteSpace?: boolean): string;
    /**
     * Returns text-decoration property for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @return {String}
     */
    getSvgTextDecoration(style: any): string;
    /**
     * Returns filter for svg shadow
     * @return {String}
     */
    getSvgFilter(): string;
    /**
     * Returns id attribute for svg output
     * @return {String}
     */
    getSvgCommons(): string;
    /**
     * Returns transform-string for svg-export
     * @param {Boolean} use the full transform or the single object one.
     * @return {String}
     */
    getSvgTransform(full?: boolean, additionalTransform?: string): string;
    _setSVGBg(textBgRects: string[]): void;
    /**
     * Returns svg representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toSVG(reviver?: TSVGReviver): string;
    /**
     * Returns svg clipPath representation of an instance
     * @param {TSVGReviver} [reviver] Method for further parsing of svg representation.
     * @return {String} svg representation of an instance
     */
    toClipPathSVG(reviver?: TSVGReviver): string;
    /**
     * @private
     */
    _createBaseClipPathSVGMarkup(objectMarkup: string[], { reviver, additionalTransform, }?: {
        reviver?: TSVGReviver;
        additionalTransform?: string;
    }): string;
    /**
     * @private
     */
    _createBaseSVGMarkup(objectMarkup: string[], { noStyle, reviver, withShadow, additionalTransform, }?: {
        noStyle?: boolean;
        reviver?: TSVGReviver;
        withShadow?: boolean;
        additionalTransform?: string;
    }): string;
    addPaintOrder(): string;
}
//# sourceMappingURL=object.svg_export.d.ts.map