import type { TDegree } from '../../../typedefs';
export interface ObjectTransformActionProps {
    /**
     * The angle that an object will lock to while rotating.
     * @type [TDegree]
     */
    snapAngle?: TDegree;
    /**
     * The angle difference from the current snapped angle in which snapping should occur.
     * When undefined, the snapThreshold will default to the snapAngle.
     * @type [TDegree]
     */
    snapThreshold?: TDegree;
    /**
     * When `true` the object will rotate on its center.
     * When `false` will rotate around the origin point defined by originX and originY.
     * The value of this property is IGNORED during a transform if the canvas has already
     * centeredRotation set to `true`
     * The object method `rotate` will always consider this property and never the canvas's one.
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredRotation: boolean;
    /**
     * When true, this object will use center point as the origin of transformation
     * when being scaled via the controls.
     * @since 1.3.4
     * @type Boolean
     * @default
     */
    centeredScaling: boolean;
}
//# sourceMappingURL=ObjectTransformProps.d.ts.map