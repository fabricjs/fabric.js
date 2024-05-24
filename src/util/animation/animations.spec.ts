import { runningAnimations } from './AnimationRegistry';
import { animateColor } from './animate';
import * as ease from './easing';
import { Color } from '../../color/Color';
import { FabricObject } from '../../shapes/Object/FabricObject';

jest.useFakeTimers();
const findAnimationsByTarget = (target) =>
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
});

//   QUnit.test('animateColor opacity only', function (assert) {
//     var done = assert.async();
//     let called = false;
//     animateColor({
//       startValue: 'rgba(255, 0, 0, 0.9)',
//       endValue: 'rgba(255, 0, 0, 0.7)',
//       duration: 96,
//       onChange: function (val, changePerc) {
//         const alpha = new fabric.Color(val).getAlpha();
//         expect(
//           changePerc,
//           (0.9 - alpha) / (0.9 - 0.7),
//           'valueProgress should match'
//         );
//         called = true;
//       },
//       onComplete: function (val, changePerc, timePerc) {
//         expect(
//           val,
//           'rgba(255,0,0,0.7)',
//           'color is animated on all 4 values'
//         );
//         expect(changePerc, 1, 'change percentage is 100%');
//         expect(timePerc, 1, 'time percentage is 100%');
//         expect((called);
//         done();
//       },
//     });
//   });

//   QUnit.test('endValue', function (assert) {
//     var done = assert.async();
//     animate({
//       startValue: 2,
//       endValue: 5,
//       duration: 16,
//       onComplete: function (val, changePerc, timePerc) {
//         expect(val, 5, 'endValue is respected');
//         expect(changePerc, 1, 'change percentage is 100%');
//         expect(timePerc, 1, 'time percentage is 100%');
//         done();
//       },
//     });
//   });

//   QUnit.test('animation context', function (assert) {
//     var done = assert.async();
//     var options = { foo: 'bar' };
//     const context = animate(options);
//     expect(context.state, 'pending', 'state');
//     expect((typeof context.abort === 'function', 'context');
//     expect(context.duration, 500, 'defaults');
//     assert.propEqual(options, { foo: 'bar' }, 'options were mutated');
//     setTimeout(function () {
//       expect(context.state, 'completed', 'state');
//       expect(
//         fabric.runningAnimations.length,
//         0,
//         'animation should not exist in registry'
//       );
//       done();
//     }, 1000);
//   });

//   QUnit.test('fabric.runningAnimations', function (assert) {
//     var done = assert.async();
//     expect((fabric.runningAnimations instanceof Array);
//     expect((typeof fabric.runningAnimations.cancelAll === 'function');
//     expect((typeof fabric.runningAnimations.cancelByTarget === 'function');
//     expect((typeof fabric.runningAnimations.cancelByCanvas === 'function');
//     expect(
//       fabric.runningAnimations.length,
//       0,
//       'should have registered animation'
//     );
//     var context,
//       target = { foo: 'bar' };
//     var options = {
//       target,
//       onChange() {
//         expect(context.state, 'running', 'state');
//         expect(
//           fabric.runningAnimations.indexOf(context),
//           0,
//           'animation should exist in registry'
//         );
//       },
//       onComplete() {
//         setTimeout(() => {
//           expect(context.state, 'completed', 'state');
//           expect(
//             fabric.runningAnimations.length,
//             0,
//             'should have unregistered animation'
//           );
//           done();
//         }, 0);
//       },
//     };
//     context = animate(options);
//     expect(
//       fabric.runningAnimations.length,
//       1,
//       'should have registered animation'
//     );
//     expect(
//       fabric.runningAnimations.indexOf(context),
//       0,
//       'animation should exist in registry'
//     );
//     var byTarget = findAnimationsByTarget(target);
//     expect(
//       byTarget.length,
//       1,
//       'should have found registered animation by target'
//     );
//     assert.deepEqual(
//       byTarget[0],
//       context,
//       'should have found registered animation by target'
//     );
//     delete byTarget[0].target;
//     expect(
//       findAnimationsByTarget(target),
//       0,
//       'should not have found registered animation by target'
//     );
//   });

//   QUnit.test('fabric.runningAnimations with abort', function (assert) {
//     var done = assert.async();
//     var _abort = false;
//     var options = {
//       onStart() {
//         setTimeout(() => {
//           _abort = true;
//         }, 100);
//       },
//       abort() {
//         if (_abort) {
//           setTimeout(() => {
//             expect(
//               fabric.runningAnimations.length,
//               0,
//               'should have unregistered animation'
//             );
//             done();
//           }, 0);
//         }
//         expect(
//           fabric.runningAnimations.indexOf(context),
//           0,
//           'animation should exist in registry'
//         );
//         return _abort;
//       },
//     };
//     var context = animate(options);
//     expect(
//       fabric.runningAnimations.length,
//       1,
//       'should have registered animation'
//     );
//     expect(
//       fabric.runningAnimations.indexOf(context),
//       0,
//       'animation should exist in registry'
//     );
//   });

//   QUnit.test(
//     'fabric.runningAnimations with imperative abort',
//     function (assert) {
//       var options = { foo: 'bar' };
//       var context = animate(options);
//       expect(context.state, 'pending', 'state');
//       expect(
//         fabric.runningAnimations.length,
//         1,
//         'should have registered animation'
//       );
//       expect(
//         fabric.runningAnimations.indexOf(context),
//         0,
//         'animation should exist in registry'
//       );
//       context.abort();
//       expect(context.state, 'aborted', 'state');
//       expect(
//         fabric.runningAnimations.length,
//         0,
//         'should have unregistered animation'
//       );
//     }
//   );

//   QUnit.test('fabric.runningAnimations cancelAll', function (assert) {
//     var options = { foo: 'bar' };
//     animate(options);
//     animate(options);
//     animate(options);
//     animate(options);
//     expect(
//       fabric.runningAnimations.length,
//       4,
//       'should have registered animations'
//     );
//     var cancelledAnimations = fabric.runningAnimations.cancelAll();
//     expect(
//       cancelledAnimations.length,
//       4,
//       'should return cancelled animations'
//     );
//     expect(
//       fabric.runningAnimations.length,
//       0,
//       'should have registered animations'
//     );
//     //  make sure splice didn't destroy instance
//     expect((fabric.runningAnimations instanceof Array);
//     expect((typeof fabric.runningAnimations.cancelAll === 'function');
//   });

//   QUnit.test('fabric.runningAnimations cancelByCanvas', function (assert) {
//     var done = assert.async();
//     var canvas = { pip: 'py' };
//     animate({ foo: 'bar', target: 'pip' });
//     animate({ foo: 'bar', target: { canvas: 'pip' } });
//     animate({ foo: 'bar' });
//     animate({ target: { canvas } });
//     expect(
//       fabric.runningAnimations.length,
//       4,
//       'should have registered animations'
//     );
//     var cancelledAnimations = fabric.runningAnimations.cancelByCanvas();
//     expect(cancelledAnimations.length, 0, 'should return empty array');
//     expect(
//       fabric.runningAnimations.length,
//       4,
//       'should have registered animations'
//     );
//     cancelledAnimations = fabric.runningAnimations.cancelByCanvas(canvas);
//     expect(
//       cancelledAnimations.length,
//       1,
//       'should return cancelled animations'
//     );
//     expect(
//       cancelledAnimations[0].target.canvas,
//       canvas,
//       'should return cancelled animations by canvas'
//     );
//     expect(
//       fabric.runningAnimations.length,
//       3,
//       'should have left registered animation'
//     );
//     setTimeout(() => {
//       done();
//     }, 1000);
//   });

//   QUnit.test('fabric.runningAnimations cancelByTarget', function (assert) {
//     var done = assert.async();
//     var options = { foo: 'bar', target: 'pip' },
//       opt2 = { bar: 'baz' };
//     animate(options);
//     animate(options);
//     animate(options);
//     const baz = animate(opt2);
//     expect(
//       fabric.runningAnimations.length,
//       4,
//       'should have registered animations'
//     );
//     var cancelledAnimations = fabric.runningAnimations.cancelByTarget();
//     expect(cancelledAnimations.length, 0, 'should return empty array');
//     expect(
//       fabric.runningAnimations.length,
//       4,
//       'should have registered animations'
//     );
//     cancelledAnimations = fabric.runningAnimations.cancelByTarget('pip');
//     expect(
//       cancelledAnimations.length,
//       3,
//       'should return cancelled animations'
//     );
//     expect(
//       fabric.runningAnimations.length,
//       1,
//       'should have left 1 registered animation'
//     );
//     assert.strictEqual(
//       fabric.runningAnimations[0],
//       baz,
//       'should have left 1 registered animation'
//     );
//     setTimeout(() => {
//       done();
//     }, 1000);
//   });

//   QUnit.test('animate', function (assert) {
//     var done = assert.async();
//     var object = new fabric.Object({
//       left: 20,
//       top: 30,
//       width: 40,
//       height: 50,
//       angle: 43,
//     });

//     expect((typeof object.animate === 'function');

//     const context = object.animate({ left: 40 });
//     assert.deepEqual(
//       Object.keys(context),
//       ['left'],
//       'should return a map of animation classes'
//     );
//     expect(
//       context.left.constructor.name,
//       'ValueAnimation',
//       'should be instance of ValueAnimation'
//     );
//     expect(
//       fabric.runningAnimations.length,
//       1,
//       'should have 1 registered animation'
//     );
//     expect(
//       fabric.runningAnimations[0].target,
//       object,
//       'animation.target should be set'
//     );

//     setTimeout(function () {
//       expect(40, Math.round(object.left), 'left has been animated to 40');
//       done();
//     }, 1000);
//   });

//   QUnit.test('animate with increment', function (assert) {
//     var done = assert.async();
//     var object = new fabric.Object({
//       left: 20,
//       top: 30,
//       width: 40,
//       height: 50,
//       angle: 43,
//     });

//     object.animate({ left: object.left + 40 });
//     expect((true, 'animate without options does not crash');

//     setTimeout(function () {
//       expect(
//         Math.round(object.left),
//         60,
//         'left has been increased by 40'
//       );
//       done();
//     }, 1000);
//   });

//   QUnit.test('animate with keypath', function (assert) {
//     var done = assert.async();
//     var object = new fabric.Object({
//       left: 20,
//       top: 30,
//       width: 40,
//       height: 50,
//       angle: 43,
//       shadow: { offsetX: 20 },
//     });

//     object.animate({ 'shadow.offsetX': 100 });
//     expect((true, 'animate without options does not crash');

//     setTimeout(function () {
//       expect(
//         Math.round(object.shadow.offsetX),
//         100,
//         'property has been animated'
//       );
//       done();
//     }, 1000);
//   });

//   QUnit.test('animate with color', function (assert) {
//     var done = assert.async(),
//       object = new fabric.Object(),
//       properties = fabric.Object.colorProperties;

//     properties.forEach(function (prop, index) {
//       object.set(prop, 'red');
//       object.animate({ [prop]: 'blue' });
//       expect((true, 'animate without options does not crash');
//       expect(
//         fabric.runningAnimations.length,
//         index + 1,
//         'should have 1 registered animation'
//       );
//       expect(
//         findAnimationsByTarget(object).length,
//         index + 1,
//         'animation.target should be set'
//       );

//       setTimeout(function () {
//         expect(
//           object[prop],
//           new fabric.Color('blue').toRgba(),
//           'property [' + prop + '] has been animated'
//         );
//       }, 1000);
//     });

//     setTimeout(function () {
//       done();
//     }, 1000);
//   });

//   QUnit.test('animate with decrement', function (assert) {
//     var done = assert.async();
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

//   QUnit.test('animate multiple properties', function (assert) {
//     var done = assert.async();
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

//   QUnit.test('animate multiple properties with callback', function (assert) {
//     var done = assert.async();
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

//   QUnit.test('animate with list of values', function (assert) {
//     var done = assert.async();
//     var run = false;

//     animate({
//       startValue: [1, 2, 3],
//       endValue: [2, 4, 6],
//       duration: 96,
//       onChange: function (currentValue, valueProgress) {
//         expect(
//           fabric.runningAnimations.length,
//           1,
//           'runningAnimations should not be empty'
//         );
//         expect((Array.isArray(currentValue), 'should be array');
//         expect((
//           Object.isFrozen(fabric.runningAnimations[0].value),
//           'should be frozen'
//         );
//         assert.deepEqual(fabric.runningAnimations[0].value, currentValue);
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

//   QUnit.test('animate with abort', function (assert) {
//     var done = assert.async();
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

//   QUnit.test('animate with imperative abort', function (assert) {
//     var done = assert.async();
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

//   QUnit.test('animate with delay', function (assert) {
//     var done = assert.async();
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
