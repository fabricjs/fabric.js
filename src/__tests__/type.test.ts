import { Pattern } from '../Pattern';
import { Shadow } from '../Shadow';
import { createImage } from '../util';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { IText } from '../shapes/IText/IText';
import { Image } from '../shapes/Image';
import { Line } from '../shapes/Line';
import { FabricObject } from '../shapes/Object/Object';
import { Text } from '../shapes/Text/Text';
import { Textbox } from '../shapes/Textbox';
import { Triangle } from '../shapes/Triangle';
import { Circle } from '../shapes/Circle';
import { Ellipse } from '../shapes/Ellipse';
import { Group } from '../shapes/Group';
import { Path } from '../shapes/Path';
import { Polygon } from '../shapes/Polygon';
import { Polyline } from '../shapes/Polyline';
import { Rect } from '../shapes/Rect';
import { filters } from '../filters';

describe('Safeguarding from type in the constructor', () => {
  describe('Safeguarding shapes', () => {
    test.each(
      [
        new FabricObject({ type: 'x' }),
        new Circle({ radius: 0, type: 'x' }),
        new Ellipse({ type: 'x' }),
        new Rect({ type: 'x' }),
        new Path([], { type: 'x' }),
        new Polyline([], { type: 'x' }),
        new Polygon([], { type: 'x' }),
        new Line([0, 0, 0, 0], { type: 'x' }),
        new Triangle({ type: 'x' }),
        new Image(createImage(), { type: 'x' }),
        new Group([], { type: 'x' }),
        new ActiveSelection([], { type: 'x' }),
        new Text('', { type: 'x' }),
        new IText('', { type: 'x' }),
        new Textbox('', { type: 'x' }),
      ].map((object) => ({ object, type: object.constructor.type }))
    )('initializing shape $type with type is safeguarded', ({ object }) => {
      expect(() => object.type).toThrow();
      expect(object.constructor.type).toBeDefined();
      expect(object.toObject().type).toBe(object.constructor.type);
    });
  });

  describe('Safeguarding enlivables', () => {
    test.each(
      [new Pattern({ type: 'x' }), new Shadow({ type: 'x' })].map((object) => ({
        object,
        type: object.constructor.type,
      }))
    )('initializing $type with type is safeguarded', ({ object }) => {
      expect(object.type).toBeUndefined();
      expect(object.constructor.type).toBeDefined();
      expect(object.toObject().type).toBe(object.constructor.type);
    });
  });

  describe('Safeguarding filters', () => {
    test.each(
      Object.values(filters)
        .map((klass) => new klass({ type: 'x' }))
        .map((object) => ({ object, type: object.constructor.type }))
    )('initializing $type with type is safeguarded', ({ object }) => {
      expect(object.type).toBeUndefined();
      expect(object.constructor.type).toBeDefined();
      expect(object.toObject().type).toBe(object.constructor.type);
    });
  });
});
