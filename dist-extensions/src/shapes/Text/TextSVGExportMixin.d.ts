import type { TSVGReviver } from '../../typedefs';
import { FabricObjectSVGExportMixin } from '../Object/FabricObjectSVGExportMixin';
import { type TextStyleDeclaration } from './StyledText';
import type { FabricText } from './Text';
export declare class TextSVGExportMixin extends FabricObjectSVGExportMixin {
    _toSVG(this: TextSVGExportMixin & FabricText): string[];
    toSVG(this: TextSVGExportMixin & FabricText, reviver?: TSVGReviver): string;
    private _getSVGLeftTopOffsets;
    private _wrapSVGTextAndBg;
    /**
     * @private
     * @param {Number} textTopOffset Text top offset
     * @param {Number} textLeftOffset Text left offset
     * @return {Object}
     */
    private _getSVGTextAndBg;
    private _createTextCharSpan;
    private _setSVGTextLineText;
    private _setSVGTextLineBg;
    /**
     * @deprecated unused
     */
    _getSVGLineTopOffset(this: TextSVGExportMixin & FabricText, lineIndex: number): {
        lineTop: number;
        offset: number;
    };
    /**
     * Returns styles-string for svg-export
     * @param {Boolean} skipShadow a boolean to skip shadow filter output
     * @return {String}
     */
    getSvgStyles(this: TextSVGExportMixin & FabricText, skipShadow?: boolean): string;
    /**
     * Returns styles-string for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @param {Boolean} useWhiteSpace a boolean to include an additional attribute in the style.
     * @return {String}
     */
    getSvgSpanStyles(this: TextSVGExportMixin & FabricText, style: TextStyleDeclaration, useWhiteSpace?: boolean): string;
    /**
     * Returns text-decoration property for svg-export
     * @param {Object} style the object from which to retrieve style properties
     * @return {String}
     */
    getSvgTextDecoration(this: TextSVGExportMixin & FabricText, style: TextStyleDeclaration): string;
}
//# sourceMappingURL=TextSVGExportMixin.d.ts.map