export type ScrollbarsProps = {
  /** Scrollbar fill color */
  fill?: string;
  /** Scrollbar stroke color */
  stroke?: string;
  /** Scrollbar line width */
  lineWidth?: number;
  /** Hide horizontal scrollbar */
  hideX?: boolean;
  /** Hide vertical scrollbar */
  hideY?: boolean;
  /** Scrollbar minimum width */
  scrollbarMinWidth?: number;
  /** Scrollbar size */
  scrollbarSize?: number;
  /** Scrollbar distance from the boundary */
  scrollSpace?: number;
  /** Scrollbar expansion size, the distance from which the user can effectively slide the scrollbar */
  padding?: number;
};

export type ScrollbarProps = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
export type ScrollbarXProps = Pick<ScrollbarProps, 'left' | 'right'>;

export type ScrollbarYProps = Pick<ScrollbarProps, 'top' | 'bottom'>;

export type MakeMouseWheelProps = {
  /** Minimum zoom size */
  min: number;
  /** Maximum zoom size */
  max: number;
  /** Touchpad Zoom Speed default to 0.99 */
  tSpeed: number;
  /** Mouse Wheel Zoom Speed default to 0.998 */
  mSpeed: number;
  /** Canvas panning speed defaults to 1 */
  pSpeed: number;
};
