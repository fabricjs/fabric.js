export type ParsedViewboxTransform = Partial<{
    width: number;
    height: number;
    minX: number;
    minY: number;
    viewBoxWidth: number;
    viewBoxHeight: number;
}>;
/**
 * Add a <g> element that envelop all child elements and makes the viewbox transformMatrix descend on all elements
 */
export declare function applyViewboxTransform(element: Element): ParsedViewboxTransform;
//# sourceMappingURL=applyViewboxTransform.d.ts.map