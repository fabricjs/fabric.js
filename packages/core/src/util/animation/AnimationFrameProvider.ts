import { getFabricWindow } from '../../env';

export function requestAnimFrame(callback: FrameRequestCallback): number {
  return getFabricWindow().requestAnimationFrame(callback);
}

export function cancelAnimFrame(handle: number): void {
  return getFabricWindow().cancelAnimationFrame(handle);
}
