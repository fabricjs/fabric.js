export { getEnv, getDocument, getWindow, setEnvForTests } from './src/env';
export { cache } from './src/cache';
export { VERSION as version, iMatrix } from './src/constants';
export { config } from './src/config';
export { runningAnimations } from './src/util/animation/AnimationRegistry';

export { Observable } from './src/Observable';

export { StaticCanvas } from './src/canvas/StaticCanvas';
export { Canvas } from './src/canvas/Canvas';

export { Point } from './src/Point';
export { Intersection } from './src/Intersection';
export { Color } from './src/color/Color';

export { Gradient } from './src/gradient/Gradient';
export { Pattern } from './src/Pattern';
export { Shadow } from './src/Shadow';

export { BaseBrush } from './src/brushes/BaseBrush';
export { PencilBrush } from './src/brushes/PencilBrush';
export { CircleBrush } from './src/brushes/CircleBrush';
export { SprayBrush } from './src/brushes/SprayBrush';
export { PatternBrush } from './src/brushes/PatternBrush';

export { FabricObject as Object } from './src/shapes/Object/FabricObject';
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
export { Group } from './src/shapes/Group';
export { ActiveSelection } from './src/shapes/ActiveSelection';
export { Image } from './src/shapes/Image';
export { createCollectionMixin } from './src/Collection';

export { loadSVGFromURL } from './src/parser/loadSVGFromURL';
export { loadSVGFromString } from './src/parser/loadSVGFromString';
export { parseAttributes } from './src/parser/parseAttributes';
export { parseElements } from './src/parser/parseElements';
export { parseStyleAttribute } from './src/parser/parseStyleAttribute';
export { parsePointsAttribute } from './src/parser/parsePointsAttribute';
export { parseTransformAttribute } from './src/parser/parseTransformAttribute';
export { getCSSRules } from './src/parser/getCSSRules';
export { parseFontDeclaration } from './src/parser/parseFontDeclaration';

export * as util from './util';

export { Control } from './controls';
export * as controlsUtils from './controls';
import './src/controls/default_controls';

export {
  getFilterBackend,
  initFilterBackend,
  Canvas2dFilterBackend,
  WebGLFilterBackend,
} from './filters';
export * as filters from './filters';
