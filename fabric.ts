export { getEnv, getFabricDocument, getFabricWindow, setEnv } from './src/env';
export { cache } from './src/cache';
export { VERSION as version, iMatrix } from './src/constants';
export { config } from './src/config';
export { classRegistry } from './src/ClassRegistry';
export { runningAnimations } from './src/util/animation/AnimationRegistry';

export type * from './src/typedefs';

export type * from './src/EventTypeDefs';
export type { ITextEvents } from './src/shapes/IText/ITextBehavior';

export { Observable } from './src/Observable';

export type {
  TCanvasSizeOptions,
  TSVGExportOptions,
} from './src/canvas/StaticCanvas';
export type { StaticCanvasOptions } from './src/canvas/StaticCanvasOptions';
export { StaticCanvas } from './src/canvas/StaticCanvas';
export { Canvas } from './src/canvas/Canvas';
export type { CanvasOptions } from './src/canvas/CanvasOptions';
export { CanvasDOMManager } from './src/canvas/DOMManagers/CanvasDOMManager';
export { StaticCanvasDOMManager } from './src/canvas/DOMManagers/StaticCanvasDOMManager';

export type { XY } from './src/Point';
export { Point } from './src/Point';
export type { IntersectionType } from './src/Intersection';
export { Intersection } from './src/Intersection';
export { Color } from './src/color/Color';
export type * from './src/color/typedefs';

export * from './src/gradient';
export * from './src/Pattern';
export { Shadow } from './src/Shadow';
export type { SerializedShadowOptions } from './src/Shadow';

export { BaseBrush } from './src/brushes/BaseBrush';
export type * from './src/brushes/typedefs';

export { PencilBrush } from './src/brushes/PencilBrush';
export { CircleBrush } from './src/brushes/CircleBrush';
export { SprayBrush } from './src/brushes/SprayBrush';
export { PatternBrush } from './src/brushes/PatternBrush';

// many path types
export type * from './src/util/path/typedefs';

export {
  FabricObject,

  /**
   * @deprecated Due to a naming conflict with the
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object JS API},
   * `fabric.Object` has been renamed to `FabricObject`
   *
   * @example
   * import { Object } from 'fabric'; // deprecated
   * import { FabricObject } from 'fabric'; // migration path
   *
   */
  FabricObject as Object,
} from './src/shapes/Object/FabricObject';
/**
 * Exported so we can tweak default values
 */
export {
  FabricObject as BaseFabricObject,
  type DrawContext,
} from './src/shapes/Object/Object';
/**
 * Exported so we can tweak default values
 */
export { InteractiveFabricObject } from './src/shapes/Object/InteractiveObject';

export type {
  TFabricObjectProps,
  FabricObjectProps,
  SerializedObjectProps,
} from './src/shapes/Object/types';
export type { SerializedLineProps } from './src/shapes/Line';
export { Line } from './src/shapes/Line';
export type { CircleProps, SerializedCircleProps } from './src/shapes/Circle';
export { Circle } from './src/shapes/Circle';
export { Triangle } from './src/shapes/Triangle';
export type {
  EllipseProps,
  SerializedEllipseProps,
} from './src/shapes/Ellipse';
export { Ellipse } from './src/shapes/Ellipse';
export type { RectProps, SerializedRectProps } from './src/shapes/Rect';
export { Rect } from './src/shapes/Rect';
export type { PathProps, SerializedPathProps } from './src/shapes/Path';
export { Path } from './src/shapes/Path';
export type { SerializedPolylineProps } from './src/shapes/Polyline';
export { Polyline } from './src/shapes/Polyline';
export { Polygon } from './src/shapes/Polygon';
export type {
  GraphemeBBox,
  SerializedTextProps,
  TPathAlign,
  TPathSide,
  TextProps,
} from './src/shapes/Text/Text';
export {
  FabricText,
  /**
   * @deprecated Due to a naming conflict with the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Text/Text Web API},
   * `fabric.Text` has been renamed to `FabricText`
   *
   * @example
   * import { Text } from 'fabric'; // deprecated
   * import { FabricText } from 'fabric'; // migration path
   *
   */
  FabricText as Text,
} from './src/shapes/Text/Text';
export type {
  ITextProps,
  SerializedITextProps,
  CursorRenderingData,
  CursorBoundaries,
} from './src/shapes/IText/IText';
export { IText } from './src/shapes/IText/IText';
export type {
  GraphemeData,
  SerializedTextboxProps,
  TextboxProps,
} from './src/shapes/Textbox';
export { Textbox } from './src/shapes/Textbox';
export type {
  CompleteTextStyleDeclaration,
  TextStyleDeclaration,
  TextStyle,
} from './src/shapes/Text/StyledText';
export type {
  GroupEvents,
  GroupProps,
  GroupOwnProps,
  SerializedGroupProps,
} from './src/shapes/Group';
export { Group } from './src/shapes/Group';
export * from './src/LayoutManager';
export type { SerializedLayoutManager } from './src/LayoutManager';
export type {
  ActiveSelectionOptions,
  MultiSelectionStacking,
} from './src/shapes/ActiveSelection';
export { ActiveSelection } from './src/shapes/ActiveSelection';
export {
  FabricImage,

  /**
   * @deprecated Due to a naming conflict with the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image Web API},
   * `fabric.Image` has been renamed to `FabricImage`
   *
   * @example
   * import { Image } from 'fabric'; // deprecated
   * import { FabricImage } from 'fabric'; // migration path
   *
   */
  FabricImage as Image,
} from './src/shapes/Image';
export type {
  ImageSource,
  SerializedImageProps,
  ImageProps,
} from './src/shapes/Image';
export { createCollectionMixin } from './src/Collection';

export * as util from './src/util';

export { loadSVGFromString } from './src/parser/loadSVGFromString';
export { loadSVGFromURL } from './src/parser/loadSVGFromURL';
export { parseSVGDocument } from './src/parser/parseSVGDocument';

export { Control } from './src/controls/Control';
export * as controlsUtils from './src/controls';

export * from './src/filters';
