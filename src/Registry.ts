export type TRegistry<T extends FunctionConstructor = FunctionConstructor> = {
  json(data: unknown, options?: unknown): T | Promise<T>;
  svg?(svgEl: SVGElement, instance: T, options: unknown): T | Promise<T>;
};

type TJSONData = {
  type: string;
};

export type TClassIO<T extends FunctionConstructor = FunctionConstructor> =
  T & {
    fromObject(data: TJSONData, options?: unknown): T | Promise<T>;
    fromElement?(
      svgEl: SVGElement,
      instance: T,
      options: unknown
    ): T | Promise<T>;
  };

export class Registry {
  readonly registry: Map<string, TRegistry>;

  constructor(registry?: Map<string, TRegistry>) {
    this.registry = new Map(registry);
  }

  register(type: string, value: TRegistry) {
    return this.registry.set(type, value);
  }

  registerClass(key: string, klass: TClassIO) {
    this.register(key, {
      json: klass.fromObject,
      svg: klass.fromElement,
    });
  }

  resolveJSONKey(data: Record<string, unknown>) {
    // backward compatibility
    if (data.colorStops) {
      return 'gradient';
    }
    return data.type as string | undefined;
  }

  resolveSVGKey(el: SVGElement) {
    return el.tagName.replace('svg:', '').toLowerCase();
  }

  getJSONHandler(data: Record<string, unknown>) {
    const key = this.resolveJSONKey(data);
    const handler = !!key && this.registry.get(key)?.json;
    return { key, handler };
  }

  getSVGHandler(el: SVGElement, keyOverride?: string) {
    const key = keyOverride || this.resolveSVGKey(el);
    const handler = this.registry.get(key)?.svg;
    return { key, handler };
  }

  assertJSONHandler(data: Record<string, unknown>) {
    const { key, handler } = this.getJSONHandler(data);
    if (!handler) {
      throw new Error(`fabric: failed to get JSON handler for key "${key}"`);
    }
    return handler;
  }

  assertSVGHandler(el: SVGElement, keyOverride?: string) {
    const { key, handler } = this.getSVGHandler(el, keyOverride);
    if (!handler) {
      throw new Error(`fabric: failed to get SVG handler for key "${key}"`);
    }
    return handler;
  }
}

export const registry = new Registry();

export const registerClass = <T extends TClassIO>(key: string, klass: T) =>
  registry.registerClass(key, klass);
