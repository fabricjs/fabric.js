/**
 * Runs from both the browser and node
 */

export function render(
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  fabric: typeof import('fabric'),
  { type, el }: { type: 'text' | 'rect'; el?: HTMLCanvasElement }
) {
  const targets = new Array(8).fill(0).map((_, index) => {
    const angle = index * 45;
    const gradient = new fabric.Gradient({
      coords: {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 1,
      },
      gradientUnits: 'percentage',
      // offsetX: 150,
      gradientTransform: fabric.util.createRotateMatrix({ angle }),
      colorStops: [
        {
          offset: 0,
          color: 'red',
        },
        {
          offset: 1,
          color: 'blue',
        },
      ],
    });

    return type === 'text'
      ? new fabric.Text(`Gradient\n${angle}°`, {
          fontSize: 50,
          fontWeight: 'bold',
          fill: gradient,
          left: (index % 4) * 250,
          top: Math.floor(index / 4) * 250,
        })
      : new fabric.Rect({
          width: 150,
          height: 150,
          fill: gradient,
          left: (index % 4) * 250,
          top: Math.floor(index / 4) * 250,
        });
  });

  const canvas = new fabric.StaticCanvas(el, {
    width: 1000,
    height: 400,
    backgroundColor: 'white',
    enableRetinaScaling: false,
  });
  canvas.add(...targets);
  canvas.renderAll();

  return { canvas };
}
