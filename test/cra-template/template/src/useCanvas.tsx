import { useCallback, useRef } from 'react';
import { fabric } from './fabric';

export function useCanvas() {
    const fc = useRef<fabric.Canvas | null>(null);
    const setRef = useCallback((ref: HTMLCanvasElement | null) => {
        fc.current?.dispose();
        if (!ref) {
            fc.current = null;
            return;
        }
        const canvas = new fabric.Canvas(ref, { backgroundColor: 'white' });
        fc.current = canvas;
        return () => {
            fc.current?.dispose();
            fc.current = null;
        };
    }, []);
    return [fc, setRef] as [typeof fc, typeof setRef];
}
