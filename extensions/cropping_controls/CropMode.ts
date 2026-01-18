import type { FabricImage, Control } from 'fabric';
import { createImageCroppingControls } from './croppingControls';
import { cropPanMoveHandler, renderGhostImage } from './croppingHandlers';

export type CropModeConfig = {
  controls: () => Record<string, Control>;
  showGhost: boolean;
  enablePan: boolean;
  onEnter: () => void;
  onExit: () => void;
};

/**
 * Fluent API for entering and exiting crop mode on a FabricImage.
 *
 * Basic usage (works out of the box):
 *   const mode = CropMode.for(image).enter();
 *   // later: mode.exit();
 *
 * With configuration:
 *   CropMode.for(image)
 *     .controls(myCustomControls)
 *     .withGhost(false)
 *     .withPan(false)
 *     .onEnter(() => console.log('entered'))
 *     .onExit(() => console.log('exited'))
 *     .enter();
 */
export class CropMode {
  private image: FabricImage;
  private originalControls: Record<string, Control> | null = null;
  private originalPadding: number = 0;
  private active = false;

  private config: CropModeConfig = {
    controls: createImageCroppingControls,
    showGhost: true,
    enablePan: true,
    onEnter: () => {},
    onExit: () => {},
  };

  private constructor(image: FabricImage) {
    this.image = image;
  }

  static for(image: FabricImage): CropMode {
    return new CropMode(image);
  }

  controls(fn: () => Record<string, Control>): this {
    this.config.controls = fn;
    return this;
  }

  withGhost(enabled: boolean): this {
    this.config.showGhost = enabled;
    return this;
  }

  withPan(enabled: boolean): this {
    this.config.enablePan = enabled;
    return this;
  }

  onEnter(fn: () => void): this {
    this.config.onEnter = fn;
    return this;
  }

  onExit(fn: () => void): this {
    this.config.onExit = fn;
    return this;
  }

  enter(): this {
    if (this.active) return this;

    this.originalControls = this.image.controls;
    this.originalPadding = this.image.padding;

    this.image.padding = 0;
    this.image.controls = this.config.controls();

    if (this.config.enablePan) {
      this.image.on('moving', cropPanMoveHandler);
    }
    if (this.config.showGhost) {
      this.image.on('before:render', renderGhostImage);
    }

    this.image.setCoords();
    this.image.canvas?.requestRenderAll();

    this.active = true;
    this.config.onEnter();

    return this;
  }

  exit(): this {
    if (!this.active) return this;

    this.image.padding = this.originalPadding;
    this.image.controls = this.originalControls!;

    if (this.config.enablePan) {
      this.image.off('moving', cropPanMoveHandler);
    }
    if (this.config.showGhost) {
      this.image.off('before:render', renderGhostImage);
    }

    this.image.setCoords();
    this.image.canvas?.requestRenderAll();

    this.active = false;
    this.config.onExit();

    return this;
  }

  isActive(): boolean {
    return this.active;
  }

  toggle(): this {
    return this.active ? this.exit() : this.enter();
  }
}
