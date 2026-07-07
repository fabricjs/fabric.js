import type { Pattern } from './Pattern';

export type PatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

type ExportedKeys =
  | 'crossOrigin'
  | 'offsetX'
  | 'offsetY'
  | 'patternTransform'
  | 'repeat'
  | 'source';

export type PatternOptions = Partial<Pick<Pattern, ExportedKeys>> & {
  source: CanvasImageSource;
};

export type SerializedPatternOptions = Omit<PatternOptions, 'source'> & {
  type: 'pattern';
  source: string;
};
