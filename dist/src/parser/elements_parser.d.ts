import type { FabricObject } from '../shapes/Object/FabricObject';
import type { LoadImageOptions } from '../util';
import type { CSSRules, TSvgReviverCallback } from './typedefs';
import type { ParsedViewboxTransform } from './applyViewboxTransform';
type StorageType = {
    fill: SVGGradientElement;
    stroke: SVGGradientElement;
    clipPath: Element[];
};
type NotParsedFabricObject = FabricObject & {
    fill: string;
    stroke: string;
    clipPath?: string;
    clipRule?: CanvasFillRule;
};
export declare class ElementsParser {
    elements: Element[];
    options: LoadImageOptions & ParsedViewboxTransform;
    reviver?: TSvgReviverCallback;
    regexUrl: RegExp;
    doc: Document;
    clipPaths: Record<string, Element[]>;
    gradientDefs: Record<string, SVGGradientElement>;
    cssRules: CSSRules;
    constructor(elements: Element[], options: LoadImageOptions & ParsedViewboxTransform, reviver: TSvgReviverCallback | undefined, doc: Document, clipPaths: Record<string, Element[]>);
    parse(): Promise<Array<FabricObject | null>>;
    createObject(el: Element): Promise<FabricObject | null>;
    extractPropertyDefinition(obj: NotParsedFabricObject, property: 'fill' | 'stroke' | 'clipPath', storage: Record<string, StorageType[typeof property]>): StorageType[typeof property] | undefined;
    resolveGradient(obj: NotParsedFabricObject, el: Element, property: 'fill' | 'stroke'): void;
    resolveClipPath(obj: NotParsedFabricObject, usingElement: Element): Promise<void>;
}
export {};
//# sourceMappingURL=elements_parser.d.ts.map