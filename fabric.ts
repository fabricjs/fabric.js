export { getEnv, getFabricDocument, getFabricWindow, setEnv } from './src/env';
export { cache } from './src/cache';
export { VERSION as version, iMatrix } from './src/constants';
export { config } from './src/config';
export { classRegistry } from './src/ClassRegistry';
export { runningAnimations } from './src/util/animation/AnimationRegistry';

export * from './src/typedefs';

export * from './src/EventTypeDefs';
export { Observable } from './src/Observable';

export { StaticCanvas } from './src/canvas/StaticCanvas';
export { Canvas } from './src/canvas/Canvas';
export { CanvasDOMManager } from './src/canvas/DOMManagers/CanvasDOMManager';
export { StaticCanvasDOMManager } from './src/canvas/DOMManagers/StaticCanvasDOMManager';

export type { XY } from './src/Point';
export { Point } from './src/Point';
export type { IntersectionType } from './src/Intersection';
export { Intersection } from './src/Intersection';
export { Color } from './src/color/Color';
export * from './src/color/typedefs';

export * from './src/gradient';
export * from './src/Pattern';
export { Shadow } from './src/Shadow';
export type { SerializedShadowOptions } from './src/Shadow';

export { BaseBrush } from './src/brushes/BaseBrush';
export * from './src/brushes/typedefs';

export { PencilBrush } from './src/brushes/PencilBrush';
export { CircleBrush } from './src/brushes/CircleBrush';
export { SprayBrush } from './src/brushes/SprayBrush';
export { PatternBrush } from './src/brushes/PatternBrush';

export { FabricObject as Object } from './src/shapes/Object/FabricObject';
export type {
  TProps,
  TFabricObjectProps,
  FabricObjectProps,
  SerializedObjectProps,
} from './src/shapes/Object/types';
export { Line } from './src/shapes/Line';
export { Circle } from './src/shapes/Circle';
export { Triangle } from './src/shapes/Triangle';
export { Ellipse } from './src/shapes/Ellipse';
export { Rect } from './src/shapes/Rect';
export { Path } from './src/shapes/Path';
export { Polyline } from './src/shapes/Polyline';
export { Polygon } from './src/shapes/Polygon';
export { Text } from './src/shapes/Text/Text';
export { IText } from './src/shapes/IText/IText';
export { Textbox } from './src/shapes/Textbox';
export type {
  TextStyleDeclaration,
  TextStyle,
} from './src/shapes/Text/StyledText';
export { Group } from './src/shapes/Group';
export type {
  GroupProps,
  GroupEvents,
  SerializedGroupProps,
} from './src/shapes/Group';
export { ActiveSelection } from './src/shapes/ActiveSelection';
export { Image } from './src/shapes/Image';
export type {
  ImageSource,
  SerializedImageProps,
  ImageProps,
} from './src/shapes/Image';
export { createCollectionMixin } from './src/Collection';

export * as util from './src/util';

export * from './src/parser';

export { Control } from './src/controls/Control';
export * as controlsUtils from './src/controls';

export * from './src/filters';
