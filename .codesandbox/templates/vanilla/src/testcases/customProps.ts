import { type Canvas, Rect } from 'fabric';

declare module 'fabric' {
  interface FabricObject {
    // name: string;
  }
}

export async function testCase(canvas: Canvas) {
  const rect = new Rect({ name: 'hello' });
  rect.name;
}
