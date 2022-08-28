
export type TRegistry<T = unknown, D = unknown, S extends SVGElement = SVGElement, O = unknown> = {
    fromJSON(data: D): T | Promise<T>;
    fromSVG(svgEl: S, options: O): T | Promise<T>;
}

type TClassIdentifier = {
    prototype: {
        type: string
    }
}

export type TClassIO<T = unknown, D = unknown, S extends SVGElement = SVGElement, O = unknown> = TClassIdentifier & {
    fromObject(data: D): T | Promise<T>;
    fromElement(svgEl: S, options: O): T | Promise<T>;
}

export class Registry {
    readonly registry: Map<string, TRegistry>

    constructor(registry?: Map<string, TRegistry>) {
        this.registry = new Map(registry);
    }

    register(type: string, value: TRegistry) {
        return this.registry.set(type, value);
    }

    registerClass<T extends TClassIO>(klass: T) {
        this.register(klass.prototype.type, {
            fromJSON: klass.fromObject,
            fromSVG: klass.fromElement
        });
    }

    fromJSON<T extends { type: string }>(data: T) {
        return this.registry.get(data.type)?.fromJSON(data);
    }

    resolveSVGType(el: SVGElement) {
        return el.tagName.replace('svg:', '');
    }

    fromSVG<T extends SVGElement, S>(el: T, options: S) {
        return this.registry.get(this.resolveSVGType(el))?.fromSVG(el, options);
    }
}

export const registry = new Registry();
