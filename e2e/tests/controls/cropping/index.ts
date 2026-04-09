import { FabricImage, Point, util } from 'fabric';
import { enterCropMode } from 'fabric/extensions';
import { beforeAll } from '../../test';

const debugCanvas = document.querySelector<HTMLCanvasElement>('#debug-canvas');

const flipNumericOrigin = (origin: number, flipped: boolean) =>
  flipped ? 1 - origin : origin;

const getGhostLocalPoint = (image: FabricImage, xSign: -1 | 1, ySign: -1 | 1) =>
  new Point(
    xSign < 0
      ? -image.width / 2 - image.cropX
      : image.getElement().width - image.width / 2 - image.cropX,
    ySign < 0
      ? -image.height / 2 - image.cropY
      : image.getElement().height - image.height / 2 - image.cropY,
  );

const getAnchorLocalPoint = (
  image: FabricImage,
  xSign: -1 | 1,
  ySign: -1 | 1,
) => {
  const remainderX = image.getElement().width - image.width - image.cropX;
  const remainderY = image.getElement().height - image.height - image.cropY;
  const originX = flipNumericOrigin(
    xSign < 0 ? 1 + remainderX / image.width : -image.cropX / image.width,
    image.flipX,
  );
  const originY = flipNumericOrigin(
    ySign < 0 ? 1 + remainderY / image.height : -image.cropY / image.height,
    image.flipY,
  );

  return new Point(
    (originX - 0.5) * image.width,
    (originY - 0.5) * image.height,
  );
};

const transformLocalPoint = (
  image: FabricImage,
  point: Point,
  canvas: HTMLCanvasElement,
) => {
  const radians = util.degreesToRadians(image.angle);
  const scaledX = point.x * image.scaleX * (image.flipX ? -1 : 1);
  const scaledY = point.y * image.scaleY * (image.flipY ? -1 : 1);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rotatedX = scaledX * cos - scaledY * sin;
  const rotatedY = scaledX * sin + scaledY * cos;
  return new Point(canvas.width / 2 + rotatedX, canvas.height / 2 + rotatedY);
};

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  point: Point,
  color: string,
  label: string,
) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(label, point.x + 10, point.y - 8);
};

const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};

const renderDebugScene = (image: FabricImage) => {
  if (!debugCanvas) {
    return;
  }
  const ctx = debugCanvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const center = new Point(debugCanvas.width / 2, debugCanvas.height / 2);
  const element = image.getElement();
  const ghostX = -image.width / 2 - image.cropX;
  const ghostY = -image.height / 2 - image.cropY;
  const cropLeftTop = new Point(-image.width / 2, -image.height / 2);

  ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
  ctx.fillRect(0, 0, debugCanvas.width, debugCanvas.height);

  ctx.save();
  ctx.translate(center.x, center.y);
  ctx.rotate(util.degreesToRadians(image.angle));
  ctx.scale(
    image.scaleX * (image.flipX ? -1 : 1),
    image.scaleY * (image.flipY ? -1 : 1),
  );
  ctx.globalAlpha = 0.32;
  ctx.drawImage(element, ghostX, ghostY);
  ctx.globalAlpha = 1;
  ctx.lineWidth = 2 / Math.max(image.scaleX, image.scaleY);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(ghostX, ghostY, element.width, element.height);
  ctx.strokeStyle = '#2563eb';
  ctx.strokeRect(cropLeftTop.x, cropLeftTop.y, image.width, image.height);
  ctx.restore();

  drawPoint(ctx, center, '#111827', 'center');
  ctx.fillStyle = '#111827';
  ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(`flipX=${image.flipX} flipY=${image.flipY}`, 20, 24);
  ctx.fillText(
    `crop=(${image.cropX.toFixed(1)}, ${image.cropY.toFixed(1)})`,
    20,
    42,
  );
  ctx.fillText(
    `size=(${image.width.toFixed(1)}, ${image.height.toFixed(1)}) scale=${image.scaleX.toFixed(3)}`,
    20,
    60,
  );

  const controls = [
    { label: 'tls', xSign: -1 as const, ySign: -1 as const },
    { label: 'trs', xSign: 1 as const, ySign: -1 as const },
    { label: 'brs', xSign: 1 as const, ySign: 1 as const },
    { label: 'bls', xSign: -1 as const, ySign: 1 as const },
  ];

  controls.forEach(({ label, xSign, ySign }) => {
    const ghostPoint = transformLocalPoint(
      image,
      getGhostLocalPoint(image, xSign, ySign),
      debugCanvas,
    );
    const anchorPoint = transformLocalPoint(
      image,
      getAnchorLocalPoint(image, xSign, ySign),
      debugCanvas,
    );
    drawLine(ctx, ghostPoint, anchorPoint, '#f97316');
    drawPoint(ctx, ghostPoint, '#dc2626', `${label}-ghost`);
    drawPoint(ctx, anchorPoint, '#f59e0b', `${label}-anchor`);
  });

  [
    { label: 'crop-tl', point: new Point(-image.width / 2, -image.height / 2) },
    { label: 'crop-tr', point: new Point(image.width / 2, -image.height / 2) },
    { label: 'crop-br', point: new Point(image.width / 2, image.height / 2) },
    { label: 'crop-bl', point: new Point(-image.width / 2, image.height / 2) },
  ].forEach(({ label, point }) => {
    drawPoint(
      ctx,
      transformLocalPoint(image, point, debugCanvas),
      '#2563eb',
      label,
    );
  });
};

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 900, height: 700 });

  const image = await FabricImage.fromURL(
    'https://fabricjs.com/assets/dragon.jpg',
  );

  // Remove original controls and apply cropping controls
  image.once('mousedblclick', enterCropMode);

  // Set some initial crop to demonstrate the controls
  image.set({
    scaleX: 0.3,
    scaleY: 0.3,
    angle: 10,
    cropX: 90,
    cropY: 150,
    width: 600,
    height: 600,
    cornerStrokeColor: 'blue',
    cornerColor: 'white',
    borderScaleFactor: 2,
    transparentCorners: false,
    cornerStyle: 'circle',
    flipX: true,
    flipY: true,
  });

  canvas.add(image);
  canvas.centerObject(image);
  canvas.setActiveObject(image);
  canvas.on('after:render', () => renderDebugScene(image));
  renderDebugScene(image);

  return { image };
});
