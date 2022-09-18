import { iMatrix } from './constants';
import { multiplyTransformMatrices } from './util/misc/matrix';
import { Canvas, TObject } from './__types__';

export type TRenderingListing = {
  target: TObject;
  /**
   * object/canvas being clipped by the target
   */
  clipping?: TObject | Canvas;
  /**
   * target is being cached
   */
  caching?: boolean;
};

export type TRenderingContext = {
  /**
   * object/canvas being clipped by the rendering process
   */
  clipping?: {
    source: TObject;
    destination: TObject | Canvas;
  };
  /**
   * object being cached by the rendering process
   */
  caching?: TObject;
  tree: TRenderingListing[];
  /**
   * By default fabric checks if an object is included in the viewport before rendering.
   * This flag overrides the check and forces rendering to occur.
   */
  force?: boolean;
};

type TRenderingAction =
  | 'requested'
  | 'canvas-export'
  | 'object-export'
  | 'hit-test';

type TRenderingOptions = {
  /**
   * setting this flag to `false` disables offscreen validation, all objects will be rendered.
   */
  offscreenValidation?: boolean;

  action?: TRenderingAction;
};

export class RenderingContext implements TRenderingOptions {
  offscreenValidation = true;
  action?: TRenderingAction;

  tree: TRenderingListing[] = [];

  static init(listing?: TRenderingListing, options?: TRenderingOptions) {
    const context = new RenderingContext(options);
    listing && context.push(listing);
    return context;
  }

  constructor({ action, offscreenValidation = true }: TRenderingOptions = {}) {
    this.action = action;
    this.offscreenValidation = offscreenValidation;
  }

  push(listing: TRenderingListing) {
    this.tree.push(Object.freeze({ ...listing }));
  }

  update(target: TObject, listing: Omit<TRenderingListing, 'target'>) {
    const index = this.findIndex(target);
    index > -1 &&
      this.tree.splice(
        index,
        1,
        Object.freeze({
          ...this.tree[index],
          ...listing,
          target,
        })
      );
  }

  validateAtBottomOfTree(target: TObject) {
    const index = this.findIndex(target);
    if (index === -1) {
      this.push({ target });
    } else if (index !== this.tree.length - 1) {
      throw new Error('fabric: rendering tree has been violated');
    }
    return this.tree[this.tree.length - 1];
  }

  findIndex(target: TObject) {
    for (let index = this.tree.length - 1; index >= 0; index--) {
      if (this.tree[index].target === target) {
        return index;
      }
    }
    return -1;
  }

  find(target: TObject): TRenderingListing | undefined {
    return this.tree[this.findIndex(target)];
  }

  shouldPerformOffscreenValidation(target: TObject) {
    const found = this.find(target);
    return (
      this.offscreenValidation &&
      !found?.clipping &&
      !found?.caching &&
      this.action !== 'hit-test' &&
      this.action !== 'object-export'
    );
  }

  shouldFireRenderingEvent() {
    return this.action === 'requested' || !this.action;
  }

  isNested(target: TObject) {
    return !!target.group && this.findIndex(target) > 0;
  }

  isClipping(target: TObject) {
    return !!this.find(target)?.clipping;
  }

  isCaching(target: TObject) {
    return !!this.find(target)?.caching;
  }

  findCacheTarget(target: TObject) {
    for (let index = this.findIndex(target); index >= 0; index--) {
      const listing = this.tree[index];
      if (listing.caching) {
        return listing.target;
      }
    }
  }

  isOnCache(target: TObject) {
    return !!this.findCacheTarget(target);
  }

  calcTransformMatrix(target: TObject) {
    const index = this.findIndex(target);
    return index > -1
      ? this.tree
          .slice(0, index)
          .reverse()
          .reduce(
            (mat, { target }) =>
              multiplyTransformMatrices(target.calcOwnMatrix(), mat),
            iMatrix
          )
      : iMatrix;
  }

  fork(listing?: TRenderingListing) {
    const context = new RenderingContext({
      action: this.action,
      offscreenValidation: this.offscreenValidation,
    });
    context.tree = [...this.tree];
    listing && context.push(listing);
    return context;
  }
}
