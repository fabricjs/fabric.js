import type { TSimplePathData } from 'fabric';
import { installOriginWrapperUpdater } from './index';
import { BaseFabricObject, Path } from 'fabric';

installOriginWrapperUpdater();

BaseFabricObject.ownDefaults.originX = 'center';
BaseFabricObject.ownDefaults.originY = 'center';

describe('installOriginWrapperUpdater', () => {
  it('works with Path', async () => {
    const pathObject = {
      type: 'Path',
      originX: 0.3,
      originY: 'bottom',
      left: 101,
      top: 102,
      width: 200,
      height: 200,
      fill: 'red',
      stroke: 'blue',
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      path: [
        ['M', 100, 100],
        ['L', 300, 100],
        ['L', 200, 300],
        ['Z'],
      ] as TSimplePathData,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      strokeUniform: false,
    } as const;
    expect(pathObject.left).toBe(101);
    expect(pathObject.top).toBe(102);
    const instance = await Path.fromObject(pathObject);
    expect(instance.left).toBe(141);
    expect(instance.top).toBe(2);
    expect(instance.originX).toBe('center');
    expect(instance.originY).toBe('center');
  });
});
