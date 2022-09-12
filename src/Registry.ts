
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

    registerClass(key: string, klass: TClassIO) {
        this.register(key, {
            json: klass.fromObject,
            svg: klass.fromElement
        });
    }

    resolveJSONKey(data: Record<string, unknown>) {
        return data.type as string | undefined;
    }

    resolveSVGKey(el: SVGElement) {
        return el.tagName.replace('svg:', '');
    }

    getJSONHandler(data: Record<string, unknown>) {
        const key = this.resolveJSONKey(data);
        const handler = !!key && this.registry.get(key)?.json;
        if (!handler) {
            throw new Error(`fabric: failed to get JSON handler for key "${key}"`);
        }
        return handler;
    }

    getSVGHandler(el: SVGElement) {
        const key = this.resolveSVGKey(el);
        const handler = this.registry.get(key)?.svg;
        if (!handler) {
            throw new Error(`fabric: failed to get SVG handler for key "${key}"`);
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
