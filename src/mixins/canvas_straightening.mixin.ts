// @ts-nocheck
import { fabric } from '../../HEADER';
import type { FabricObject } from '../shapes/Object/FabricObject';

fabric.util.object.extend(
  fabric.StaticCanvas.prototype,
  /** @lends fabric.StaticCanvas.prototype */ {
    /**
     * Straightens object, then rerenders canvas
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Canvas} thisArg
     * @chainable
     */
    straightenObject: function (object: FabricObject) {
      object.straighten();
      this.requestRenderAll();
      return this;
    },

    /**
     * Same as {@link fabric.Canvas.prototype.straightenObject}, but animated
     * @param {fabric.Object} object Object to straighten
     * @return {fabric.Canvas} thisArg
     */
    fxStraightenObject: function (object: FabricObject) {
      return object.fxStraighten({
        onChange: this.requestRenderAllBound,
      });
    },
  }
);
