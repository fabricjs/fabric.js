import { describe, it, expect } from 'vitest';
import { FabricObject } from './FabricObject';
import { Point } from '../../Point';

describe('ObjectInteractivity', () => {
  it('isControlVisible', () => {
    expect(Object, 'Object should exist').toBeTruthy();

    const cObj = new FabricObject({});

    expect(typeof cObj.isControlVisible, 'isControlVisible should exist').toBe(
      'function',
    );
    expect(cObj.isControlVisible('tl'), 'tl control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('tr'), 'tr control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('br'), 'br control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('bl'), 'bl control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('ml'), 'ml control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('mt'), 'mt control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('mr'), 'mr control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('mb'), 'mb control should be visible').toBe(
      true,
    );
    expect(cObj.isControlVisible('mtr'), 'mtr control should be visible').toBe(
      true,
    );
  });

  it('setControlVisible', () => {
    expect(Object, 'Object should exist').toBeTruthy();

    const cObj = new FabricObject({});

    expect(
      typeof cObj.setControlVisible,
      'setControlVisible should exist',
    ).toBe('function');

    cObj.setControlVisible('tl', false);
    expect(
      cObj.isControlVisible('tl'),
      'tl control should not be visible',
    ).toBe(false);

    cObj.setControlVisible('tl', true);
    expect(
      cObj.isControlVisible('tl'),
      'tl control should be visible again',
    ).toBe(true);
  });

  it('setControlVisible is per object', () => {
    expect(Object, 'Object should exist').toBeTruthy();

    const cObj = new FabricObject({});
    const cObj2 = new FabricObject({});

    cObj.setControlVisible('tl', false);
    expect(
      cObj.isControlVisible('tl'),
      'setting to false worked for cObj',
    ).toBe(false);
    expect(
      cObj2.isControlVisible('tl'),
      'setting to false did not work for cObj2',
    ).toBe(true);

    cObj.controls.tl.setVisibility(false);
    expect(
      cObj2.isControlVisible('tl'),
      'setting directly on controls does not affect other objects',
    ).toBe(true);

    cObj.setControlVisible('tl', true);
    expect(cObj.isControlVisible('tl'), 'object setting takes precedence').toBe(
      true,
    );

    // restore original visibility
    cObj.controls.tl.setVisibility(true);
  });

  it('setControlsVisibility', () => {
    expect(Object, 'Object should exist').toBeTruthy();

    const cObj = new FabricObject({});

    expect(
      typeof cObj.setControlsVisibility,
      'setControlsVisibility should exist',
    ).toBe('function');

    cObj.setControlsVisibility({
      bl: false,
      br: false,
      mb: false,
      ml: false,
      mr: false,
      mt: false,
      tl: false,
      tr: false,
      mtr: false,
    });

    expect(
      cObj.isControlVisible('tl'),
      'tl control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('tr'),
      'tr control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('br'),
      'br control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('bl'),
      'bl control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('ml'),
      'ml control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('mt'),
      'mt control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('mr'),
      'mr control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('mb'),
      'mb control should not be visible',
    ).toBe(false);
    expect(
      cObj.isControlVisible('mtr'),
      'mtr control should not be visible',
    ).toBe(false);

    cObj.setControlsVisibility({
      bl: true,
      br: true,
      mb: true,
      ml: true,
      mr: true,
      mt: true,
      tl: true,
      tr: true,
      mtr: true,
    });

    expect(
      cObj.isControlVisible('tl'),
      'tl control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('tr'),
      'tr control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('br'),
      'br control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('bl'),
      'bl control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('ml'),
      'ml control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('mt'),
      'mt control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('mr'),
      'mr control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('mb'),
      'mb control should be visible again',
    ).toBe(true);
    expect(
      cObj.isControlVisible('mtr'),
      'mtr control should be visible again',
    ).toBe(true);
  });

  it('corner coords', () => {
    const cObj = new FabricObject({
      top: 15,
      left: 15,
      width: 10,
      height: 10,
      strokeWidth: 0,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });
    cObj.setCoords();

    expect(cObj.oCoords.tl.corner.tl.x.toFixed(2), 'tl corner.tl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.tl.y.toFixed(2), 'tl corner.tl.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.tr.x.toFixed(2), 'tl corner.tr.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.tr.y.toFixed(2), 'tl corner.tr.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.bl.x.toFixed(2), 'tl corner.bl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.bl.y.toFixed(2), 'tl corner.bl.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.br.x.toFixed(2), 'tl corner.br.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.br.y.toFixed(2), 'tl corner.br.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.bl.corner.tl.x.toFixed(2), 'bl corner.tl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.bl.corner.tl.y.toFixed(2), 'bl corner.tl.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.bl.corner.tr.x.toFixed(2), 'bl corner.tr.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.bl.corner.tr.y.toFixed(2), 'bl corner.tr.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.bl.corner.bl.x.toFixed(2), 'bl corner.bl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.bl.corner.bl.y.toFixed(2), 'bl corner.bl.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.bl.corner.br.x.toFixed(2), 'bl corner.br.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.bl.corner.br.y.toFixed(2), 'bl corner.br.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.tr.corner.tl.x.toFixed(2), 'tr corner.tl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.tr.corner.tl.y.toFixed(2), 'tr corner.tl.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tr.corner.tr.x.toFixed(2), 'tr corner.tr.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.tr.corner.tr.y.toFixed(2), 'tr corner.tr.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tr.corner.bl.x.toFixed(2), 'tr corner.bl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.tr.corner.bl.y.toFixed(2), 'tr corner.bl.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tr.corner.br.x.toFixed(2), 'tr corner.br.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.tr.corner.br.y.toFixed(2), 'tr corner.br.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.br.corner.tl.x.toFixed(2), 'br corner.tl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.tl.y.toFixed(2), 'br corner.tl.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.tr.x.toFixed(2), 'br corner.tr.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.tr.y.toFixed(2), 'br corner.tr.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.bl.x.toFixed(2), 'br corner.bl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.bl.y.toFixed(2), 'br corner.bl.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.br.x.toFixed(2), 'br corner.br.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.br.y.toFixed(2), 'br corner.br.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.mtr.corner.tl.x.toFixed(2), 'mtr corner.tl.x').toBe(
      '8.50',
    );
    expect(cObj.oCoords.mtr.corner.tl.y.toFixed(2), 'mtr corner.tl.y').toBe(
      '-36.50',
    );
    expect(cObj.oCoords.mtr.corner.tr.x.toFixed(2), 'mtr corner.tr.x').toBe(
      '21.50',
    );
    expect(cObj.oCoords.mtr.corner.tr.y.toFixed(2), 'mtr corner.tr.y').toBe(
      '-36.50',
    );
    expect(cObj.oCoords.mtr.corner.bl.x.toFixed(2), 'mtr corner.bl.x').toBe(
      '8.50',
    );
    expect(cObj.oCoords.mtr.corner.bl.y.toFixed(2), 'mtr corner.bl.y').toBe(
      '-23.50',
    );
    expect(cObj.oCoords.mtr.corner.br.x.toFixed(2), 'mtr corner.br.x').toBe(
      '21.50',
    );
    expect(cObj.oCoords.mtr.corner.br.y.toFixed(2), 'mtr corner.br.y').toBe(
      '-23.50',
    );
  });

  // set size for bottom left corner and have different results for bl than normal setCornerCoords test
  it('corner coords: custom control size', () => {
    //set custom corner size
    const sharedControls = FabricObject.createControls().controls;
    sharedControls.bl.sizeX = 30;
    sharedControls.bl.sizeY = 10;

    const cObj = new FabricObject({
      top: 15,
      left: 15,
      width: 10,
      height: 10,
      strokeWidth: 0,
      controls: sharedControls,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });
    cObj.setCoords();

    expect(cObj.oCoords.tl.corner.tl.x.toFixed(2), 'tl corner.tl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.tl.y.toFixed(2), 'tl corner.tl.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.tr.x.toFixed(2), 'tl corner.tr.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.tr.y.toFixed(2), 'tl corner.tr.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.bl.x.toFixed(2), 'tl corner.bl.x').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tl.corner.bl.y.toFixed(2), 'tl corner.bl.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.br.x.toFixed(2), 'tl corner.br.x').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tl.corner.br.y.toFixed(2), 'tl corner.br.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.bl.corner.tl.x.toFixed(2), 'bl corner.tl.x').toBe(
      '-5.00',
    );
    expect(cObj.oCoords.bl.corner.tl.y.toFixed(2), 'bl corner.tl.y').toBe(
      '15.00',
    );
    expect(cObj.oCoords.bl.corner.tr.x.toFixed(2), 'bl corner.tr.x').toBe(
      '25.00',
    );
    expect(cObj.oCoords.bl.corner.tr.y.toFixed(2), 'bl corner.tr.y').toBe(
      '15.00',
    );
    expect(cObj.oCoords.bl.corner.bl.x.toFixed(2), 'bl corner.bl.x').toBe(
      '-5.00',
    );
    expect(cObj.oCoords.bl.corner.bl.y.toFixed(2), 'bl corner.bl.y').toBe(
      '25.00',
    );
    expect(cObj.oCoords.bl.corner.br.x.toFixed(2), 'bl corner.br.x').toBe(
      '25.00',
    );
    expect(cObj.oCoords.bl.corner.br.y.toFixed(2), 'bl corner.br.y').toBe(
      '25.00',
    );
    expect(cObj.oCoords.tr.corner.tl.x.toFixed(2), 'tr corner.tl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.tr.corner.tl.y.toFixed(2), 'tr corner.tl.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tr.corner.tr.x.toFixed(2), 'tr corner.tr.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.tr.corner.tr.y.toFixed(2), 'tr corner.tr.y').toBe(
      '3.50',
    );
    expect(cObj.oCoords.tr.corner.bl.x.toFixed(2), 'tr corner.bl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.tr.corner.bl.y.toFixed(2), 'tr corner.bl.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.tr.corner.br.x.toFixed(2), 'tr corner.br.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.tr.corner.br.y.toFixed(2), 'tr corner.br.y').toBe(
      '16.50',
    );
    expect(cObj.oCoords.br.corner.tl.x.toFixed(2), 'br corner.tl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.tl.y.toFixed(2), 'br corner.tl.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.tr.x.toFixed(2), 'br corner.tr.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.tr.y.toFixed(2), 'br corner.tr.y').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.bl.x.toFixed(2), 'br corner.bl.x').toBe(
      '13.50',
    );
    expect(cObj.oCoords.br.corner.bl.y.toFixed(2), 'br corner.bl.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.br.x.toFixed(2), 'br corner.br.x').toBe(
      '26.50',
    );
    expect(cObj.oCoords.br.corner.br.y.toFixed(2), 'br corner.br.y').toBe(
      '26.50',
    );
    expect(cObj.oCoords.mtr.corner.tl.x.toFixed(2), 'mtr corner.tl.x').toBe(
      '8.50',
    );
    expect(cObj.oCoords.mtr.corner.tl.y.toFixed(2), 'mtr corner.tl.y').toBe(
      '-36.50',
    );
    expect(cObj.oCoords.mtr.corner.tr.x.toFixed(2), 'mtr corner.tr.x').toBe(
      '21.50',
    );
    expect(cObj.oCoords.mtr.corner.tr.y.toFixed(2), 'mtr corner.tr.y').toBe(
      '-36.50',
    );
    expect(cObj.oCoords.mtr.corner.bl.x.toFixed(2), 'mtr corner.bl.x').toBe(
      '8.50',
    );
    expect(cObj.oCoords.mtr.corner.bl.y.toFixed(2), 'mtr corner.bl.y').toBe(
      '-23.50',
    );
    expect(cObj.oCoords.mtr.corner.br.x.toFixed(2), 'mtr corner.br.x').toBe(
      '21.50',
    );
    expect(cObj.oCoords.mtr.corner.br.y.toFixed(2), 'mtr corner.br.y').toBe(
      '-23.50',
    );

    // reset
    sharedControls.bl.sizeX = 0;
    sharedControls.bl.sizeY = 0;
  });

  it('findControl', () => {
    const cObj = new FabricObject({
      top: 25,
      left: 25,
      width: 30,
      height: 30,
      strokeWidth: 0,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });

    expect(typeof cObj.findControl, 'findControl should exist').toBe(
      'function',
    );

    cObj.setCoords();
    // @ts-expect-error -- mock canvas
    cObj.canvas = {
      getActiveObject() {
        return cObj;
      },
    };

    expect(cObj.findControl(cObj.oCoords.br), 'br control').toEqual({
      key: 'br',
      control: cObj.controls.br,
      coord: cObj.oCoords.br,
    });
    expect(cObj.findControl(cObj.oCoords.tl), 'tl control').toEqual({
      key: 'tl',
      control: cObj.controls.tl,
      coord: cObj.oCoords.tl,
    });
    expect(cObj.findControl(cObj.oCoords.tr), 'tr control').toEqual({
      key: 'tr',
      control: cObj.controls.tr,
      coord: cObj.oCoords.tr,
    });
    expect(cObj.findControl(cObj.oCoords.bl), 'bl control').toEqual({
      key: 'bl',
      control: cObj.controls.bl,
      coord: cObj.oCoords.bl,
    });
    expect(cObj.findControl(cObj.oCoords.mr), 'mr control').toEqual({
      key: 'mr',
      control: cObj.controls.mr,
      coord: cObj.oCoords.mr,
    });
    expect(cObj.findControl(cObj.oCoords.ml), 'ml control').toEqual({
      key: 'ml',
      control: cObj.controls.ml,
      coord: cObj.oCoords.ml,
    });
    expect(cObj.findControl(cObj.oCoords.mt), 'mt control').toEqual({
      key: 'mt',
      control: cObj.controls.mt,
      coord: cObj.oCoords.mt,
    });
    expect(cObj.findControl(cObj.oCoords.mb), 'mb control').toEqual({
      key: 'mb',
      control: cObj.controls.mb,
      coord: cObj.oCoords.mb,
    });
    expect(cObj.findControl(cObj.oCoords.mtr), 'mtr control').toEqual({
      key: 'mtr',
      control: cObj.controls.mtr,
      coord: cObj.oCoords.mtr,
    });
    expect(cObj.findControl(new Point()), 'empty point').toBeUndefined();
  });

  it('findControl for touches', () => {
    const cObj = new FabricObject({
      top: 10,
      left: 10,
      width: 30,
      height: 30,
      strokeWidth: 0,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });

    cObj.setCoords();
    // @ts-expect-error -- mock canvas
    cObj.canvas = {
      getActiveObject() {
        return cObj;
      },
    };

    const pointNearBr = new Point({
      x: cObj.oCoords.br.x + cObj.cornerSize / 3,
      y: cObj.oCoords.br.y + cObj.cornerSize / 3,
    });

    expect(
      cObj.findControl(pointNearBr)!.key,
      'cornerSize/3 near br returns br',
    ).toBe('br');
    expect(
      cObj.findControl(pointNearBr, true)!.key,
      'touch event cornerSize/3 near br returns br',
    ).toBe('br');

    const pointNearBrTouch = new Point({
      x: cObj.oCoords.br.x + cObj.touchCornerSize / 3,
      y: cObj.oCoords.br.y + cObj.touchCornerSize / 3,
    });

    expect(
      cObj.findControl(pointNearBrTouch, true)!.key,
      'touch event touchCornerSize/3 near br returns br',
    ).toBe('br');
    expect(
      cObj.findControl(pointNearBrTouch, false),
      'not touch event touchCornerSize/3 near br returns undefined',
    ).toBeUndefined();
  });

  it('findControl for non active object', () => {
    const cObj = new FabricObject({
      top: 10,
      left: 10,
      width: 30,
      height: 30,
      strokeWidth: 0,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });

    expect(typeof cObj.findControl, 'findControl should exist').toBe(
      'function',
    );

    cObj.setCoords();
    // @ts-expect-error -- mock canvas
    cObj.canvas = {
      getActiveObject() {
        return undefined;
      },
    };

    expect(
      cObj.findControl(cObj.oCoords.mtr),
      'object is not active',
    ).toBeUndefined();
  });

  it('findControl for non visible control', () => {
    const cObj = new FabricObject({
      top: 10,
      left: 10,
      width: 30,
      height: 30,
      strokeWidth: 0,
      // @ts-expect-error -- mock canvas
      canvas: {},
    });

    expect(typeof cObj.findControl, 'findControl should exist').toBe(
      'function',
    );

    cObj.setCoords();
    // @ts-expect-error -- mock canvas
    cObj.canvas = {
      getActiveObject() {
        return cObj;
      },
    };

    cObj.isControlVisible = () => false;

    expect(
      cObj.findControl(cObj.oCoords.mtr),
      'control is not visible',
    ).toBeUndefined();
  });

  it('_calculateCurrentDimensions', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });

    expect(
      typeof cObj._calculateCurrentDimensions,
      '_calculateCurrentDimensions should exist',
    ).toBe('function');

    let dim = cObj._calculateCurrentDimensions();

    expect(dim.x, 'width without transformations').toBe(10);
    expect(dim.y, 'height without transformations').toBe(15);

    cObj.strokeWidth = 2;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x, 'strokeWidth should be added to dimension').toBe(12);
    expect(dim.y, 'strokeWidth should be added to dimension').toBe(17);

    cObj.scaleX = 2;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x, 'width should be doubled').toBe(24);
    expect(dim.y, 'height should not change').toBe(17);

    cObj.scaleY = 2;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x, 'width should not change').toBe(24);
    expect(dim.y, 'height should be doubled').toBe(34);

    cObj.angle = 45;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x, 'width should not change with rotation').toBe(24);
    expect(dim.y, 'height should not change with rotation').toBe(34);

    cObj.skewX = 45;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x.toFixed(0), 'width should change with skewX').toBe('58');
    expect(dim.y.toFixed(0), 'height should not change with skewX').toBe('34');

    cObj.skewY = 45;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x.toFixed(0), 'width should not change with skewY').toBe('82');
    expect(dim.y.toFixed(0), 'height should change with skewY').toBe('58');

    cObj.padding = 10;
    dim = cObj._calculateCurrentDimensions();

    expect(dim.x.toFixed(0), 'width should change with padding').toBe('102');
    expect(dim.y.toFixed(0), 'height should change with padding').toBe('78');
  });

  it('_getTransformedDimensions', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });

    expect(
      typeof cObj._getTransformedDimensions,
      '_getTransformedDimensions should exist',
    ).toBe('function');

    let dim = cObj._getTransformedDimensions();

    expect(dim.x, 'width without transformations').toBe(10);
    expect(dim.y, 'height without transformations').toBe(15);

    cObj.strokeWidth = 2;
    dim = cObj._getTransformedDimensions();

    expect(dim.x, 'strokeWidth should be added to dimension').toBe(12);
    expect(dim.y, 'strokeWidth should be added to dimension').toBe(17);

    cObj.scaleX = 2;
    dim = cObj._getTransformedDimensions();

    expect(dim.x, 'width should be doubled').toBe(24);
    expect(dim.y, 'height should not change').toBe(17);

    cObj.scaleY = 2;
    dim = cObj._getTransformedDimensions();

    expect(dim.x, 'width should not change').toBe(24);
    expect(dim.y, 'height should be doubled').toBe(34);

    cObj.angle = 45;
    dim = cObj._getTransformedDimensions();

    expect(dim.x, 'width should not change with rotation').toBe(24);
    expect(dim.y, 'height should not change with rotation').toBe(34);

    cObj.skewX = 45;
    dim = cObj._getTransformedDimensions();

    expect(dim.x.toFixed(0), 'width should change with skewX').toBe('58');
    expect(dim.y.toFixed(0), 'height should not change with skewX').toBe('34');

    cObj.skewY = 45;
    dim = cObj._getTransformedDimensions();

    expect(dim.x.toFixed(0), 'width should not change with skewY').toBe('82');
    expect(dim.y.toFixed(0), 'height should change with skewY').toBe('58');

    cObj.padding = 10;
    dim = cObj._getTransformedDimensions();

    expect(dim.x.toFixed(0), 'width should not change with padding').toBe('82');
    expect(dim.y.toFixed(0), 'height should not change with padding').toBe(
      '58',
    );
  });

  it('_getNonTransformedDimensions', () => {
    const cObj = new FabricObject({ width: 10, height: 15, strokeWidth: 0 });

    expect(
      typeof cObj._getNonTransformedDimensions,
      '_getNonTransformedDimensions should exist',
    ).toBe('function');

    let dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width without transformations').toBe(10);
    expect(dim.y, 'height without transformations').toBe(15);

    cObj.strokeWidth = 2;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'strokeWidth should be added to dimension').toBe(12);
    expect(dim.y, 'strokeWidth should be added to dimension').toBe(17);

    cObj.scaleX = 2;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with scale').toBe(12);
    expect(dim.y, 'height should not change with scale').toBe(17);

    cObj.scaleY = 2;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with scale').toBe(12);
    expect(dim.y, 'height should not change with scale').toBe(17);

    cObj.angle = 45;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with rotation').toBe(12);
    expect(dim.y, 'height should not change with rotation').toBe(17);

    cObj.skewX = 45;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with skewX').toBe(12);
    expect(dim.y, 'height should not change with skewX').toBe(17);

    cObj.skewY = 45;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with skewY').toBe(12);
    expect(dim.y, 'height should not change with skewY').toBe(17);

    cObj.padding = 10;
    dim = cObj._getNonTransformedDimensions();

    expect(dim.x, 'width should not change with padding').toBe(12);
    expect(dim.y, 'height should not change with padding').toBe(17);
  });
});
