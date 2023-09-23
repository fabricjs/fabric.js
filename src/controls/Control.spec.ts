import { Control } from './Control';

describe('Controls', () => {
  test('method binding', () => {
    const actionHandler = jest.fn();
    const mouseDownHandler = jest.fn();
    const mouseUpHandler = jest.fn();

    const control = new Control({
      actionHandler,
      mouseDownHandler,
      mouseUpHandler,
    });

    control.getActionHandler()();
    expect(actionHandler.mock.contexts).toEqual([control]);

    control.getMouseDownHandler()();
    expect(mouseDownHandler.mock.contexts).toEqual([control]);

    control.getMouseUpHandler()();
    expect(mouseUpHandler.mock.contexts).toEqual([control]);

    const b = new Control({ actionHandler });
    expect(b.getMouseDownHandler()).toBeUndefined();
    expect(b.getMouseUpHandler()).toBeUndefined();
  });
});
