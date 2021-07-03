import { useCallback, useRef } from 'react';
import { fabric } from './fabric';

export function useCanvasRef(width: number, height: number) {
    const fc = useRef<fabric.Canvas | null>(null);
    const setRef = useCallback((ref: HTMLCanvasElement | null) => {
        if (!ref) {
            if (fc.current) {
                const el = fc.current.getElement();
                fc.current.dispose();
                el.width = width;
                el.height = height;
            }
            fc.current = null;
            return;
        }
        const canvas = new fabric.Canvas(ref, { backgroundColor: 'white' });
        fc.current = canvas;
        return () => {
            fc.current?.dispose();
            fc.current = null;
        };
    }, [width, height]);
    return [fc, setRef] as [typeof fc, typeof setRef];
}
