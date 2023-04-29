import { Pattern } from './Pattern/Pattern';

export type PatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';

type ExportedKeys =
  | 'crossOrigin'
  | 'offsetX'
  | 'offsetY'
  | 'patternTransform'
  | 'repeat'
  | 'source';

export type PatternProps = Partial<Pick<Pattern, ExportedKeys>>;

export type SerializedPatternProps = PatternProps & {
  source: string;
};
