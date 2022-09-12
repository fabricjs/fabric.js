
export type TRegistry<T extends FunctionConstructor = FunctionConstructor> = {
    json(data: unknown, options?: unknown): T | Promise<T>;
    svg?(svgEl: SVGElement, instance: T, options: unknown): T | Promise<T>;
}

type TJSONData = {
    type: string
}

export type TClassIO<T extends FunctionConstructor = FunctionConstructor> = T & {
    fromObject(data: TJSONData, options?: unknown): T | Promise<T>;
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
        const key = this.resolveJSONKey(data);
        const handler = this.registry.get(key)?.json;
        if (!handler) {
            throw new Error(`fabric: failed to get JSON handler for ${key}`);
        }
        return handler;
    }

    getSVGHandler<T extends SVGElement>(el: T) {
        const key = this.resolveSVGKey(el);
        const handler = this.registry.get(key)?.svg;
        if (!handler) {
            throw new Error(`fabric: failed to get SVG handler for ${key}`);
        }
        return handler;
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
