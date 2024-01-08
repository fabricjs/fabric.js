import { FabricObject } from '../../shapes/Object/FabricObject';
import { Canvas } from '../Canvas';

describe('Canvas', () => {
  describe('invalidating `_objectsToRender`', () => {
    test('initial state', () => {
      const canvas = new Canvas();
      expect(canvas._objectsToRender).toBeUndefined();
    });

    test('mousedown', () => {
      const canvas = new Canvas();
      canvas.add(new FabricObject({ width: 10, height: 10 }));
      canvas._objectsToRender = [];
      canvas
        .getSelectionElement()
        .dispatchEvent(new MouseEvent('mousedown', { clientX: 5, clientY: 5 }));
      expect(canvas._objectsToRender).toBeUndefined();
    });

    test('object added/removed', () => {
      const canvas = new Canvas();
      canvas._objectsToRender = [];
      const object = new FabricObject({ width: 10, height: 10 });
      canvas.add(object);
      expect(canvas._objectsToRender).toBeUndefined();
      canvas._objectsToRender = [];
      canvas.remove(object);
      expect(canvas._objectsToRender).toBeUndefined();
    });

    test('stack change', () => {
      const canvas = new Canvas();
      const object = new FabricObject({ width: 10, height: 10 });
      const object2 = new FabricObject({
        left: 5,
        top: 5,
        width: 10,
        height: 10,
      });
      canvas.add(object, object2);

      canvas._objectsToRender = [];
      canvas.sendObjectBackwards(object2);
      expect(canvas._objectsToRender).toBeUndefined();

      canvas._objectsToRender = [];
      canvas.bringObjectForward(object2);
      expect(canvas._objectsToRender).toBeUndefined();

      canvas._objectsToRender = [];
      canvas.bringObjectToFront(object);
      expect(canvas._objectsToRender).toBeUndefined();

      canvas._objectsToRender = [];
      canvas.sendObjectToBack(object);
      expect(canvas._objectsToRender).toBeUndefined();
    });
  });
});
