import { iMatrix } from '../../constants';
import { FabricObject } from '../../shapes/Object/FabricObject';
import { StaticCanvas } from '../StaticCanvas';

describe('Canvas', () => {
  it('setViewportTransform calls objects setCoords', () => {
    const canvas = new StaticCanvas(undefined, { renderOnAddRemove: false });
    expect(canvas.viewportTransform).toEqual(iMatrix);
    const rect = new FabricObject({ width: 10, heigth: 10 });
    const rectBg = new FabricObject({ width: 10, heigth: 10 });
    const rectOverlay = new FabricObject({ width: 10, heigth: 10 });
    const spy = jest.spyOn(rect, 'setCoords');
    const bgSpy = jest.spyOn(rectBg, 'setCoords');
    const overlaySpy = jest.spyOn(rectOverlay, 'setCoords');
    canvas.add(rect);
    canvas.backgroundImage = rectBg;
    canvas.overlayImage = rectOverlay;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(bgSpy).not.toHaveBeenCalled();
    expect(overlaySpy).not.toHaveBeenCalled();
    canvas.setViewportTransform([2, 0, 0, 2, 50, 50]);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(bgSpy).toHaveBeenCalledTimes(1);
    expect(overlaySpy).toHaveBeenCalledTimes(1);
  });
});
