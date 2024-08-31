import type { TSimplePathData } from 'fabric';
import { installOriginWrapperUpdater } from './index';
import { BaseFabricObject, Path, Rect, Group } from 'fabric';

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
  it('works with Group objects', async () => {
    const rect1 = new Rect({
      top: 100,
      left: 100,
      width: 30,
      height: 10,
      originX: 'center',
      originY: 0.1,
    });
    const rect2 = new Rect({
      top: 120,
      left: 50,
      width: 10,
      height: 40,
      strokeWidth: 0,
      originY: 'center',
      originX: 0.1,
    });

    const g = new Group([rect1, rect2], {
      originX: 'left',
      originY: 'top',
      top: 100,
      left: 200,
    });
    const obj = g.toObject();
    expect(obj.objects[0].top).toBe(-19.45);
    expect(obj.objects[0].left).toBe(17.75);
    expect(obj.objects[1].top).toBe(0.55);
    expect(obj.objects[1].left).toBe(-32.25);
    expect(obj.top).toBe(100);
    expect(obj.left).toBe(200);
    const instance = await Group.fromObject(obj);
    expect(Math.round(instance._objects[0].top)).toBe(-15);
    expect(instance._objects[0].left).toBe(17.75);
    expect(instance._objects[1].top).toBe(0.55);
    expect(instance._objects[1].left).toBe(-28.25);
    expect(instance.top).toBe(120.55);
    expect(instance.left).toBe(233.25);
  });
});
