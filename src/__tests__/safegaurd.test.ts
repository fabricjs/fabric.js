import { Pattern } from '../Pattern';
import { Shadow } from '../Shadow';
import { filters } from '../filters';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { Circle } from '../shapes/Circle';
import { Ellipse } from '../shapes/Ellipse';
import { Group } from '../shapes/Group';
import { IText } from '../shapes/IText/IText';
import { Image } from '../shapes/Image';
import { Line } from '../shapes/Line';
import { FabricObject } from '../shapes/Object/Object';
import { Path } from '../shapes/Path';
import { Polygon } from '../shapes/Polygon';
import { Polyline } from '../shapes/Polyline';
import { Rect } from '../shapes/Rect';
import { Text } from '../shapes/Text/Text';
import { Textbox } from '../shapes/Textbox';
import { Triangle } from '../shapes/Triangle';
import { createImage } from '../util';

describe('Safeguarding from type', () => {
  describe.each(
    (
      [
        [FabricObject, { type: 'x' }],
        [Circle, { radius: 0, type: 'x' }],
        [Ellipse, { type: 'x' }],
        [Rect, { type: 'x' }],
        [Path, [], { type: 'x' }],
        [Polyline, [], { type: 'x' }],
        [Polygon, [], { type: 'x' }],
        [Line, [0, 0, 0, 0], { type: 'x' }],
        [Triangle, { type: 'x' }],
        [Image, createImage(), { type: 'x', src: '' }],
        [Group, [], { type: 'x' }],
        [ActiveSelection, [], { type: 'x' }],
        [Text, '', { type: 'x', text: '' }],
        [IText, '', { type: 'x', text: '' }],
        [Textbox, '', { type: 'x', text: '' }],
        [Pattern, { type: 'x' }],
        [Shadow, { type: 'x' }],
        ...Object.values(filters).map(
          (klass) =>
            [
              klass,
              {
                type: 'x',
                // for BlendImage
                image: {
                  src: '',
                  toObject: jest.fn().mockReturnValue('Mock Image'),
                },
              },
            ] as const
        ),
      ] as const
    ).map(([klass, ...args]) => ({
      klass,
      args,
      options: args[args.length - 1],
      type: klass.type,
    }))
  )('$type is safeguarded', ({ klass, args, options }) => {
    class Test extends klass {
      readonly __args: any[];
      readonly __options: any[];
      constructor(...args: any[]) {
        super(...args);
        this.__args = [...args];
        this.__options = { ...args[args.length - 1] };
      }
    }

    test('constructor is safeguarded', async () => {
      const object = new Test(...args);
      expect(object.__options.type).toBeDefined();
      // expect(object.type).toBeUndefined()
      expect(object.constructor.type).toBeDefined();
      expect(object.toObject().type).toBe(object.constructor.type);
    });

    test('fromObject is safeguarded', async () => {
      const object2 = await Test.fromObject(options);
      expect(object2.__options.type).toBeUndefined();
    });
  });
});
