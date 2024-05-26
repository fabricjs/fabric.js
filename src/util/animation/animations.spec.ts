import { runningAnimations } from './AnimationRegistry';
import { animateColor, animate } from './animate';
import * as ease from './easing';
import { Color } from '../../color/Color';
import { FabricObject } from '../../shapes/Object/FabricObject';
import { ValueAnimation } from './ValueAnimation';
import { Shadow } from '../../Shadow';

jest.useFakeTimers();
const findAnimationsByTarget = (target: any) =>
  runningAnimations.filter(({ target: t }) => target === t);

describe('animate', () => {
  afterEach(() => {
    // 'runningAnimations should be empty at the end of a test'
    expect(runningAnimations.length).toBe(0);
    runningAnimations.cancelAll();
    jest.runAllTimers();
  });
  it('animateColor', async () => {
    let expectRun = 0;
    animateColor({
      startValue: 'red',
      endValue: 'blue',
      duration: 16,
      onComplete: function (val, changePerc, timePerc) {
        // 'color is blue'
        expect(val).toBe('rgba(0,0,255,1)');
        // 'change percentage is 100%'
        expect(changePerc).toBe(1);
        // 'time percentage is 100%'
        expect(timePerc).toBe(1);
        expectRun += 1;
      },
      onChange: (val, complete) => {
        if (complete !== 1) {
          //  'color is not blue'
          expectRun += 1;
          expect(val).not.toBe('rgba(0,0,255,1)');
        } else {
          // 'color is blue'
          expectRun += 1;
          expect(val).toBe('rgba(0,0,255,1)');
        }
        // 'expected type is String'
        expect(typeof val === 'string').toBe(true);
      },
    });
    jest.advanceTimersByTime(32);
    expect(expectRun).toEqual(3);
  });
  it('animateColor change percentage is calculated from a changed value', async () => {
    const duration = 96;
    const changePercSnap: number[] = [];
    animateColor({
      startValue: 'red',
      endValue: 'blue',
      duration,
      onChange: function (val, changePerc) {
        changePercSnap.push(changePerc);
      },
      onComplete: function (val, changePerc, timePerc) {
        // 'color is blue'
        expect(val).toBe('rgba(0,0,255,1)');
        // 'change percentage is 100%'
        expect(changePerc).toBe(1);
        // 'time percentage is 100%'
        expect(timePerc).toBe(1);
      },
    });
    jest.advanceTimersByTime(duration + 16);
    expect(changePercSnap).toMatchSnapshot();
  });
  it('animateColor with opacity', async () => {
    const duration = 16;
    animateColor({
      startValue: 'rgba(255, 0, 0, 0.9)',
      endValue: 'rgba(0, 0, 255, 0.7)',
      duration: 16,
      onComplete: function (val, changePerc, timePerc) {
        // 'color is animated on all 4 values'
        expect(val).toEqual('rgba(0,0,255,0.7)');
      },
    });
    jest.advanceTimersByTime(duration + 16);
  });
  it('animateColor, opacity out of bounds value are ignored', async () => {
    const duration = 16;
    animateColor({
      startValue: 'red',
      endValue: [255, 255, 255, 3],
      duration,
      onChange: (val) => {
        // 'alpha diff should be ignored'
        expect(new Color(val).getAlpha()).toEqual(1);
      },
      onComplete: function (val) {
        // 'color is normalized to max values';
        expect(val).toEqual('rgba(255,255,255,1)');
      },
    });
    jest.advanceTimersByTime(duration + 16);
  });
  it('animateColor opacity only', async () => {
    let called = false;
    const duration = 96;
    animateColor({
      startValue: 'rgba(255, 0, 0, 0.9)',
      endValue: 'rgba(255, 0, 0, 0.7)',
      duration: 96,
      onChange: function (val, changePerc) {
        const alpha = new Color(val).getAlpha();
        // 'valueProgress should match'
        expect(changePerc).toBe((0.9 - alpha) / (0.9 - 0.7));
        called = true;
      },
      onComplete: function (val, changePerc, timePerc) {
        // 'color is animated on all 4 values';
        expect(val).toBe('rgba(255,0,0,0.7)');
      },
    });
    jest.advanceTimersByTime(duration + 16);
    expect(called).toBe(true);
  });
  it('endValue', async () => {
    const duration = 16;
    animate({
      startValue: 2,
      endValue: 5,
      duration,
      onComplete: function (val, changePerc, timePerc) {
        //  'endValue is respected')
        expect(val).toBe(5);
        // , 'change percentage is 100%')
        expect(changePerc).toBe(1);
        // , 'time percentage is 100%'
        expect(timePerc).toBe(1);
      },
    });
    jest.advanceTimersByTime(duration + 16);
  });
  it('animation context', async () => {
    const options = { foo: 'bar' };
    const context = animate(options);
    expect(context.state).toBe('pending');
    expect(typeof context.abort === 'function').toBe(true);
    expect(context.duration).toEqual(500);
    expect(runningAnimations.length).toBe(1);
    jest.advanceTimersByTime(32);
    expect(context.state).toBe('running');
    jest.advanceTimersByTime(1000);
    expect(context.state).toBe('completed');
    // 'animation should not exist in registry'
    expect(runningAnimations.length).toBe(0);
  });
  it('runningAnimations', async () => {
    expect(runningAnimations instanceof Array).toBe(true);
    expect(typeof runningAnimations.cancelAll === 'function').toBe(true);
    expect(typeof runningAnimations.cancelByTarget === 'function').toBe(true);
    expect(typeof runningAnimations.cancelByCanvas === 'function').toBe(true);
    expect(runningAnimations.length).toBe(0);
    const target = { foo: 'bar' };
    const context = animate({
      target,
    });
    jest.advanceTimersByTime(32);
    // 'should have registered animation'
    expect(runningAnimations.length).toBe(1);
    expect(context.state).toBe('running');
    // 'animation should exist in registry'
    expect(runningAnimations.indexOf(context)).toBe(0);
    const byTarget = findAnimationsByTarget(target);
    //  'should have found registered animation by target'
    expect(byTarget.length).toBe(1);
    //  'should have found registered animation by target'
    expect(byTarget[0]).toEqual(context);
    jest.advanceTimersByTime(1000);
    expect(context.state).toBe('completed');
    expect(runningAnimations.length).toBe(0);
  });
  it('runningAnimations with abort', async () => {
    let abort = false;
    const options = {
      abort() {
        return abort;
      },
    };
    const context = animate(options);
    jest.advanceTimersByTime(100);
    expect(runningAnimations.length).toBe(1);
    expect(runningAnimations.indexOf(context)).toBe(0);
    expect(context.state).toBe('running');
    abort = true;
    jest.advanceTimersByTime(100);
    expect(runningAnimations.length).toBe(0);
    expect(runningAnimations.indexOf(context)).toBe(-1);
    expect(context.state).toBe('aborted');
  });
  it('runningAnimations with imperative abort', async () => {
    const options = { foo: 'bar' };
    const context = animate(options);
    expect(context.state).toBe('pending');
    jest.advanceTimersByTime(32);
    expect(context.state).toBe('running');
    context.abort();
    jest.advanceTimersByTime(32);
    expect(context.state).toBe('aborted');
  });
  it('runningAnimations cancelAll', async () => {
    const options = { foo: 'bar' };
    animate(options);
    animate(options);
    animate(options);
    animate(options);
    expect(runningAnimations.length).toBe(4);
    expect(typeof runningAnimations.cancelAll === 'function').toBe(true);
    const cancelledAnimations = runningAnimations.cancelAll();
    expect(cancelledAnimations.length).toBe(4);
    expect(runningAnimations.length).toBe(0);
    //  make sure splice didn't destroy instance
    expect(runningAnimations instanceof Array).toBe(true);
  });
  it('runningAnimations cancelByCanvas', async () => {
    const canvas = { pip: 'py' };
    animate({ foo: 'bar', target: 'pip' });
    animate({ foo: 'bar', target: { canvas: 'pip' } });
    animate({ foo: 'bar' });
    animate({ target: { canvas } });
    // 'should have registered animations'
    expect(runningAnimations.length).toBe(4);
    let cancelledAnimations = runningAnimations.cancelByCanvas();
    // 'should return empty array'
    expect(cancelledAnimations.length).toBe(0);
    // animations are still all there
    expect(runningAnimations.length).toBe(4);
    cancelledAnimations = runningAnimations.cancelByCanvas(canvas);
    // 'should return cancelled animations'
    expect(cancelledAnimations.length).toBe(1);
    expect(cancelledAnimations[0].target.canvas).toBe(canvas);
    // 'should have left registered animation'
    expect(runningAnimations.length).toBe(3);
    jest.advanceTimersByTime(1000);
  });
  it('runningAnimations cancelByTarget', async () => {
    var options = { foo: 'bar', target: 'pip' },
      opt2 = { bar: 'baz' };
    animate(options);
    animate(options);
    animate(options);
    const baz = animate(opt2);
    expect(runningAnimations.length).toBe(4);
    var cancelledAnimations = runningAnimations.cancelByTarget();
    expect(cancelledAnimations.length).toBe(0);
    expect(runningAnimations.length).toBe(4);
    cancelledAnimations = runningAnimations.cancelByTarget('pip');
    expect(cancelledAnimations.length).toBe(3);
    expect(runningAnimations.length).toBe(1);
    expect(runningAnimations[0]).toBe(baz);
    jest.advanceTimersByTime(1000);
  });
  it('animate', async () => {
    const object = new FabricObject({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 43,
    });
    expect(typeof object.animate === 'function').toBe(true);
    const context = object.animate({ left: 40 });
    expect(Object.keys(context)).toEqual(['left']);
    expect(context.left instanceof ValueAnimation).toBe(true);
    expect(runningAnimations.length).toBe(1);
    expect(runningAnimations[0].target).toBe(object);
    jest.advanceTimersByTime(1000);
    expect(Math.round(object.left)).toBe(40);
  });
  it('animate with increment and without options', async () => {
    const object = new FabricObject({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 43,
    });
    object.animate({ left: object.left + 40 });
    jest.advanceTimersByTime(1000);
    expect(Math.round(object.left)).toBe(60);
  });
  it('animate with keypath', async () => {
    var object = new FabricObject({
      left: 20,
      top: 30,
      width: 40,
      height: 50,
      angle: 43,
      shadow: new Shadow({ offsetX: 20 }),
    });
    object.animate({ 'shadow.offsetX': 100 });
    jest.advanceTimersByTime(1000);
    expect(Math.round(object.shadow!.offsetX)).toBe(100);
  });
  it('animate with color', async () => {
    const object = new FabricObject(),
      properties = FabricObject.colorProperties;
    properties.forEach((prop, index) => {
      object.set(prop, 'red');
      object.animate({ [prop]: 'blue' });
      expect(runningAnimations.length).toBe(index + 1);
      expect(findAnimationsByTarget(object).length).toBe(index + 1);
    });
    jest.advanceTimersByTime(1000);
    properties.forEach((prop) => {
      expect(object[prop]).toBe('rgba(0,0,255,1)');
    });
  });
});

//   it('animate with decrement', async () => {
//     var object = new fabric.Object({
//       left: 20,
//       top: 30,
//       width: 40,
//       height: 50,
//       angle: 43,
//     });

//     object.animate({ left: object.left - 40 });
//     expect((true, 'animate without options does not crash');

//     setTimeout(function () {
//       expect(
//         Math.round(object.left),
//         -20,
//         'left has been decreased by 40'
//       );
//       done();
//     }, 1000);
//   });

//   it('animate multiple properties', async () => {
//     var object = new fabric.Object({ left: 123, top: 124 });
//     const context = object.animate({ left: 223, top: 224 });
//     assert.deepEqual(
//       Object.keys(context),
//       ['left', 'top'],
//       'should return a map of animation classes'
//     );
//     expect(
//       context.left.constructor.name,
//       'ValueAnimation',
//       'should be instance of ValueAnimation'
//     );
//     expect(
//       context.top.constructor.name,
//       'ValueAnimation',
//       'should be instance of ValueAnimation'
//     );
//     setTimeout(function () {
//       expect(223, Math.round(object.get('left')));
//       expect(224, Math.round(object.get('top')));
//       done();
//     }, 1000);
//   });

//   it('animate multiple properties with callback', async () => {
//     var object = new fabric.Object({ left: 0, top: 0 });

//     var changedInvocations = 0;
//     var completeInvocations = 0;

//     object.animate(
//       { left: 1, top: 1 },
//       {
//         duration: 1,
//         onChange: function () {
//           changedInvocations++;
//         },
//         onComplete: function () {
//           completeInvocations++;
//         },
//       }
//     );

//     setTimeout(function () {
//       expect(Math.round(object.get('left')), 1);
//       expect(Math.round(object.get('top')), 1);

//       expect((changedInvocations > 0);
//       expect(
//         completeInvocations,
//         2,
//         'the callbacks get call for each animation'
//       );

//       done();
//     }, 1000);
//   });

//   it('animate with list of values', async () => {
//     var run = false;

//     animate({
//       startValue: [1, 2, 3],
//       endValue: [2, 4, 6],
//       duration: 96,
//       onChange: function (currentValue, valueProgress) {
//         expect(
//           runningAnimations.length,
//           1,
//           'runningAnimations should not be empty'
//         );
//         expect((Array.isArray(currentValue), 'should be array');
//         expect((
//           Object.isFrozen(runningAnimations[0].value),
//           'should be frozen'
//         );
//         assert.deepEqual(runningAnimations[0].value, currentValue);
//         expect(currentValue.length, 3);
//         currentValue.forEach(function (v) {
//           expect((v > 0, 'confirm values are not invalid numbers');
//         });
//         expect(valueProgress, currentValue[0] - 1, 'should match');
//         // Make sure mutations are not kept
//         expect((
//           currentValue[0] <= 2,
//           'mutating callback values must not persist'
//         );
//         currentValue[0] = 200;
//         run = true;
//       },
//       onComplete: function (endValue) {
//         expect((Object.isFrozen(endValue), 'should be frozen');
//         expect(endValue.length, 3);
//         assert.deepEqual(endValue, [2, 4, 6]);
//         expect(run, true, 'something run');
//         done();
//       },
//     });
//   });

//   it('animate with abort', async () => {
//     var object = new fabric.Object({ left: 123, top: 124 });

//     var context;
//     object.animate(
//       { left: 223, top: 224 },
//       {
//         abort: function () {
//           context = this;
//           return true;
//         },
//       }
//     );

//     setTimeout(function () {
//       expect(123, Math.round(object.get('left')));
//       expect(124, Math.round(object.get('top')));
//       expect(
//         context,
//         object,
//         'abort should be called in context of an object'
//       );
//       done();
//     }, 100);
//   });

//   it('animate with imperative abort', async () => {
//     var object = new fabric.Object({ left: 123, top: 124 });

//     let called = 0;
//     const context = object._animate('left', 223, {
//       abort: function () {
//         called++;
//         return false;
//       },
//     });

//     expect((typeof context.abort === 'function');
//     expect(context.state, 'pending', 'state');
//     context.abort();
//     expect(context.state, 'aborted', 'state');

//     setTimeout(function () {
//       expect(Math.round(object.get('left')), 123);
//       expect(
//         called,
//         0,
//         'declarative abort should be called once before imperative abort cancels the run'
//       );
//       done();
//     }, 100);
//   });

//   it('animate with delay', async () => {
//     var object = new fabric.Object({ left: 123, top: 124 });
//     var t = new Date();
//     const context = object._animate('left', 223, {
//       onStart: function () {
//         expect(context.state, 'running', 'state');
//         assert.gte(new Date() - t, 500, 'animation delay');
//         return false;
//       },
//       onComplete: done,
//       delay: 500,
//     });
//     expect(context.state, 'pending', 'state');
//   });

describe('easing', () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.runAllTimers();
  });
  Object.entries(ease).map(([easingName, easingFunction]) => {
    it(easingName, async () => {
      const duration = 320;
      const snapshot: any[] = [];
      expect(typeof ease.easeInQuad === 'function').toBe(true);
      const object = new FabricObject({ left: 0 });
      object.animate(
        { left: 100 },
        {
          onComplete: function () {
            // 'animation ended correctly'
            expect(Math.round(object.left)).toBe(100);
          },
          duration,
          onChange: function (val, percentage) {
            snapshot.push({
              val: val.toFixed(4),
              percentage: percentage.toFixed(4),
            });
          },
          easing: easingFunction,
        }
      );
      jest.advanceTimersByTime(duration + 16);
      expect(snapshot).toMatchSnapshot();
    });
  });
});
