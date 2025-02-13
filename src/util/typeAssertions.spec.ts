import {
  isTextObject,
  isSerializableFiller,
  isPattern,
  isPath,
  isFiller,
  isActiveSelection,
} from './typeAssertions';
import { FabricText } from '../shapes/Text/Text';
import { IText } from '../shapes/IText/IText';
import { Textbox } from '../shapes/Textbox';
import { Path } from '../shapes/Path';
import { Pattern } from '../Pattern/Pattern';
import { Gradient } from '../gradient/Gradient';
import { Shadow } from '../Shadow';
import { ActiveSelection } from '../shapes/ActiveSelection';
import { Canvas } from '../canvas/Canvas';
import { Group } from '../shapes/Group';

import { describe, expect, test } from 'vitest';

describe('typeAssertions', () => {
  describe('isTextObject', () => {
    test('can detect FabricText', () => {
      const text = new FabricText('hello');
      expect(isTextObject(text)).toBe(true);
    });
    test('can detect IText', () => {
      const text = new IText('hello');
      expect(isTextObject(text)).toBe(true);
    });
    test('can detect Textbox', () => {
      const text = new Textbox('hello');
      expect(isTextObject(text)).toBe(true);
    });
    test('can detect other subclasses', () => {
      class NewText extends Textbox {
        status = 'new';
        static type = 'NewText';
      }
      const newText = new NewText('hello world');
      expect(isTextObject(newText)).toBe(true);
    });
    test('can safeguard agains other FabricObjects', () => {
      const path = new Path('M 0 0 L 1 1');
      expect(isTextObject(path)).toBe(false);
    });
  });
  describe('isPath', () => {
    test('can detect Path', () => {
      const path = new Path('M 0 0 L 1 1');
      expect(isPath(path)).toBe(true);
    });
    test('can detect other subclasses', () => {
      class NewPath extends Path {
        status = 'new';
        static type = 'NewPath';
      }
      const newPath = new NewPath('M 0 0 L 1 1');
      expect(isPath(newPath)).toBe(true);
    });
    test('can guard against other FabricObjects', () => {
      const text = new Textbox('hello');
      expect(isPath(text)).toBe(false);
    });
  });
  describe('isPattern', () => {
    test('can detect Pattern', () => {
      const pattern = new Pattern({
        source: new Image(100, 100),
      });
      expect(isPattern(pattern)).toBe(true);
    });
    test('can guard against Gradient', () => {
      const gradient = new Gradient({ type: 'linear' });
      expect(isPattern(gradient)).toBe(false);
    });
    test('can guard against Shadow', () => {
      const shadow = new Shadow({ offsetX: 10 });
      expect(isPattern(shadow as unknown as Pattern)).toBe(false);
    });
  });
  describe('isFiller', () => {
    test('can detect Pattern', () => {
      const pattern = new Pattern({
        source: new Image(100, 100),
      });
      expect(isFiller(pattern)).toBe(true);
    });
    test('can detect Gradient', () => {
      const gradient = new Gradient({ type: 'linear' });
      expect(isFiller(gradient)).toBe(true);
    });
    test('can guard against string', () => {
      const filler = 'red';
      expect(isFiller(filler)).toBe(false);
    });
    test('can guard against null', () => {
      const filler = null;
      expect(isFiller(filler)).toBe(false);
    });
  });
  describe('isSerializableFiller', () => {
    test('can detect Pattern', () => {
      const pattern = new Pattern({
        source: new Image(100, 100),
      });
      expect(isSerializableFiller(pattern)).toBe(true);
    });
    test('can detect Gradient', () => {
      const gradient = new Gradient({ type: 'linear' });
      expect(isSerializableFiller(gradient)).toBe(true);
    });
  });
  describe('isActiveSelection', () => {
    test('can detect activeSelection', () => {
      const as = new ActiveSelection([], {
        canvas: new Canvas(),
      });
      expect(isActiveSelection(as)).toBe(true);
    });
    test('can safeguard against a group', () => {
      const group = new Group([]);
      expect(isActiveSelection(group)).toBe(false);
    });
  });
});
