import type { TextStyle } from '../../shapes/Text/StyledText';

export const cloneStyles = (style: TextStyle): TextStyle => {
  const newObj: TextStyle = {};
  Object.keys(style).forEach((key) => {
    newObj[key] = {};
    Object.keys(style[key]).forEach((keyInner) => {
      newObj[key][keyInner] = { ...style[key][keyInner] };
    });
  });
  return newObj;
};
