import { cloneStyles } from './cloneStyles';
import type {
  TextStyle,
  CompleteTextStyleDeclaration,
} from '../../shapes/Text/StyledText';

import { describe, expect, it } from 'vitest';

describe('cloneStyles', () => {
  it('clones a styles object deeply', () => {
    const style: CompleteTextStyleDeclaration = {
      fill: 'blue',
      stroke: 'red',
      strokeWidth: 8,
      fontSize: 44,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      fontStyle: 'italic',
      textBackgroundColor: 'green',
      deltaY: -5,
      overline: true,
      underline: false,
      linethrough: true,
    };

    const testObject: TextStyle = {
      0: {
        0: style,
        6: style,
      },
      1: {
        0: style,
        3: style,
      },
      2: {
        0: style,
        3: style,
      },
    };
    const cloned = cloneStyles(testObject);
    expect(cloned).toEqual(testObject);
    expect(cloned).not.toBe(testObject);
    expect(cloned[0]).toEqual(testObject[0]);
    expect(cloned[0]).not.toBe(testObject[0]);
    expect(cloned[2][3]).toEqual(testObject[2][3]);
    expect(cloned[2][3]).not.toBe(testObject[2][3]);
  });
});
