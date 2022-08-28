
export type TRegistry<T = unknown, D = unknown, S extends SVGElement = SVGElement, O = unknown> = {
    fromJSON(data: D): T | Promise<T>;
    fromSVG(svgEl: S, options: O): T | Promise<T>;
}

export type TClassIO<T = unknown, D = unknown, S extends SVGElement = SVGElement, O = unknown> = {
    prototype: {
        type: string
    };
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

    /**
     * override for custom handling
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resolve(type: string, data: object) {
        return this.registry.get(type);
    }
}

export const registry = new Registry();



