import { describe, it, expect, afterEach } from 'vitest';
import { Rect } from '../shapes/Rect';
import { config } from '../config';
import { Canvas } from './Canvas';
import {
  ActiveSelection,
  getFabricDocument,
  runningAnimations,
  StaticCanvas,
  util,
} from '../../fabric';

function makeRect(options = {}) {
  return new Rect({ top: 5, left: 5, width: 10, height: 10, ...options });
}

describe('Canvas dispose', () => {
  describe.for([
    { name: 'StaticCanvas', CanvasClass: StaticCanvas },
    { name: 'Canvas', CanvasClass: Canvas },
  ])('disposing $name', ({ CanvasClass }) => {
    afterEach(() => {
      config.restoreDefaults();
    });

    it('dispose', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      expect(
        canvas.destroyed,
        'should not have been destroyed yet',
      ).toBeFalsy();
      await canvas.dispose();
      expect(canvas.destroyed, 'should have flagged `destroyed`').toBeTruthy();
    });

    it('dispose: clear references sync', () => {
      const el = getFabricDocument().createElement('canvas');
      const parentEl = getFabricDocument().createElement('div');

      el.width = 200;
      el.height = 200;
      parentEl.className = 'rootNode';
      parentEl.appendChild(el);

      config.configure({ devicePixelRatio: 1.25 });

      el.style.position = 'relative';
      const elStyle = el.style.cssText;
      expect(elStyle, 'el style should not be empty').toBe(
        'position: relative;',
      );

      const canvas = new CanvasClass(el, {
        enableRetinaScaling: true,
        renderOnAddRemove: false,
      });
      expect(
        // @ts-expect-error -- private property
        canvas.elements._originalCanvasStyle,
        'saved original canvas style for disposal',
      ).toBe(elStyle);
      expect(el.style.cssText, 'canvas el style has been changed').not.toBe(
        // @ts-expect-error -- private property
        canvas.elements._originalCanvasStyle,
      );
      expect(
        el.getAttribute('data-fabric'),
        'lowerCanvasEl should be marked by fabric',
      ).toBe('main');
      expect(canvas.dispose).toBeTypeOf('function');
      expect(canvas.destroy).toBeTypeOf('function');
      canvas.add(makeRect(), makeRect(), makeRect());
      canvas.item(0).animate({ scaleX: 10 });
      expect(runningAnimations.length, 'should have a running animation').toBe(
        1,
      );
      canvas.dispose();
      expect(canvas.disposed, 'dispose should flag disposed').toBe(true);
      expect(
        el.hasAttribute('data-fabric'),
        'dispose should clear lowerCanvasEl data-fabric attr',
      ).toBe(false);
      expect(
        // @ts-expect-error -- private property
        canvas.elements._originalCanvasStyle,
        'removed original canvas style',
      ).toBeUndefined();
      expect(el.style.cssText, 'restored original canvas style').toBe(elStyle);
      expect(el.width, 'restored width').toBe(200);
      expect(el.height, 'restored height').toBe(200);
    });

    it('dispose: clear references async', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      expect(canvas.dispose).toBeTypeOf('function');
      expect(canvas.destroy).toBeTypeOf('function');
      canvas.add(makeRect(), makeRect(), makeRect());
      const lowerCanvas = canvas.lowerCanvasEl;
      expect(
        lowerCanvas.getAttribute('data-fabric'),
        'lowerCanvasEl should be marked by fabric',
      ).toBe('main');
      await canvas.dispose();
      expect(canvas.destroyed, 'dispose should flag destroyed').toBe(true);
      expect(canvas.getObjects().length, 'dispose should clear canvas').toBe(0);
      expect(
        canvas.lowerCanvasEl,
        'dispose should clear lowerCanvasEl',
      ).toBeUndefined();
      expect(
        lowerCanvas.hasAttribute('data-fabric'),
        'dispose should clear lowerCanvasEl data-fabric attr',
      ).toBe(false);
      expect(
        canvas.contextContainer,
        'dispose should clear contextContainer',
      ).toBeUndefined();
    });

    it('dispose edge case: multiple calls', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      expect(
        canvas.destroyed,
        'should not have been destroyed yet',
      ).toBeFalsy();
      const res = await Promise.all([
        canvas.dispose(),
        canvas.dispose(),
        canvas.dispose(),
      ]);
      expect(canvas.disposed, 'should have flagged `disposed`').toBeTruthy();
      expect(canvas.destroyed, 'should have flagged `destroyed`').toBeTruthy();
      expect(res, 'should have disposed in the first call').toEqual([
        true,
        false,
        false,
      ]);
    });

    it('dispose edge case: multiple calls after `requestRenderAll`', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      expect(
        canvas.destroyed,
        'should not have been destroyed yet',
      ).toBeFalsy();
      canvas.requestRenderAll();
      const res = await Promise.allSettled([
        canvas.dispose(),
        canvas.dispose(),
        canvas.dispose(),
      ]);
      expect(canvas.disposed, 'should have flagged `disposed`').toBeTruthy();
      expect(canvas.destroyed, 'should have flagged `destroyed`').toBeTruthy();
      expect(
        res,
        'should have disposed in the last call, aborting the other calls',
      ).toEqual([
        { status: 'rejected', reason: 'aborted' },
        { status: 'rejected', reason: 'aborted' },
        { status: 'fulfilled', value: true },
      ]);
    });

    it('dispose edge case: rendering after dispose', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      let called = 0;
      expect(await canvas.dispose(), 'should dispose').toBeTruthy();
      canvas.on('after:render', () => {
        called++;
      });
      canvas.fire('after:render');
      expect(called, 'should have fired').toBe(1);
      // @ts-expect-error -- protected property
      expect(canvas.nextRenderHandle).toBeUndefined();
      canvas.requestRenderAll();
      expect(
        // @ts-expect-error -- private property
        canvas.nextRenderHandle,
        '`requestRenderAll` should have no affect',
      ).toBeUndefined();
      canvas.renderAll();
      expect(called, 'should not have rendered, should still equal 1').toBe(1);
    });

    it('dispose edge case: `toCanvasElement` interrupting `requestRenderAll`', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      // @ts-expect-error -- private property
      expect(canvas.nextRenderHandle).toBeUndefined();
      // @ts-expect-error -- private property
      canvas.nextRenderHandle = 1;
      canvas.toCanvasElement();
      // @ts-expect-error -- private property
      expect(canvas.nextRenderHandle, 'should request rendering').toBe(1);
    });

    it('dispose edge case: `toCanvasElement` after dispose', async () => {
      const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
      const testImageData = (colorByteVal: number) => {
        return canvas
          .toCanvasElement()
          .getContext('2d')!
          .getImageData(0, 0, 20, 20)
          .data.filter((_, i) => i % 4 === 0)
          .every((x) => x === colorByteVal);
      };
      canvas.add(
        makeRect({ fill: 'red', width: 20, height: 20, top: 10, left: 10 }),
      );
      expect(testImageData(255), 'control').toBeTruthy();
      canvas.disposed = true;
      expect(testImageData(255), 'should render canvas').toBeTruthy();
      canvas.destroyed = true;
      expect(
        testImageData(0),
        'should have disabled canvas rendering',
      ).toBeTruthy();
      canvas.destroyed = false;
      expect(await canvas.dispose(), 'dispose').toBeTruthy();
    });

    it('dispose edge case: during animation', () => {
      return new Promise<void>((resolve) => {
        const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
        let called = 0;
        const animate = () =>
          util.animate({
            onChange() {
              if (called === 1) {
                canvas.dispose().then(() => {
                  runningAnimations.cancelAll();
                  resolve();
                });
                expect(canvas.disposed, 'should flag `disposed`').toBeTruthy();
              }
              called++;
              (canvas as Canvas).contextTopDirty = true;
              // @ts-expect-error -- private property
              canvas.hasLostContext = true;
              canvas.renderAll();
            },
            onComplete() {
              animate();
            },
          });
        animate();
      });
    });

    it('disposing during animation should cancel it by target', () => {
      return new Promise<void>((resolve) => {
        const canvas = new CanvasClass(undefined, { renderOnAddRemove: false });
        let called = 0;
        const animate = () =>
          util.animate({
            target: canvas,
            onChange() {
              if (called === 1) {
                expect(
                  runningAnimations[0].target,
                  'should register the animation by target',
                ).toBe(canvas);
                canvas.dispose().then(() => {
                  expect(
                    runningAnimations,
                    'should cancel the animation',
                  ).toEqual([]);
                  resolve();
                });
                expect(canvas.disposed, 'should flag `disposed`').toBeTruthy();
              }
              called++;
              // TODO: check typings, because this runs for both static and normal canvas but it is only typed on normal canvas
              (canvas as Canvas).contextTopDirty = true;
              // @ts-expect-error -- private property
              canvas.hasLostContext = true;
              canvas.renderAll();
            },
            onComplete() {
              animate();
            },
          });
        animate();
      });
    });

    if (CanvasClass === Canvas) {
      it('dispose: clear refs sync for Canvas', () => {
        const el = getFabricDocument().createElement('canvas');
        const parentEl = getFabricDocument().createElement('div');

        el.width = 200;
        el.height = 200;
        parentEl.className = 'rootNode';
        parentEl.appendChild(el);

        config.configure({ devicePixelRatio: 1.25 });

        expect(
          parentEl.firstChild,
          'canvas should be appended at parentEl',
        ).toBe(el);
        expect(parentEl.childNodes.length, 'parentEl has 1 child only').toBe(1);

        el.style.position = 'relative';
        const elStyle = el.style.cssText;
        expect(elStyle, 'el style should not be empty').toBe(
          'position: relative;',
        );

        const canvas = new Canvas(el, {
          enableRetinaScaling: true,
          renderOnAddRemove: false,
        });
        const { upperCanvasEl, lowerCanvasEl, wrapperEl } = canvas;
        const activeSel = new ActiveSelection();

        expect(
          parentEl.childNodes.length,
          'parentEl has still 1 child only',
        ).toBe(1);
        expect(
          wrapperEl.childNodes.length,
          'wrapper should have 2 children',
        ).toBe(2);
        expect(wrapperEl.tagName, 'We wrapped canvas with DIV').toBe('DIV');
        expect(wrapperEl.className, 'DIV class should be set').toBe(
          canvas.containerClass,
        );
        expect(
          wrapperEl.childNodes[0],
          'First child should be lowerCanvas',
        ).toBe(lowerCanvasEl);
        expect(
          wrapperEl.childNodes[1],
          'Second child should be upperCanvas',
        ).toBe(upperCanvasEl);
        expect(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
          'saved original canvas style for disposal',
        ).toBe(elStyle);
        expect(activeSel, 'active selection').toBeInstanceOf(ActiveSelection);
        expect(el.style.cssText, 'canvas el style has been changed').not.toBe(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
        );

        expect(
          parentEl.childNodes[0],
          'wrapperEl is appended to rootNode',
        ).toBe(wrapperEl);

        expect(
          parentEl.childNodes.length,
          'parent div should have 1 child',
        ).toBe(1);
        expect(
          parentEl.firstChild,
          'canvas should not be parent div firstChild',
        ).not.toBe(canvas.getElement());
        expect(canvas.dispose).toBeTypeOf('function');
        expect(canvas.destroy).toBeTypeOf('function');

        canvas.add(makeRect(), makeRect(), makeRect());
        canvas.item(0).animate({ scaleX: 10 });
        activeSel.add(canvas.item(1));
        expect(
          runningAnimations.length,
          'should have a running animation',
        ).toBe(1);

        canvas.dispose();
        expect(parentEl.childNodes.length, 'parent has always 1 child').toBe(1);

        expect(
          parentEl.childNodes[0],
          'canvas should be back to its firstChild place',
        ).toBe(lowerCanvasEl);

        expect(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
          'removed original canvas style',
        ).toBeUndefined();
        expect(el.style.cssText, 'restored original canvas style').toBe(
          elStyle,
        );
        expect(el.width, 'restored width').toBe(200);
        expect(el.height, 'restored height').toBe(200);
      });

      it('dispose: clear refs async for Canvas', async () => {
        const el = getFabricDocument().createElement('canvas');
        const parentEl = getFabricDocument().createElement('div');

        el.width = 200;
        el.height = 200;
        parentEl.className = 'rootNode';
        parentEl.appendChild(el);

        config.configure({ devicePixelRatio: 1.25 });

        expect(
          parentEl.firstChild,
          'canvas should be appended at partentEl',
        ).toBe(el);
        expect(parentEl.childNodes.length, 'parentEl has 1 child only').toBe(1);

        el.style.position = 'relative';
        const elStyle = el.style.cssText;
        expect(elStyle, 'el style should not be empty').toBe(
          'position: relative;',
        );

        const canvas = new Canvas(el, {
          enableRetinaScaling: true,
          renderOnAddRemove: false,
        });
        const { wrapperEl, lowerCanvasEl, upperCanvasEl } = canvas;
        const activeSel = new ActiveSelection();
        canvas.setActiveObject(activeSel);

        expect(
          parentEl.childNodes.length,
          'parentEl has still 1 child only',
        ).toBe(1);
        expect(
          wrapperEl.childNodes.length,
          'wrapper should have 2 children',
        ).toBe(2);
        expect(wrapperEl.tagName, 'We wrapped canvas with DIV').toBe('DIV');
        expect(wrapperEl.className, 'DIV class should be set').toBe(
          canvas.containerClass,
        );
        expect(
          wrapperEl.childNodes[0],
          'First child should be lowerCanvas',
        ).toBe(lowerCanvasEl);
        expect(
          wrapperEl.childNodes[1],
          'Second child should be upperCanvas',
        ).toBe(upperCanvasEl);
        expect(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
          'saved original canvas style for disposal',
        ).toBe(elStyle);
        expect(
          canvas.getActiveObject() === activeSel,
          'active selection',
        ).toBeTruthy();
        expect(el.style.cssText, 'canvas el style has been changed').not.toBe(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
        );

        expect(
          parentEl.childNodes[0],
          'wrapperEl is appended to rootNode',
        ).toBe(wrapperEl);

        expect(
          parentEl.childNodes.length,
          'parent div should have 1 child',
        ).toBe(1);
        expect(
          parentEl.firstChild,
          'canvas should not be parent div firstChild',
        ).not.toBe(canvas.getElement());
        expect(canvas.dispose).toBeTypeOf('function');
        expect(canvas.destroy).toBeTypeOf('function');

        canvas.add(makeRect(), makeRect(), makeRect());
        canvas.item(0).animate({ scaleX: 10 });
        activeSel.add(canvas.item(1));
        expect(
          runningAnimations.length,
          'should have a running animation',
        ).toBe(1);

        await canvas.dispose();
        expect(
          runningAnimations.length,
          'dispose should clear running animations',
        ).toBe(0);
        expect(canvas.getObjects().length, 'dispose should clear canvas').toBe(
          0,
        );
        expect(
          canvas.getActiveObject(),
          'dispose should dispose active selection',
        ).toBeUndefined();
        expect(
          activeSel.size(),
          'dispose should dispose active selection',
        ).toBe(0);
        expect(parentEl.childNodes.length, 'parent has always 1 child').toBe(1);

        expect(
          parentEl.childNodes[0],
          'canvas should be back to its firstChild place',
        ).toBe(lowerCanvasEl);

        expect(canvas.wrapperEl, 'wrapperEl should be deleted').toBeUndefined();
        expect(
          canvas.upperCanvasEl,
          'upperCanvas should be deleted',
        ).toBeUndefined();
        expect(
          canvas.lowerCanvasEl,
          'lowerCanvasEl should be deleted',
        ).toBeUndefined();
        expect(
          // @ts-expect-error -- private property
          canvas.pixelFindCanvasEl,
          'pixelFindCanvasEl should be deleted',
        ).toBeUndefined();
        expect(
          canvas.contextTop,
          'contextTop should be deleted',
        ).toBeUndefined();
        expect(
          // @ts-expect-error -- private property
          canvas.pixelFindContext,
          'pixelFindContext should be deleted',
        ).toBeNull();
        expect(
          // @ts-expect-error -- private property
          canvas.elements._originalCanvasStyle,
          'removed original canvas style',
        ).toBeUndefined();
        expect(el.style.cssText, 'restored original canvas style').toBe(
          elStyle,
        );
        expect(el.width, 'restored width').toBe(200);
        expect(el.height, 'restored height').toBe(200);
      });
    }
  });
});
