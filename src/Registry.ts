
export type TRegistry<T = unknown, D = unknown, S extends SVGElement = SVGElement, O = unknown> = {
    json(data: D): T | Promise<T>;
    svg?(svgEl: S, instance: T, options: O): T | Promise<T>;
}

type TJSONData = {
    type: string
}

export type TClassIO<T = unknown> = Function & {
    fromObject(data: TJSONData): T | Promise<T>;
    fromElement?(svgEl: SVGElement, instance: T, options: unknown): T | Promise<T>;
}

export class Registry {
    readonly registry: Map<string, TRegistry>

    constructor(registry?: Map<string, TRegistry>) {
        this.registry = new Map(registry);
    }

    register(type: string, value: TRegistry) {
        return this.registry.set(type, value);
    }

    registerClass<T extends TClassIO>(key: string, klass: T) {
        this.register(key, {
            json: klass.fromObject,
            svg: klass.fromElement
        });
    }

    resolveJSONKey<T extends TJSONData>(data: T) {
        return data.type;
    }

    resolveSVGKey(el: SVGElement) {
        return el.tagName.replace('svg:', '');
    }

    getJSONHandler<T extends TJSONData>(data: T) {
        return this.registry.get(this.resolveJSONKey(data))?.json;
    }

    getSVGHandler<T extends SVGElement>(el: T) {
        return this.registry.get(this.resolveSVGKey(el))?.svg;
    }
}

export const registry = new Registry();

export function registerClass<T extends TClassIO>(klass: T): void
export function registerClass<T extends TClassIO>(key: string, klass: T): void
export function registerClass<T extends TClassIO>(arg0: string | T, arg1?: T) {
    if (typeof arg0 === 'string') {
        registry.registerClass(arg0, arg1 as T);
    }
    else {
        registry.registerClass(arg0.name.toLowerCase(), arg0);
    }
}
