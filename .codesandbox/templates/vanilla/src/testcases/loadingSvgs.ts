const svgString = `...add here your svg string`;

import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const svg = await fabric.loadSVGFromString(svgString);
  canvas.add(...(svg.objects.filter((obj) => !!obj) as fabric.FabricObject[]));
}
