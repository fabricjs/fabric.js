import { getWindow } from '../../env';

export function requestAnimFrame(callback: FrameRequestCallback): number {
  return getWindow().requestAnimationFrame(callback);
}

export function cancelAnimFrame(handle: number): void {
  return getWindow().cancelAnimationFrame(handle);
}
