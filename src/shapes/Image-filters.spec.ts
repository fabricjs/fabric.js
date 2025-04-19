import { describe, it, expect } from 'vitest';
import { BlendColor } from '../filters/BlendColor';
import { Brightness } from '../filters/Brightness';
import { Composed } from '../filters/Composed';
import { ColorMatrix } from '../filters/ColorMatrix';
import { HueRotation } from '../filters/HueRotation';
import { Contrast } from '../filters/Contrast';
import { Saturation } from '../filters/Saturation';
import { Gamma } from '../filters/Gamma';
import { Convolute } from '../filters/Convolute';
import { Grayscale } from '../filters/Grayscale';
import { Invert } from '../filters/Invert';
import { Noise } from '../filters/Noise';
import { Pixelate } from '../filters/Pixelate';
import { RemoveColor } from '../filters/RemoveColor';
import { Sepia } from '../filters/ColorMatrixFilters';
import { Resize } from '../filters/Resize';
import { Vibrance } from '../filters/Vibrance';
import { getFabricDocument } from '../env';
import { Blur } from '../filters/Blur';
import type { T2DPipelineState } from '../filters';

const canvas = getFabricDocument().createElement('canvas');
const context = canvas.getContext('2d')!;

function _createImageData(context: CanvasRenderingContext2D) {
  const imageData = context.createImageData(3, 1);

  imageData.data[0] = 200;
  imageData.data[1] = 100;
  imageData.data[2] = 50;
  imageData.data[3] = 1;
  imageData.data[4] = 30;
  imageData.data[5] = 255;
  imageData.data[6] = 10;
  imageData.data[7] = 1;
  imageData.data[8] = 255;
  imageData.data[9] = 255;
  imageData.data[10] = 3;
  imageData.data[11] = 1;

  return imageData;
}

describe('Image filters', () => {
  describe('Brightness', () => {
    it('constructor', () => {
      expect(Brightness, 'Brightness filter should exist').toBeTruthy();

      const filter = new Brightness();

      expect(filter, 'should inherit from Brightness').toBeInstanceOf(
        Brightness,
      );
    });

    it('properties', () => {
      const filter = new Brightness();

      expect(filter.type, 'type should be Brightness').toBe('Brightness');
      expect(filter.brightness, 'default brightness should be 0').toBe(0);

      const filter2 = new Brightness({ brightness: 0.12 });

      expect(
        filter2.brightness,
        'brightness should match constructor value',
      ).toBe(0.12);
    });

    it('applyTo2d', () => {
      const filter = new Brightness();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values', () => {
      const filter = new Brightness({ brightness: 0.2 });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [251, 151, 101, 1, 81, 255, 61, 1, 255, 255, 54, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Brightness();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Brightness","brightness":0}');

      filter.brightness = 100;

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with brightness 100 should match expected value',
      ).toBe('{"type":"Brightness","brightness":100}');
    });

    it('toJSON', () => {
      const filter = new Brightness();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Brightness","brightness":0}');

      filter.brightness = 100;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with brightness 100 should match expected value',
      ).toBe('{"type":"Brightness","brightness":100}');
    });

    it('fromObject', async () => {
      const filter = new Brightness();
      const object = filter.toObject();

      const newFilter = await Brightness.fromObject(object);

      expect(newFilter, 'enlived filter should match original').toEqual(filter);
    });

    it('isNeutralState', () => {
      const filter = new Brightness();

      expect(
        filter.isNeutralState(),
        'should be neutral when brightness is 0',
      ).toBeTruthy();

      filter.brightness = 0.15;

      expect(
        filter.isNeutralState(),
        'should not be neutral when brightness changes',
      ).toBeFalsy();
    });
  });

  describe('Composed', () => {
    it('constructor', () => {
      expect(Composed, 'Composed filter should exist').toBeTruthy();

      const filter = new Composed();

      expect(filter, 'should inherit from Composed').toBeInstanceOf(Composed);
    });

    it('properties', () => {
      const filter = new Composed();

      expect(filter.type, 'type should be Composed').toBe('Composed');
    });

    it('toObject', () => {
      const filter = new Composed();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Composed","subFilters":[]}');
    });

    it('toObject with subfilters', () => {
      const filter = new Composed();
      const brightness = new Brightness();
      const contrast = new Contrast();

      filter.subFilters.push(brightness);
      filter.subFilters.push(contrast);

      const contrastObj = contrast.toObject();
      const brightnessObj = brightness.toObject();
      const object = filter.toObject();

      expect(object.subFilters.length, 'there should be 2 subfilters').toBe(2);
      expect(
        object.subFilters[0],
        'the first subfilter should be serialized',
      ).toEqual(brightnessObj);
      expect(
        object.subFilters[1],
        'the second subfilter should be serialized',
      ).toEqual(contrastObj);
    });

    it('toJSON', () => {
      const filter2 = new Composed();

      expect(filter2.toJSON, 'should have toJSON method').toBeTypeOf(
        'function',
      );

      const json = filter2.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Composed","subFilters":[]}');
    });

    it('fromObject', async () => {
      const filter = new Composed();
      const object = filter.toObject();

      const restoredFilters = await Composed.fromObject(object);

      expect(restoredFilters, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('fromObject with subfilters', async () => {
      const filter = new Composed();
      const brightness = new Brightness();
      const contrast = new Contrast();

      filter.subFilters.push(brightness);
      filter.subFilters.push(contrast);

      const toObject = filter.toObject();
      const newFilter = await Composed.fromObject(toObject);

      expect(newFilter, 'should inherit from Composed').toBeInstanceOf(
        Composed,
      );
      expect(
        newFilter.subFilters[0],
        'should inherit from Brightness',
      ).toBeInstanceOf(Brightness);
      expect(
        newFilter.subFilters[1],
        'should inherit from Contrast',
      ).toBeInstanceOf(Contrast);
    });

    it('isNeutralState', () => {
      const filter = new Composed();
      const brightness = new Brightness();
      const contrast = new Contrast();

      filter.subFilters.push(brightness);
      filter.subFilters.push(contrast);

      expect(
        filter.isNeutralState(),
        'should be neutral when all filters are neutral',
      ).toBeTruthy();

      (filter.subFilters[0] as Brightness).brightness = 0.15;

      expect(
        filter.isNeutralState(),
        'should not be neutral when one subfilter changes',
      ).toBeFalsy();
    });
  });

  describe('ColorMatrix', () => {
    it('constructor', () => {
      expect(ColorMatrix, 'ColorMatrix filter should exist').toBeTruthy();

      const filter = new ColorMatrix();

      expect(filter, 'should inherit from ColorMatrix').toBeInstanceOf(
        ColorMatrix,
      );
    });

    it('properties', () => {
      const filter = new ColorMatrix();

      expect(filter.type, 'type should be ColorMatrix').toBe('ColorMatrix');
      expect(
        filter.matrix,
        'default matrix should match expected values',
      ).toEqual([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]);

      const filter2 = new ColorMatrix({
        matrix: [
          0, 1, 0, 0, 0.2, 0, 0, 1, 0, 0.1, 1, 0, 0, 0, 0.3, 0, 0, 0, 1, 0,
        ],
      });

      expect(filter2.matrix, 'matrix should match constructor value').toEqual([
        0, 1, 0, 0, 0.2, 0, 0, 1, 0, 0.1, 1, 0, 0, 0, 0.3, 0, 0, 0, 1, 0,
      ]);
    });

    it('applyTo2d', () => {
      const filter = new ColorMatrix();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values', () => {
      const filter = new ColorMatrix({
        matrix: [
          0, 1, 0, 0, 0.2, 0, 0, 1, 0, 0.1, 1, 0, 0, 0, 0.3, 0, 0, 0, 1, 0,
        ],
      });

      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [151, 76, 255, 1, 255, 36, 106, 1, 255, 28, 255, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new ColorMatrix();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe(
        '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],"colorsOnly":true}',
      );

      filter.matrix = [
        0, 1, 0, 0, 0.2, 0, 0, 1, 0, 0.1, 1, 0, 0, 0, 0.3, 0, 0, 0, 1, 0,
      ];

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with custom matrix should match expected value',
      ).toBe(
        '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0],"colorsOnly":true}',
      );
    });

    it('toJSON', () => {
      const filter = new ColorMatrix();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe(
        '{"type":"ColorMatrix","matrix":[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],"colorsOnly":true}',
      );

      filter.matrix = [
        0, 1, 0, 0, 0.2, 0, 0, 1, 0, 0.1, 1, 0, 0, 0, 0.3, 0, 0, 0, 1, 0,
      ];
      filter.colorsOnly = false;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with custom matrix should match expected value',
      ).toBe(
        '{"type":"ColorMatrix","matrix":[0,1,0,0,0.2,0,0,1,0,0.1,1,0,0,0,0.3,0,0,0,1,0],"colorsOnly":false}',
      );
    });

    it('fromObject', async () => {
      const filter = new ColorMatrix();
      const object = filter.toObject();

      const restoredFilter = await ColorMatrix.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });
  });

  describe('HueRotation', () => {
    it('constructor', () => {
      expect(HueRotation, 'HueRotation filter should exist').toBeTruthy();

      const filter = new HueRotation();

      expect(filter, 'should inherit from ColorMatrix').toBeInstanceOf(
        ColorMatrix,
      );
      expect(filter, 'should inherit from HueRotation').toBeInstanceOf(
        HueRotation,
      );
    });

    it('properties', () => {
      const filter = new HueRotation();

      expect(filter.type, 'type should be HueRotation').toBe('HueRotation');
      expect(filter.rotation, 'default rotation should be 0').toBe(0);

      const filter2 = new HueRotation({ rotation: 0.5 });

      expect(filter2.rotation, 'rotation should match constructor value').toBe(
        0.5,
      );
    });

    it('applyTo2d', () => {
      const filter = new HueRotation();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values', () => {
      const filter = new HueRotation({ rotation: 0.5 });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.calculateMatrix();
      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [88, 203, 59, 1, 0, 110, 228, 1, 26, 255, 171, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new HueRotation();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"HueRotation","rotation":0}');

      filter.rotation = 0.6;

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with rotation 0.6 should match expected value',
      ).toBe('{"type":"HueRotation","rotation":0.6}');
    });

    it('toJSON', () => {
      const filter = new HueRotation();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"HueRotation","rotation":0}');

      filter.rotation = 0.3;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with rotation 0.3 should match expected value',
      ).toBe('{"type":"HueRotation","rotation":0.3}');
    });

    it('fromObject', async () => {
      const filter = new HueRotation();
      const object = filter.toObject();

      const restoredFilter = await HueRotation.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new HueRotation();

      expect(
        filter.isNeutralState(),
        'should be neutral when rotation is 0',
      ).toBeTruthy();

      filter.rotation = 0.6;

      expect(
        filter.isNeutralState(),
        'should not be neutral when rotation changes',
      ).toBeFalsy();
    });
  });

  describe('Contrast', () => {
    it('constructor', () => {
      expect(Contrast, 'Contrast filter should exist').toBeTruthy();

      const filter = new Contrast();

      expect(filter, 'should inherit from Contrast').toBeInstanceOf(Contrast);
    });

    it('properties', () => {
      const filter = new Contrast();

      expect(filter.type, 'type should be Contrast').toBe('Contrast');
      expect(filter.contrast, 'default contrast should be 0').toBe(0);

      const filter2 = new Contrast({ contrast: 0.12 });

      expect(filter2.contrast, 'contrast should match constructor value').toBe(
        0.12,
      );
    });

    it('applyTo2d', () => {
      const filter = new Contrast();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values', () => {
      const filter = new Contrast({ contrast: 0.2 });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [236, 86, 11, 1, 0, 255, 0, 1, 255, 255, 0, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Contrast();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Contrast","contrast":0}');

      filter.contrast = 100;

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with contrast 100 should match expected value',
      ).toBe('{"type":"Contrast","contrast":100}');
    });

    it('toJSON', () => {
      const filter = new Contrast();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Contrast","contrast":0}');

      filter.contrast = 100;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with contrast 100 should match expected value',
      ).toBe('{"type":"Contrast","contrast":100}');
    });

    it('fromObject', async () => {
      const filter = new Contrast();
      const object = filter.toObject();

      const restoredFilter = await Contrast.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Contrast();

      expect(
        filter.isNeutralState(),
        'should be neutral when contrast is 0',
      ).toBeTruthy();

      filter.contrast = 0.6;

      expect(
        filter.isNeutralState(),
        'should not be neutral when contrast changes',
      ).toBeFalsy();
    });
  });

  describe('Saturation', () => {
    it('constructor', () => {
      expect(Saturation, 'Saturation filter should exist').toBeTruthy();

      const filter = new Saturation();

      expect(filter, 'should inherit from Saturation').toBeInstanceOf(
        Saturation,
      );
    });

    it('properties', () => {
      const filter = new Saturation();

      expect(filter.type, 'type should be Saturation').toBe('Saturation');
      expect(filter.saturation, 'default saturation should be 0').toBe(0);

      const filter2 = new Saturation({ saturation: 0.12 });

      expect(
        filter2.saturation,
        'saturation should match constructor value',
      ).toBe(0.12);
    });

    it('applyTo2d', () => {
      const filter = new Saturation();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values Saturation', () => {
      const filter = new Saturation({ saturation: 0.2 });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [200, 80, 20, 1, 0, 255, 0, 1, 255, 255, 0, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Saturation();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Saturation","saturation":0}');

      filter.saturation = 100;

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with saturation 100 should match expected value',
      ).toBe('{"type":"Saturation","saturation":100}');
    });

    it('toJSON', () => {
      const filter = new Saturation();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Saturation","saturation":0}');

      filter.saturation = 100;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with saturation 100 should match expected value',
      ).toBe('{"type":"Saturation","saturation":100}');
    });

    it('fromObject', async () => {
      const filter = new Saturation();
      const object = filter.toObject();

      const restoredFilter = await Saturation.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Saturation();

      expect(
        filter.isNeutralState(),
        'should be neutral when saturation is 0',
      ).toBeTruthy();

      filter.saturation = 0.6;

      expect(
        filter.isNeutralState(),
        'should not be neutral when saturation changes',
      ).toBeFalsy();
    });
  });

  describe('Gamma', () => {
    it('constructor', () => {
      expect(Gamma, 'Gamma filter should exist').toBeTruthy();

      const filter = new Gamma();

      expect(filter, 'should inherit from Gamma').toBeInstanceOf(Gamma);
    });

    it('properties', () => {
      const filter = new Gamma();

      expect(filter.type, 'type should be Gamma').toBe('Gamma');
      expect(
        filter.gamma,
        'default gamma should match expected values',
      ).toEqual([1, 1, 1]);

      const filter2 = new Gamma({ gamma: [0.1, 0.5, 1.3] });

      expect(filter2.gamma, 'gamma should match constructor value').toEqual([
        0.1, 0.5, 1.3,
      ]);
    });

    it('applyTo2d', () => {
      const filter = new Gamma();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values', () => {
      const filter = new Gamma({ gamma: [0.1, 0.5, 1.3] });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [22, 39, 72, 1, 0, 255, 21, 1, 255, 255, 8, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Gamma();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Gamma","gamma":[1,1,1]}');

      filter.gamma = [0.1, 0.5, 1.3];

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with custom gamma should match expected value',
      ).toBe('{"type":"Gamma","gamma":[0.1,0.5,1.3]}');
    });

    it('toJSON', () => {
      const filter = new Gamma();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Gamma","gamma":[1,1,1]}');

      filter.gamma = [1.5, 1.5, 1.5];

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with gamma [1.5, 1.5, 1.5] should match expected value',
      ).toBe('{"type":"Gamma","gamma":[1.5,1.5,1.5]}');
    });

    it('fromObject', async () => {
      const filter = new Gamma();
      const object = filter.toObject();

      const restoredFilter = await Gamma.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Gamma();

      expect(
        filter.isNeutralState(),
        'should be neutral when gamma is [1,1,1]',
      ).toBeTruthy();

      filter.gamma = [1.5, 1.5, 1.5];

      expect(
        filter.isNeutralState(),
        'should not be neutral when gamma changes',
      ).toBeFalsy();
    });
  });

  describe('Convolute', () => {
    it('constructor', () => {
      expect(Convolute, 'Convolute filter should exist').toBeTruthy();

      const filter = new Convolute();

      expect(filter, 'should inherit from Convolute').toBeInstanceOf(Convolute);
    });

    it('properties', () => {
      const filter = new Convolute();

      expect(filter.type, 'type should be Convolute').toBe('Convolute');
      expect(filter.opaque, 'default opaque should be false').toBe(false);
      expect(
        filter.matrix,
        'default matrix should match expected values',
      ).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0]);

      const filter2 = new Convolute({
        // @ts-expect-error -- TODO -- check this why 1 is passed instead of boolean
        opaque: 0.5,
        matrix: [1, -1, 1, 0, 1, 0, 0, 0, 0],
      });

      expect(filter2.opaque, 'opaque should match constructor value').toBe(0.5);
      expect(filter2.matrix, 'matrix should match constructor value').toEqual([
        1, -1, 1, 0, 1, 0, 0, 0, 0,
      ]);
    });

    it('applyTo2d', () => {
      const filter = new Convolute();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new Convolute({ opaque: true });

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Convolute","opaque":true,"matrix":[0,0,0,0,1,0,0,0,0]}');
    });

    it('toJSON', () => {
      const filter = new Convolute({ opaque: true });

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Convolute","opaque":true,"matrix":[0,0,0,0,1,0,0,0,0]}');
    });

    it('fromObject', async () => {
      const filter = new Convolute();
      const object = filter.toObject();

      const restoredFilter = await Convolute.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Convolute();

      expect(filter.isNeutralState(), 'should never be neutral').toBeFalsy();
    });
  });

  describe('Grayscale', () => {
    it('constructor', () => {
      expect(Grayscale, 'Grayscale filter should exist').toBeTruthy();

      const filter = new Grayscale();

      expect(filter, 'should inherit from Grayscale').toBeInstanceOf(Grayscale);
    });

    it('properties', () => {
      const filter = new Grayscale();

      expect(filter.type, 'type should be Grayscale').toBe('Grayscale');
    });

    it('applyTo2d', () => {
      const filter = new Grayscale();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values Grayscale average', () => {
      const filter = new Grayscale({ mode: 'average' });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [117, 117, 117, 1, 98, 98, 98, 1, 171, 171, 171, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('applyTo2d values Grayscale lightness', () => {
      const filter = new Grayscale({ mode: 'lightness' });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [125, 125, 125, 1, 132, 132, 132, 1, 129, 129, 129, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('applyTo2d values Grayscale luminosity', () => {
      const filter = new Grayscale({ mode: 'luminosity' });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [118, 118, 118, 1, 191, 191, 191, 1, 237, 237, 237, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Grayscale({ mode: 'lightness' });

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Grayscale","mode":"lightness"}');
    });

    it('toJSON', () => {
      const filter = new Grayscale();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Grayscale","mode":"average"}');
    });

    it('fromObject', async () => {
      const filter = new Grayscale();
      const object = filter.toObject();

      const restoredFilter = await Grayscale.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Grayscale();

      expect(filter.isNeutralState(), 'should never be neutral').toBeFalsy();
    });
  });

  describe('Invert', () => {
    it('constructor', () => {
      expect(Invert, 'Invert filter should exist').toBeTruthy();

      const filter = new Invert();

      expect(filter, 'should inherit from Invert').toBeInstanceOf(Invert);
    });

    it('properties', () => {
      const filter = new Invert();

      expect(filter.type, 'type should be Invert').toBe('Invert');
    });

    it('applyTo2d', () => {
      const filter = new Invert();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values Invert', () => {
      const filter = new Invert();
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [55, 155, 205, 1, 225, 0, 245, 1, 0, 0, 252, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Invert();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Invert","alpha":false,"invert":true}');
    });

    it('toJSON', () => {
      const filter = new Invert({ alpha: true });

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Invert","alpha":true,"invert":true}');
    });

    it('fromObject', async () => {
      const filter = new Invert();
      const object = filter.toObject();

      const restoredFilter = await Invert.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Invert();

      expect(
        filter.isNeutralState(),
        'should not be neutral when default',
      ).toBeFalsy();

      filter.invert = false;

      expect(
        filter.isNeutralState(),
        'should be neutral when invert is false',
      ).toBeTruthy();
    });
  });

  describe('Noise', () => {
    it('constructor', () => {
      expect(Noise, 'Noise filter should exist').toBeTruthy();

      const filter = new Noise();

      expect(filter, 'should inherit from Noise').toBeInstanceOf(Noise);
    });

    it('properties', () => {
      const filter = new Noise();

      expect(filter.type, 'type should be Noise').toBe('Noise');
      expect(filter.noise, 'default noise should be 0').toBe(0);

      const filter2 = new Noise({ noise: 200 });

      expect(filter2.noise, 'noise should match constructor value').toBe(200);
    });

    it('applyTo2d', () => {
      const filter = new Noise();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new Noise();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Noise","noise":0}');

      filter.noise = 100;

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with noise 100 should match expected value',
      ).toBe('{"type":"Noise","noise":100}');
    });

    it('toJSON', () => {
      const filter = new Noise();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      let json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Noise","noise":0}');

      filter.noise = 100;

      json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation with noise 100 should match expected value',
      ).toBe('{"type":"Noise","noise":100}');
    });

    it('fromObject', async () => {
      const filter = new Noise();
      const object = filter.toObject();

      const restoredFilter = await Noise.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Noise();

      expect(
        filter.isNeutralState(),
        'should be neutral when noise is 0',
      ).toBeTruthy();

      filter.noise = 1;

      expect(
        filter.isNeutralState(),
        'should not be neutral when noise changes',
      ).toBeFalsy();
    });
  });

  describe('Pixelate', () => {
    it('constructor', () => {
      expect(Pixelate, 'Pixelate filter should exist').toBeTruthy();

      const filter = new Pixelate();

      expect(filter, 'should inherit from Pixelate').toBeInstanceOf(Pixelate);
    });

    it('properties', () => {
      const filter = new Pixelate();

      expect(filter.type, 'type should be Pixelate').toBe('Pixelate');
      expect(filter.blocksize, 'default blocksize should be 4').toBe(4);

      const filter2 = new Pixelate({ blocksize: 8 });

      expect(
        filter2.blocksize,
        'blocksize should match constructor value',
      ).toBe(8);
    });

    it('applyTo2d', () => {
      const filter = new Pixelate();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d values Pixelate', () => {
      const filter = new Pixelate({ blocksize: 2 });
      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [200, 100, 50, 1, 200, 100, 50, 1, 255, 255, 3, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new Pixelate();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Pixelate","blocksize":4}');
    });

    it('toJSON', () => {
      const filter = new Pixelate();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Pixelate","blocksize":4}');
    });

    it('fromObject', async () => {
      const filter = new Pixelate();
      const object = filter.toObject();

      const restoredFilter = await Pixelate.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Pixelate();

      filter.blocksize = 1;

      expect(
        filter.isNeutralState(),
        'should be neutral when blockSize is 1',
      ).toBeTruthy();

      filter.blocksize = 4;

      expect(
        filter.isNeutralState(),
        'should not be neutral when blockSize changes',
      ).toBeFalsy();
    });
  });

  describe('RemoveColor', () => {
    it('constructor', () => {
      expect(RemoveColor, 'RemoveColor filter should exist').toBeTruthy();

      const filter = new RemoveColor();

      expect(filter, 'should inherit from RemoveColor').toBeInstanceOf(
        RemoveColor,
      );
    });

    it('properties', () => {
      const filter = new RemoveColor();

      expect(filter.type, 'type should be RemoveColor').toBe('RemoveColor');
      expect(filter.distance, 'default distance should be 0.02').toBe(0.02);
      expect(filter.color, 'default color should be #FFFFFF').toBe('#FFFFFF');

      const filter2 = new RemoveColor({
        distance: 0.6,
        color: '#FF0000',
      });

      expect(filter2.distance, 'distance should match constructor value').toBe(
        0.6,
      );
      expect(filter2.color, 'color should match constructor value').toBe(
        '#FF0000',
      );
    });

    it('applyTo2d', () => {
      const filter = new RemoveColor();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('applyTo2d with color', () => {
      const filter = new RemoveColor({ color: '#C86432' });

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );

      const options = {
        imageData: _createImageData(context),
      } as T2DPipelineState;

      filter.applyTo2d(options);

      const data = options.imageData.data;
      const expected = [200, 100, 50, 0, 30, 255, 10, 1, 255, 255, 3, 1];

      for (let i = 0; i < 12; i++) {
        expect(data[i], `data[${i}] should match expected value`).toBe(
          expected[i],
        );
      }
    });

    it('toObject', () => {
      const filter = new RemoveColor();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe(
        '{"type":"RemoveColor","color":"#FFFFFF","distance":0.02,"useAlpha":false}',
      );
    });

    it('toJSON', () => {
      const filter = new RemoveColor({
        color: 'blue',
        useAlpha: true,
      });

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe(
        '{"type":"RemoveColor","color":"blue","distance":0.02,"useAlpha":true}',
      );
    });

    it('fromObject', async () => {
      const filter = new RemoveColor();
      const object = filter.toObject();

      const restoredFilter = await RemoveColor.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new RemoveColor();

      expect(filter.isNeutralState(), 'should never be neutral').toBeFalsy();
    });
  });

  describe('Sepia', () => {
    it('constructor', () => {
      expect(Sepia, 'Sepia filter should exist').toBeTruthy();

      const filter = new Sepia();

      expect(filter, 'should inherit from Sepia').toBeInstanceOf(Sepia);
      expect(filter, 'should inherit from ColorMatrix').toBeInstanceOf(
        ColorMatrix,
      );
    });

    it('properties', () => {
      const filter = new Sepia();

      expect(filter.type, 'type should be Sepia').toBe('Sepia');
    });

    it('applyTo2d', () => {
      const filter = new Sepia();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new Sepia();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Sepia","colorsOnly":false}');
    });

    it('toJSON', () => {
      const filter = new Sepia();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Sepia","colorsOnly":false}');
    });

    it('fromObject', async () => {
      const filter = new Sepia();
      const object = filter.toObject();

      const restoredFilter = await Sepia.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Sepia();

      expect(filter.isNeutralState(), 'should never be neutral').toBeFalsy();
    });
  });

  describe('Resize', () => {
    it('constructor', () => {
      expect(Resize, 'Resize filter should exist').toBeTruthy();

      const filter = new Resize();

      expect(filter, 'should inherit from Resize').toBeInstanceOf(Resize);
    });

    it('properties', () => {
      const filter = new Resize();

      expect(filter.type, 'type should be Resize').toBe('Resize');
      expect(filter.resizeType, 'default resizeType should be hermite').toBe(
        'hermite',
      );
      expect(filter.lanczosLobes, 'default lanczosLobes should be 3').toBe(3);
      expect(filter.scaleX, 'default scaleX should be 1').toBe(1);
      expect(filter.scaleY, 'default scaleY should be 1').toBe(1);

      const filter2 = new Resize({
        resizeType: 'bilinear',
        scaleX: 0.3,
        scaleY: 0.3,
      });

      expect(
        filter2.resizeType,
        'resizeType should match constructor value',
      ).toBe('bilinear');
      expect(filter2.scaleX, 'scaleX should match constructor value').toBe(0.3);
      expect(filter2.scaleY, 'scaleY should match constructor value').toBe(0.3);
    });

    it('applyTo2d', () => {
      const filter = new Resize();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new Resize();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      let object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe(
        '{"type":"Resize","resizeType":"hermite","scaleX":1,"scaleY":1,"lanczosLobes":3}',
      );

      filter.resizeType = 'bilinear';

      object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object with resizeType bilinear should match expected value',
      ).toBe(
        '{"type":"Resize","resizeType":"bilinear","scaleX":1,"scaleY":1,"lanczosLobes":3}',
      );
    });

    it('fromObject', async () => {
      const filter = new Resize();
      const object = filter.toObject();

      const restoredFilter = await Resize.fromObject(object);

      expect(restoredFilter, 'should inherit from Resize').toBeInstanceOf(
        Resize,
      );
      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );

      filter.resizeType = 'bilinear';
      filter.scaleX = 0.8;
      filter.scaleY = 0.8;

      const object2 = filter.toObject();
      const restoredFilter2 = await Resize.fromObject(object2);

      expect(
        restoredFilter2,
        'restored filter with custom values should match original',
      ).toEqual(filter);
    });

    it('isNeutralState', () => {
      const filter = new Resize();

      expect(
        filter.isNeutralState(),
        'should be neutral when scale is 1',
      ).toBeTruthy();

      filter.scaleX = 1.4;

      expect(
        filter.isNeutralState(),
        'should not be neutral when scale changes',
      ).toBeFalsy();
    });
  });

  describe('Blur', () => {
    it('isNeutralState', () => {
      const filter = new Blur();

      expect(
        filter.isNeutralState(),
        'should be neutral when blur is 0',
      ).toBeTruthy();

      filter.blur = 0.3;

      expect(
        filter.isNeutralState(),
        'should not be neutral when blur changes',
      ).toBeFalsy();
    });
  });

  describe('Vibrance', () => {
    it('constructor', () => {
      expect(Vibrance, 'Vibrance filter should exist').toBeTruthy();

      const filter = new Vibrance({
        vibrance: 0.6,
      });

      expect(filter, 'should inherit from Vibrance').toBeInstanceOf(Vibrance);
      expect(filter.vibrance, 'parameters should be initialized').toBe(0.6);
      expect(filter.type, 'type should be Vibrance').toBe('Vibrance');
    });

    it('applyTo2d', () => {
      const filter = new Vibrance();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new Vibrance();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();

      expect(
        JSON.stringify(object),
        'serialized object should match expected value',
      ).toBe('{"type":"Vibrance","vibrance":0}');
    });

    it('toJSON', () => {
      const filter = new Vibrance();

      expect(filter.toJSON, 'should have toJSON method').toBeTypeOf('function');

      const json = filter.toJSON();

      expect(
        JSON.stringify(json),
        'JSON representation should match expected value',
      ).toBe('{"type":"Vibrance","vibrance":0}');
    });

    it('fromObject', async () => {
      const filter = new Vibrance({ vibrance: 0.3 });
      const object = filter.toObject();

      const restoredFilter = await Vibrance.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new Vibrance();

      filter.vibrance = 0;

      expect(
        filter.isNeutralState(),
        '0 vibrance should be neutral',
      ).toBeTruthy();

      filter.vibrance = 0.5;

      expect(
        filter.isNeutralState(),
        '0.5 vibrance should not be neutral',
      ).toBeFalsy();
    });
  });

  describe('BlendColor', () => {
    it('constructor', () => {
      expect(BlendColor, 'BlendColor filter should exist').toBeTruthy();

      const filter = new BlendColor({
        color: 'red',
      });

      expect(filter, 'should inherit from BlendColor').toBeInstanceOf(
        BlendColor,
      );
      expect(filter.color, 'parameters should be initialized').toBe('red');
      expect(filter.type, 'type should be BlendColor').toBe('BlendColor');
    });

    it('applyTo2d', () => {
      const filter = new BlendColor();

      expect(filter.applyTo2d, 'should have applyTo2d method').toBeTypeOf(
        'function',
      );
    });

    it('toObject', () => {
      const filter = new BlendColor();

      expect(filter.toObject, 'should have toObject method').toBeTypeOf(
        'function',
      );

      const object = filter.toObject();
      const expected = {
        type: 'BlendColor',
        color: '#F95C63',
        alpha: 1,
        mode: 'multiply',
      };

      expect(object, 'serialized object should match expected value').toEqual(
        expected,
      );

      const json = filter.toJSON();

      expect(json, 'JSON representation should match expected value').toEqual(
        expected,
      );
    });

    it('fromObject', async () => {
      const filter = new BlendColor({ color: 'blue', alpha: 0.5 });
      const object = filter.toObject();

      const restoredFilter = await BlendColor.fromObject(object);

      expect(restoredFilter, 'restored filter should match original').toEqual(
        filter,
      );
    });

    it('isNeutralState', () => {
      const filter = new BlendColor();

      expect(filter.isNeutralState(), 'should never be neutral').toBeFalsy();
    });
  });
});
