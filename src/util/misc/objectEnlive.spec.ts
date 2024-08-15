import { enlivenObjects } from './objectEnlive';
import { Rect, type RectProps } from '../../shapes/Rect';
import { Shadow } from '../../Shadow';
import { classRegistry } from '../../ClassRegistry';

const mockedRectWithCustomProperty = {
  type: 'rect',
  width: 100,
  // will become a shadow
  shadow: {
    type: 'shadow',
    blur: 5,
  },
  // will become a rect
  custom1: {
    type: 'rect',
    width: 50,
  },
  custom2: {
    type: 'nothing',
    value: 3,
  },
  // will become a set
  custom3: {
    type: 'registered',
  },
};

describe('enlivenObjects', () => {
  it('will enlive correctly', async () => {
    const [rect] = await enlivenObjects<Rect<RectProps>>([
      mockedRectWithCustomProperty,
    ]);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.shadow).toBeInstanceOf(Shadow);
    expect(rect.custom1).toBeInstanceOf(Rect);
    expect(rect.custom2).toEqual({
      type: 'nothing',
      value: 3,
    });
    expect(rect.custom3).toEqual({
      type: 'registered',
    });
  });
  it('will enlive correctly newly registered props', async () => {
    class Test {
      declare opts: any;
      constructor(opts: any) {
        this.opts = opts;
      }
      static async fromObject(opts: any) {
        return new this(opts);
      }
    }
    classRegistry.setClass(Test, 'registered');
    const [rect] = await enlivenObjects<Rect<RectProps>>([
      mockedRectWithCustomProperty,
    ]);
    expect(rect).toBeInstanceOf(Rect);
    expect(rect.shadow).toBeInstanceOf(Shadow);
    expect(rect.custom1).toBeInstanceOf(Rect);
    expect(rect.custom2).toEqual({
      type: 'nothing',
      value: 3,
    });
    expect(rect.custom3).toBeInstanceOf(Test);
  });
});
