export type TRegistry<T extends FunctionConstructor = FunctionConstructor> = {
  json(data: unknown, options?: unknown): T | Promise<T>;
  svg?(svgEl: SVGElement, instance: T, options: unknown): T | Promise<T>;
};

export type TClassIO<T extends FunctionConstructor = FunctionConstructor> =
  T & {
    fromObject: TRegistry<T>['json'];
    fromElement: TRegistry<T>['svg'];
  };

export class Registry {
  readonly registry: Map<string, TRegistry>;
  private readonly resolver: {
    json?: (data: Record<string, unknown>) => {
      key: string;
      handler?: TRegistry['json'];
    };
    svg?: (data: { element: SVGElement; key?: string }) => {
      key: string;
      handler?: TRegistry['svg'];
    };
  };

  constructor(registry?: Map<string, TRegistry>) {
    this.registry = new Map(registry);
    this.resolver = {};
  }

  registerResolver<T extends 'json' | 'svg'>(
    type: T,
    resolver?: Registry['resolver'][T]
  ) {
    this.resolver[type] = resolver;
  }

  unregisterResolver<T extends 'json' | 'svg'>(type: T) {
    this.resolver[type] = undefined;
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

  private resolveJSONKey(data: Record<string, unknown>) {
    // backward compatibility
    if (data.colorStops) {
      return 'gradient';
    }
    return data.type as string | undefined;
  }

  getJSONHandler(data: Record<string, unknown>) {
    if (this.resolver.json) {
      return this.resolver.json(data);
    }
    const key = this.resolveJSONKey(data);
    const handler = !!key && this.registry.get(key)?.json;
    return { key, handler };
  }

  getSVGHandler({ key, element }: { key: string; element: SVGElement }) {
    if (this.resolver.svg) {
      return this.resolver.svg({ key, element });
    }
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

  assertSVGHandler({
    key: _key,
    element,
  }: {
    key: string;
    element: SVGElement;
  }) {
    const { key, handler } = this.getSVGHandler({
      key: _key,
      element,
    });
    if (!handler) {
      throw new Error(`fabric: failed to get SVG handler for key "${key}"`);
    }
    return handler;
  }
}

export const registry = new Registry();

export const registerClass = <T extends TClassIO>(key: string, klass: T) =>
  registry.registerClass(key, klass);
