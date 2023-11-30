import { animate } from '.';

describe('animate', () => {
  it('should complete if there is no diff to animate', () => {
    const onStart = jest.fn();
    const onChange = jest.fn();
    const onComplete = jest.fn();
    const animation = animate({
      startValue: 10,
      endValue: 10,
      duration: 50,
      onStart,
      onChange,
      onComplete,
    });
    expect(animation.isDone()).toBeTruthy();
    expect(onStart).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(10, 1, 1);
    expect(animation.promise).resolves.toBe(0);
    expect(animation).toMatchObject({
      delay: 0,
      duration: 50,
      startValue: 10,
      endValue: 10,
      byValue: 0,
      value: 10,
      valueProgress: 1,
      durationProgress: 1,
    });
  });

  it('should complete if duration <= 0', () => {
    const onStart = jest.fn();
    const onChange = jest.fn();
    const onComplete = jest.fn();
    const animation = animate({
      startValue: 10,
      endValue: 25,
      duration: 0,
      onStart,
      onChange,
      onComplete,
    });
    expect(animation.isDone()).toBeTruthy();
    expect(onStart).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledWith(25, 1, 1);
    expect(animation.promise).resolves.toBe(0);
    expect(animation).toMatchObject({
      delay: 0,
      duration: 0,
      startValue: 10,
      endValue: 25,
      byValue: 15,
      value: 25,
      valueProgress: 1,
      durationProgress: 1,
    });
  });

  it('onComplete should pass the same ref to avoid rounding issues', async () => {
    const onStart = jest.fn();
    const onChange = jest.fn();
    const onComplete = jest.fn();
    const startValue = [1];
    const endValue = [2];
    const animation = animate({
      startValue,
      endValue,
      duration: 200,
      onStart,
      onChange,
      onComplete,
    });
    expect(animation.isDone()).toBeFalsy();
    await animation.promise;
    expect(onStart).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
    expect(onComplete.mock.calls[0][0]).toBe(endValue);
    expect(onComplete).toHaveBeenCalledWith(endValue, 1, 1);
    expect(animation).toMatchObject({
      delay: 0,
      duration: 200,
      startValue,
      endValue,
      valueProgress: 1,
      durationProgress: 1,
    });
  });

  it('declarative aborting should reject animation promise', async () => {
    const abort = jest.fn().mockImplementation((value) => value > 5);
    const animation = animate({
      startValue: 0,
      endValue: 100,
      duration: 50,
      abort,
    });
    await expect(animation.promise).rejects.toBeUndefined();
  });

  it('imperative aborting should reject animation promise', async () => {
    const animation = animate({
      startValue: 0,
      endValue: 100,
      duration: 50,
    });
    animation.abort();
    await expect(animation.promise).rejects.toBeUndefined();
  });
});
