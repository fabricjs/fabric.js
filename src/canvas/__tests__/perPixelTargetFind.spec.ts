import { Point } from '../../Point';
import type { IText } from '../../shapes/IText/IText';
import { FabricObject } from '../../shapes/Object/FabricObject';
import { Canvas } from '../Canvas';

describe('perPixelTargetFind', () => {
  let canvas: Canvas;
  let object: FabricObject;
  let isTargetTransparent: jest.SpyInstance;

  beforeEach(() => {
    canvas = new Canvas(null);
    isTargetTransparent = jest
      .spyOn(canvas, 'isTargetTransparent')
      .mockReturnValue(true);
    object = new FabricObject();
    jest.spyOn(object, 'containsPoint').mockReturnValue(true);
  });

  afterEach(() => {
    return canvas.dispose();
  });

  const checkTarget = () =>
    canvas._checkTarget(new Point(), object, new Point());

  test('perPixelTargetFind === false', () => {
    expect(checkTarget()).toBe(true);
    expect(isTargetTransparent).not.toBeCalled();
  });

  test('perPixelTargetFind === true', () => {
    object.perPixelTargetFind = true;
    expect(checkTarget()).toBe(false);
    expect(isTargetTransparent).toBeCalled();
  });

  test('perPixelTargetFind === true, object is editing', () => {
    object.perPixelTargetFind = true;
    (object as IText).isEditing = true;
    expect(checkTarget()).toBe(true);
    expect(isTargetTransparent).not.toBeCalled();
  });

  test('perPixelTargetFind === "not-selected", object is not selected', () => {
    object.perPixelTargetFind = 'not-selected';
    expect(checkTarget()).toBe(false);
    expect(isTargetTransparent).toBeCalled();
  });

  test('perPixelTargetFind === "not-selected", object is selected', () => {
    object.perPixelTargetFind = 'not-selected';
    canvas.setActiveObject(object);
    expect(checkTarget()).toBe(true);
    expect(isTargetTransparent).not.toBeCalled();
  });
});
