import React, { useEffect, useCallback, useMemo } from 'react';
import * as fabric from 'fabric';

export function useResize<T extends fabric.Canvas>(
  ref: React.RefObject<T>,
  {
    zoomToFit,
    onResize,
  }: {
    zoomToFit?: boolean;
    onResize?: () => void;
  } = {}
) {
  const resize = useCallback(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    canvas.setDimensions({ width: '100%', height: '100%' }, { cssOnly: true });
    if (!zoomToFit) {
      const { width, height } = window.getComputedStyle(
        canvas.elements.items.main.el
      );
      canvas.setDimensions({
        width: parseInt(width),
        height: parseInt(height),
      });
    }
  }, [ref, zoomToFit]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    resize();
    const observer = new ResizeObserver(() => {
      resize();
      onResize?.();
    });
    observer.observe(canvas.elements.items.main.el.parentElement!);
    return () => observer.disconnect();
  }, [ref, resize, onResize]);
}

export function useListener<T, K extends keyof T, E extends T[K]>(
  ref: React.RefObject<fabric.Observable<T>>,
  key: K,
  callback: (options: E) => any
) {
  useEffect(() => ref.current?.on(key, callback), [ref, key, callback]);
}

export function useAnimation(
  options: Parameters<typeof fabric.util.animate>[0]
) {
  const animation = useMemo(() => fabric.util.animate(options), [options]);
  useEffect(() => {
    animation.start();
    return () => animation.abort();
  }, [animation]);
}
