//@ts-nocheck
export function CanvasObjectStraighteningMixinGenerator(Klass) {
    return class CanvasObjectStraighteningMixin extends Klass {

        /**
         * Straightens object, then rerenders canvas
         * @param {FabricObject} object Object to straighten
         * @return {fabric.Canvas} thisArg
         * @chainable
         */
        straightenObject(object) {
            object.straighten();
            this.requestRenderAll();
            return this;
        }

        /**
         * Same as {@link #straightenObject}, but animated
         * @param {FabricObject} object Object to straighten
         * @return {fabric.Canvas} thisArg
         */
        fxStraightenObject(object) {
            return object.fxStraighten({
                onChange: this.requestRenderAllBound
            });
        }
    };
}
