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

  private slice(from?: TObject, to?: TObject, inclusive = false) {
    const start = from ? this.findIndex(from) : -1;
    const end = to ? this.findIndex(to) : -1;
    return this.tree
      .slice(
        start > -1 ? start : undefined,
        end > -1 ? end + Number(inclusive) : undefined
      )
      .reverse();
  }

  private getTreeUpTo(target?: TObject) {
    return this.slice(undefined, target, true);
  }

  private getAncestors(target?: TObject) {
    return this.slice(undefined, target, false);
  }

  shouldPerformOffscreenValidation(target: TObject) {
    return (
      this.offscreenValidation &&
      this.action !== 'hit-test' &&
      this.action !== 'object-export' &&
      !this.getTreeUpTo(target).some(
        ({ caching, clipping }) => !!caching || !!clipping
      )
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

  isOnClipPath(target: TObject) {
    return this.getAncestors(target).some(({ clipping }) => clipping);
  }

  isCaching(target: TObject) {
    return !!this.find(target)?.caching;
  }

  isOnCache(target: TObject) {
    return this.getAncestors(target).some(({ caching }) => caching);
  }

  /**
   *
   * @param target
   * @returns the transform from the viewer to `target`
   */
  calcTransformMatrix(target: TObject) {
    return this.getTreeUpTo(target)
      .reverse()
      .reduce(
        (mat, { target }) =>
          multiplyTransformMatrices(target.calcOwnMatrix(), mat),
        iMatrix
      );
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
