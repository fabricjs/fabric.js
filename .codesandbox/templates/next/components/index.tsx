import React, { createRef, useEffect, useMemo } from 'react';
import {
  DOMManager,
  DOMManagerType,
  StaticCanvas,
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

export const CanvasSlot = ({ name }: { name: string }) => <div name={name} />;

/**
 * @example Standard
 *   const create = useCallback((arg0: DOMManagerType) => {
 *     const canvas = new Canvas(arg0);
 *     ...
 *     return canvas; // return for cleanup
 *   });
 *
 *   <CanvasComponent create={create}>
 *     <CanvasSlot name="main" />
 *     <CanvasSlot name="top" />
 *   </CanvasComponent>
 *
 * @example DOM elements in between
 *   <CanvasComponent create={create}>
 *     <CanvasSlot name="main" />
 *     <CanvasSlot name="pointers" />
 *     Hello World
 *     <CanvasSlot name="top" />
 *   </CanvasComponent>
 *
 * @example Static
 *   const createStatic = useCallback((arg0: StaticDOMManagerType) => {
 *     const canvas = new StaticCanvas(arg0);
 *     ...
 *     return canvas; // return for cleanup
 *   });
 *   <CanvasComponent create={createStatic}>
 *     <CanvasSlot name="main" />
 *   </CanvasComponent>
 */
export const CanvasComponent = ({
  create,
  children,
}: React.PropsWithChildren<{
  create: (arg0: StaticDOMManagerType | DOMManagerType) => StaticCanvas;
}>) => {
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
    const canvas = create(
      new DOMManager(
        Object.fromEntries(
          Object.entries(canvasRefs).map(([key, ref]) => [key, ref.current])
        )
      )
    );

    return () => {
      // `dispose` is async
      // however it runs a sync DOM cleanup
      // its async part ensures rendering has completed
      // and should not affect react
      canvas.dispose();
    };
  }, [canvasRefs, create]);

  return React.Children.map(children, (child) =>
    typeof child === 'object' &&
    (child as React.ReactElement).type === CanvasSlot ? (
      <canvas
        style={canvasStyle}
        ref={canvasRefs[(child as React.ReactElement).props.name]}
      />
    ) : (
      child
    )
  );
};
