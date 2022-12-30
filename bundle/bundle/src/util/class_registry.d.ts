export declare const JSON = "json";
export declare const SVG = "svg";
export declare class ClassRegistry {
    [JSON]: Map<string, any>;
    [SVG]: Map<string, any>;
    constructor();
    getClass(classType: string): any;
    setClass(classConstructor: any, classType?: string): void;
    getSVGClass(SVGTagName: string): any;
    setSVGClass(classConstructor: any, SVGTagName?: string): void;
}
declare const classRegistry: ClassRegistry;
export { classRegistry };
//# sourceMappingURL=class_registry.d.ts.map