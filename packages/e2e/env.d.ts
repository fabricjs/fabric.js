import type { Canvas, FabricObject } from 'fabric';
import type { FabricNamespace, RenderCallback } from './tests/types';

declare global {
  var canvasMap: Map<HTMLCanvasElement, Canvas>;
  var objectMap: Map<string, FabricObject>;
  var renderingTestMap: Map<string, RenderCallback>;

  function getFixtureName(filename: string): string;

  function getAssetName(filename: string): string;

  function getAsset(filename: string): Promise<string>;

  function getImage(
    fabric: FabricNamespace,
    filename: string,
  ): Promise<HTMLImageElement>;

  interface Window {
    fabric: FabricNamespace;

    canvasMap: Map<HTMLCanvasElement, Canvas>;
    objectMap: Map<string, FabricObject>;
    renderingTestMap: Map<string, RenderCallback>;

    __setupFabricHook: () => Promise<void[]>;

    __teardownFabricHook(): Promise<void[]>;
  }
}

export {};
