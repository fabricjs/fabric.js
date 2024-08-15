import type { TextStyle } from '../../shapes/Text/StyledText';

export const cloneStyles = (style: TextStyle): TextStyle =>
  Object.fromEntries(
    Object.entries(style).map(([key, value]) => [
      key,
      Object.fromEntries(
        Object.entries(value).map(([keyInner, valueInner]) => [
          keyInner,
          { ...valueInner },
        ]),
      ),
    ]),
  );
