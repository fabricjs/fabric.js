import type { TPointerEvent } from '../src/EventTypeDefs';

export function createPointerEvent(
  options: Partial<{
    clientX: number;
    clientY: number;
    which: number;
    button: number;
    target: EventTarget;
    shiftKey: boolean;
  }> = {},
): TPointerEvent {
  return {
    clientX: 0,
    clientY: 0,
    which: 1,
    bubbles: true,
    ...options,
  } as TPointerEvent;
}
