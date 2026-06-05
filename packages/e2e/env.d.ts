import { FabricNamespace } from './tests/types';

declare global {
  var canvasMap: Map<HTMLCanvasElement, Canvas>;
  var objectMap: Map<string, FabricObject>;
  var renderingTestMap: Map<string, () => void | string>;

  function getFixtureName(filename: string): string;

  function getAssetName(filename: string): string;

  function getAsset(filename: string): Promise<string>;

  function getImage(
    fabric: FabricNamespace,
    filename: string,
  ): Promise<HTMLImageElement>;

  interface Window {
    fabric: FabricNamespace;
    fabricExtensions: typeof import('fabric/extensions');

    canvasMap: Map<HTMLCanvasElement, Canvas>;
    objectMap: Map<string, FabricObject>;
    renderingTestMap: Map<string, () => void | string>;

    __setupFabricHook: () => Promise<void[]>;

    __teardownFabricHook(): void;
  }
}

export {};
