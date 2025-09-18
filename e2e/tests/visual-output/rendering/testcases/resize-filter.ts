import type { FabricNamespace, renderTestType } from '../../../types';

function configureFabric(fabric: FabricNamespace) {
  fabric.config.configure({
    enableGLFiltering: false,
  });
}

const imageResizeTest: renderTestType = {
  title: 'Image resize with canvas zoom',
  golden: 'parrot.png',
  percentage: 0.08,
  size: [200, 200],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);
    fabric.Object.ownDefaults.objectCaching = false;

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const zoom = 8;
    const image = new fabric.Image(img);
    image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
    canvas.setZoom(zoom);
    image.scaleToWidth(canvas.width / zoom);
    canvas.add(image);
    canvas.renderAll();
  },
};

const imageResizeTestNoZoom: renderTestType = {
  title: 'Image resize without zoom',
  golden: 'parrot.png',
  percentage: 0.08,
  size: [200, 200],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const image = new fabric.FabricImage(img);
    image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
    image.scaleToWidth(canvas.width);
    canvas.add(image);
    canvas.renderAll();
  },
};

const imageResizeTestAnamorphic: renderTestType = {
  title: 'Image resize with scaleY != scaleX',
  golden: 'parrotxy.png',
  percentage: 0.08,
  size: [200, 200],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const image = new fabric.Image(img);
    image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
    image.scaleY = 0.3;
    image.scaleX = 1;
    canvas.add(image);
    canvas.renderAll();
  },
};

const imageResizeTestGroup: renderTestType = {
  title: 'Image resize with scaled group',
  golden: 'parrot.png',
  percentage: 0.08,
  size: [200, 200],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const image = new fabric.Image(img, { strokeWidth: 0 });
    image.resizeFilter = new fabric.filters.Resize({ resizeType: 'lanczos' });
    const group = new fabric.Group([image]);
    group.strokeWidth = 0;
    group.scaleToWidth(canvas.width);
    canvas.add(group);
    canvas.renderAll();
  },
};

const blendImageTest2: renderTestType = {
  title: 'Blend image test with flip',
  golden: 'parrotblend2.png',
  percentage: 0.06,
  size: [400, 400],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const image = new fabric.Image(img);
    const backdropImage = new fabric.Image(img);
    backdropImage.left = backdropImage.width;
    backdropImage.scaleX = -1;
    image.filters.push(new fabric.filters.BlendImage({ image: backdropImage }));
    image.applyFilters();
    image.scaleToWidth(400);
    canvas.add(image);
    canvas.renderAll();
  },
};

const blendImageTest: renderTestType = {
  title: 'Blend image test',
  golden: 'parrotblend.png',
  percentage: 0.06,
  size: [400, 400],
  snapshotSuffix: 'resize-filter',
  async renderFunction(canvas, fabric) {
    configureFabric(fabric);

    const img = await globalThis.getImage(fabric, 'parrot.png');
    const backdrop = await globalThis.getImage(fabric, 'very_large_image.jpg');

    const image = new fabric.Image(img);
    const backdropImage = new fabric.Image(backdrop);
    image.filters.push(
      new fabric.filters.BlendImage({ image: backdropImage, alpha: 0.5 }),
    );
    image.scaleToWidth(400);
    image.applyFilters();
    canvas.add(image);
    canvas.renderAll();
  },
};

export const resizeFilterTests = [
  imageResizeTest,
  imageResizeTestNoZoom,
  imageResizeTestAnamorphic,
  imageResizeTestGroup,
  blendImageTest2,
  blendImageTest,
];
