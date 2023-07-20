export {};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toMatchDataSnapshot: (options?: { name?: string }) => R;
      toMatchImageSnapshot: (options?: {
        maxDiffPixelRatio?: number;
        maxDiffPixels?: number;
        name?: string | string[];
        threshold?: number;
      }) => R;
    }
  }
}
