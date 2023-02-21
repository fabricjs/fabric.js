import type { Text } from '../../../shapes/Text/Text';
import {
  numberRestorer,
  unitTransformer,
  isDefinedValueTransformer,
  isTruthyValueTransformer,
} from './util';
import { CSSTransformConfigMap, CSSTransformConfig } from './types';
import { CSSTransformationMap } from './CSSTransformationMap';

const dblQuoteRegex = /"/g;

export const CSSTextTransformationMap: CSSTransformConfigMap<
  Text,
  'fontFamily' | 'fontSize' | 'fontStyle' | 'fontWeight' | 'direction'
> & {
  textDecoration: CSSTransformConfig<Text, string>;
} & typeof CSSTransformationMap = {
  ...CSSTransformationMap,
  fontFamily: {
    key: 'font-family',
    transformValue: (value) => value.replace(dblQuoteRegex, "'"),
  },
  fontSize: {
    key: 'font-size',
    transformValue: (value) => unitTransformer(value),
    restoreValue: numberRestorer,
  },
  fontStyle: {
    key: 'font-style',
    transformValue: isDefinedValueTransformer,
  },
  fontWeight: {
    key: 'font-weight',
    transformValue: isDefinedValueTransformer,
  },
  direction: {
    transformValue: isDefinedValueTransformer,
  },
  textDecoration: {
    key: 'text-decoration',
    transformValue: (
      _,
      {
        overline,
        underline,
        linethrough,
      }: Pick<Text, 'overline' | 'underline' | 'linethrough'>
    ) =>
      [
        isTruthyValueTransformer(overline, 'overline'),
        isTruthyValueTransformer(underline, 'underline'),
        isTruthyValueTransformer(linethrough, 'line-through'),
      ]
        .filter((value) => value)
        .join(' '),
    restoreValue: (value) => {
      return value
        ? {
            overline: value.includes('overline'),
            underline: value.includes('underline'),
            linethrough: value.includes('line-through'),
          }
        : null;
    },
  },
};
