import { Pattern } from './Pattern';

export type TPatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
type TExportedKeys =
  | 'crossOrigin'
  | 'offsetX'
  | 'offsetY'
  | 'patternTransform'
  | 'repeat'
  | 'source';

export type PatternProps = Partial<Pick<Pattern, TExportedKeys>>;

export type SerializedPatternProps = PatternProps & {
  source: string;
};

export type TPatternHydrationOptions = {
  /**
   * handle aborting
   * @see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   */
  signal?: AbortSignal;
};
