import * as fabric from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  const canvasImage = new fabric.StaticCanvas(undefined, {
    width: 200,
    height: 200,
  });
  canvasImage.add(
    new fabric.Rect({ fill: 'red', width: 100, height: 100, top: 0, left: 0 })
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'blue',
      width: 100,
      height: 100,
      top: 0,
      left: 100,
    })
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'green',
      width: 100,
      height: 100,
      top: 100,
      left: 0,
    })
  );
  canvasImage.add(
    new fabric.Rect({
      fill: 'purple',
      width: 100,
      height: 100,
      top: 100,
      left: 100,
    })
  );

  // 1. create & add image using custom class so we can log signal value

  const imgSrc =
    'https://images.unsplash.com/photo-1714997219940-6d9cd56c3609?dpr=2&h=200&w=120&auto=format&fit=crop&q=60';

  const customImg = await fabric.FabricImage.fromURL(
    imgSrc,
    { crossOrigin: 'anonymous' },
    { top: 150 }
  );
  const blurFilter = new fabric.filters.Blur({
    blur: 0.9,
  });
  customImg.filters.push(blurFilter);
  customImg.applyFilters();

  // 2. create 2nd custom image and add it to group & on canvas
  const inGroupImageSrc =
    'https://images.unsplash.com/photo-1715145208397-c36448202991?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3';

  const customImg2 = await fabric.FabricImage.fromURL(
    inGroupImageSrc,
    {
      crossOrigin: 'anonymous',
    },
    {
      left: 200,
      top: 200,
      width: 200,
      height: 200,
    }
  );

  const pixelateFilter = new fabric.filters.Pixelate({
    blocksize: 2,
  });
  customImg2.filters.push(pixelateFilter);
  customImg2.applyFilters();
  canvasImage.renderAll();
  // const image = new fabric.FabricImage(canvasImage.lowerCanvasEl);
  // image.filters = [
  //   new fabric.filters.Noise({ noise: 0.2 }),
  //   new fabric.filters.Vibrance({ vibrance: 0.3 }),
  //   new fabric.filters.Vintage(),
  //   new fabric.filters.Grayscale(),
  // ];
  // image.applyFilters();
  canvas.add(customImg, customImg2);
}
