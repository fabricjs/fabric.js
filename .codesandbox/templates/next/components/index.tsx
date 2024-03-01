import React, { createRef, useEffect, useMemo, forwardRef } from 'react';
import {
  Canvas,
  CanvasOptions,
  DOMManager,
  DOMManagerType,
  StaticCanvas,
  StaticCanvasOptions,
  StaticDOMManagerType,
} from 'fabric';

const canvasStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  top: 0,
  touchAction: 'none',
  msTouchAction: 'none',
  userSelect: 'none',
};

export const CanvasSlot = forwardRef<
  HTMLCanvasElement,
  { name: 'main' | 'top' | string }
>((props, ref) => <canvas {...props} ref={ref} />);

/**
 * @example Standard
 *
 *   <CanvasComponent ref={ref}>
 *     <CanvasSlot name="main" />
 *     <CanvasSlot name="top" />
 *   </CanvasComponent>
 *
 * @example DOM elements in between
 *   <CanvasComponent ref={ref}>
 *     <CanvasSlot name="main" />
 *     <CanvasSlot name="pointers" />
 *     Hello World
 *     <CanvasSlot name="top" />
 *   </CanvasComponent>
 *
 * @example Static
 *   const createStatic = useCallback((arg0: StaticDOMManagerType) => {
 *     return new StaticCanvas(arg0);
 *   });
 *   <CanvasComponent builder={createStatic} ref={ref}>
 *     <CanvasSlot name="main" />
 *   </CanvasComponent>
 */
export const CanvasComponent = forwardRef<
  Canvas | StaticCanvas,
  React.PropsWithChildren<{
    builder?:
      | ((
          arg0: StaticDOMManagerType,
          options?: StaticCanvasOptions
        ) => StaticCanvas)
      | ((arg0: DOMManagerType, options?: CanvasOptions) => Canvas);
  }>
>(({ children, builder = (arg0: DOMManagerType) => new Canvas(arg0) }, ref) => {
  const canvasRefs = useMemo(
    () =>
      React.Children.toArray(children).reduce((refs, child) => {
        typeof child === 'object' &&
          (child as React.ReactElement).type === CanvasSlot &&
          (refs[(child as React.ReactElement).props.name] =
            createRef<HTMLCanvasElement>());

        return refs;
      }, {} as Record<string, React.RefObject<HTMLCanvasElement>>),
    [children]
  );

  useEffect(() => {
    // it is crucial `create` is a dependency of this effect
    // to ensure the canvas is disposed and re-created if it changes
    const canvas = builder(
      new DOMManager(
        Object.fromEntries(
          Object.entries(canvasRefs).map(([key, ref]) => [key, ref.current])
        )
      )
    );

    if (typeof ref === 'function') {
      ref(canvas);
    } else if (typeof ref === 'object' && ref) {
      ref.current = canvas;
    }

    return () => {
      // `dispose` is async
      // however it runs a sync DOM cleanup
      // its async part ensures rendering has completed
      // and should not affect react
      canvas.dispose();

      if (typeof ref === 'function') {
        ref(null);
      } else if (typeof ref === 'object' && ref) {
        ref.current = null;
      }
    };
  }, [canvasRefs, builder, ref]);

  return React.Children.map(children, (child) => {
    if (
      typeof child === 'object' &&
      (child as React.ReactElement).type === CanvasSlot
    ) {
      const { name } = (child as React.ReactElement).props;
      return React.cloneElement(child as React.ReactElement, {
        style: name === 'main' ? undefined : canvasStyle,
        ref: canvasRefs[name],
      });
    } else {
      return child;
    }
  });
});
