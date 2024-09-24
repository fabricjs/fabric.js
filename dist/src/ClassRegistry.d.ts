export declare const JSON = "json";
export declare const SVG = "svg";
export declare class ClassRegistry {
    [JSON]: Map<string, any>;
    [SVG]: Map<string, any>;
    constructor();
    has(classType: string): boolean;
    getClass<T>(classType: string): T;
    setClass(classConstructor: any, classType?: string): void;
    getSVGClass(SVGTagName: string): any;
    setSVGClass(classConstructor: any, SVGTagName?: string): void;
}
export declare const classRegistry: ClassRegistry;
//# sourceMappingURL=ClassRegistry.d.ts.map