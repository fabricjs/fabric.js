import type { FabricObject } from '../../../shapes/Object/FabricObject';
import type { TextStyleDeclaration } from '../../../shapes/Text/StyledText';
import type { Text } from '../../../shapes/Text/Text';
import { CSSTransformationMap } from './CSSTransformationMap';
import { CSSTextTransformationMap } from './CSSTextTransformationMap';

export function stylesToCSS<
  T extends Pick<FabricObject, keyof typeof CSSTransformationMap>
>(options: T, map = CSSTransformationMap) {
  let css = '';
  for (const key in map) {
    const {
      key: k = key,
      transformValue,
      transform,
    } = map[key as keyof typeof map];
    const v = options[key as keyof typeof map];
    if (transform) {
      css += `${transform(k, v, options)};`;
    } else {
      const value = transformValue ? transformValue(v, options) : v;
      (value || value === 0) && (css += `${k}:${value};`);
    }
  }
  return css;
}

export function textStylesToCSS(
  options: Pick<
    Text,
    Exclude<keyof typeof CSSTextTransformationMap, 'textDecoration'>
  >
) {
  return stylesToCSS(options, CSSTextTransformationMap);
}

export function stylesFromCSS(
  styles: CSSStyleDeclaration,
  map = CSSTransformationMap
) {
  const options: TextStyleDeclaration = {};
  for (const key in map) {
    const { key: k = key, restoreValue } = map[key as keyof typeof map];
    const v = styles[k as keyof CSSStyleDeclaration];
    const value = restoreValue ? restoreValue(v, options) : v;
    (value || value === 0) && (options[key] = value);
  }
  return options;
}

export function textStylesFromCSS(styles: CSSStyleDeclaration) {
  const { textDecoration, ...rest } = stylesFromCSS(
    styles,
    CSSTextTransformationMap
  );
  return { ...textDecoration, ...rest };
}
