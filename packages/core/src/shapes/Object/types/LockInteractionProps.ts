export interface LockInteractionProps {
  /**
   * When `true`, object horizontal movement is locked
   * @type Boolean
   */
  lockMovementX: boolean;

  /**
   * When `true`, object vertical movement is locked
   * @type Boolean
   */
  lockMovementY: boolean;

  /**
   * When `true`, object rotation is locked
   * @type Boolean
   */
  lockRotation: boolean;

  /**
   * When `true`, object horizontal scaling is locked
   * @type Boolean
   */
  lockScalingX: boolean;

  /**
   * When `true`, object vertical scaling is locked
   * @type Boolean
   */
  lockScalingY: boolean;

  /**
   * When `true`, object horizontal skewing is locked
   * @type Boolean
   */
  lockSkewingX: boolean;

  /**
   * When `true`, object vertical skewing is locked
   * @type Boolean
   */
  lockSkewingY: boolean;

  /**
   * When `true`, object cannot be flipped by scaling into negative values
   * @type Boolean
   */
  lockScalingFlip: boolean;
}
