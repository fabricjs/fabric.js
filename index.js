import { fabric } from './HEADER';
// import './lib/event'), // optional gestures
// import './src/mixins/observable.mixin';
// import './src/mixins/collection.mixin';
// import './src/mixins/common_methods.mixin';
import './src/util/misc';
// import './src/util/named_accessors.mixin'; i would imagine dead forever or proper setters/getters
import './src/util/path';
import './src/util/lang_array';
import './src/util/lang_object';
import './src/util/lang_string';
import './src/util/lang_class';
import './src/util/dom_event'; // optional interaction
import './src/util/dom_style';
import './src/util/dom_misc';
import './src/util/dom_request';
import './src/log';
import './src/util/animate'; // optional animation
import './src/util/animate_color'; // optional animation
import './src/util/anim_ease'; // optional easing
import './src/parser'; // optional parser
import './src/elements_parser'; // optional parser
import { Point } from './src/point.class';
fabric.Point = Point;
import './src/intersection.class';
import { Color } from './src/color/color.class';
fabric.Color = Color;
import * as controlsUtils from './src/controls.actions'; // optional interaction
fabric.controlsUtils = controlsUtils;
import './src/controls.render'; // optional interaction
import './src/control.class'; // optional interaction
import { Gradient } from './src/gradient.class'; // optional gradient
fabric.Gradient = Gradient;
import { Pattern } from './src/pattern.class'; // optional pattern
fabric.Pattern = Pattern;
import { Shadow } from './src/shadow.class'; // optional shadow
fabric.Shadow = Shadow;
import { StaticCanvas } from './src/static_canvas.class';
fabric.StaticCanvas = StaticCanvas;
// import './src/brushes/base_brush.class'; // optional freedrawing
// import './src/brushes/pencil_brush.class'; // optional freedrawing
// import './src/brushes/circle_brush.class'; // optional freedrawing
// import './src/brushes/spray_brush.class'; // optional freedrawing
// import './src/brushes/pattern_brush.class'; // optional freedrawing
import { BaseBrush, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from './src/brushes'
fabric.BaseBrush = BaseBrush;
fabric.CircleBrush = CircleBrush;
fabric.PatternBrush = PatternBrush;
fabric.PencilBrush = PencilBrush;
fabric.SprayBrush = SprayBrush;
import './src/canvas.class'; // optional interaction
import { CanvasEventsMixinGenerator } from './src/mixins/canvas_events.mixin'; // optional interaction
fabric.Canvas = CanvasEventsMixinGenerator(fabric.Canvas);
import { CanvasGroupingMixinGenerator } from './src/mixins/canvas_grouping.mixin'; // optional interaction
fabric.Canvas = CanvasGroupingMixinGenerator(fabric.Canvas);
//import { CanvasDataURLExporterMixinGenerator } from './src/mixins/canvas_dataurl_exporter.mixin';//done in static_canvas
import { CanvasSerializationMixinGenerator } from './src/mixins/canvas_serialization.mixin'; // optiona serialization
fabric.StaticCanvas = CanvasSerializationMixinGenerator(fabric.StaticCanvas);
import { CanvasGesturesMixinGenerator } from './src/mixins/canvas_gestures.mixin'; // optional gestures
fabric.Canvas = CanvasGesturesMixinGenerator(fabric.Canvas);
import { FabricObject, FabricObject as Object } from './src/shapes/object.class';

fabric.Object = Object;
import { ObjectOriginMixinGenerator } from './src/mixins/object_origin.mixin';
fabric.Object = ObjectOriginMixinGenerator(fabric.Object);
import { ObjectGeometryMixinGenerator } from './src/mixins/object_geometry.mixin';
fabric.Object = ObjectGeometryMixinGenerator(fabric.Object);
import { ObjectAncestryMixinGenerator } from './src/mixins/object_ancestry.mixin';
fabric.Object = ObjectAncestryMixinGenerator(fabric.Object);
import { ObjectStackingMixinGenerator } from './src/mixins/object_stacking.mixin';
fabric.Object = ObjectStackingMixinGenerator(fabric.Object);
import { ObjectSVGExportMixinGenerator } from './src/mixins/object.svg_export';
fabric.Object = ObjectSVGExportMixinGenerator(fabric.Object);
import './src/mixins/stateful.mixin';
import { ObjectInteractivityMixinGenerator } from './src/mixins/object_interactivity.mixin'; // optional interaction
fabric.Object = ObjectInteractivityMixinGenerator(fabric.Object);
import { ObjectAnimationMixinGenerator } from './src/mixins/object_animation.mixin'; // optional animation
import { StaticCanvasAnimationMixinGenerator } from './src/mixins/canvas_animation.mixin'; // optional animation
fabric.StaticCanvas = StaticCanvasAnimationMixinGenerator(fabric.StaticCanvas);
fabric.Object = ObjectAnimationMixinGenerator(fabric.Object);
// import './src/shapes/line.class';
// import './src/shapes/circle.class';
// import './src/shapes/triangle.class';
// import './src/shapes/ellipse.class';
// import './src/shapes/rect.class';
// import './src/shapes/polyline.class';
// import './src/shapes/polygon.class';
// import './src/shapes/path.class';
// import './src/shapes/group.class';
// import './src/shapes/active_selection.class'; // optional interaction
// import './src/shapes/image.class';
import { ActiveSelection, Circle, Ellipse, Group, Image, Line, Path, Polygon, Polyline, Rect, Triangle } from './src/shapes';
fabric.ActiveSelection = ActiveSelection;
fabric.Circle = Circle;
fabric.Ellipse = Ellipse;
fabric.Group = Group;
fabric.Image = Image;
fabric.Line = Line;
fabric.Path = Path;
fabric.Polygon = Polygon;
fabric.Polyline = Polyline;
fabric.Rect = Rect;
// fabric.Text = Text;
// fabric.IText = IText;
// fabric.Textbox = Textbox;
fabric.Triangle = Triangle;
import { ObjectStraighteningMixinGenerator, StaticCanvasObjectStraighteningMixinGenerator } from './src/mixins/object_straightening.mixin'; // optional objectstraightening
fabric.Object = ObjectStraighteningMixinGenerator(fabric.Object);
fabric.StaticCanvas = StaticCanvasObjectStraighteningMixinGenerator(fabric.StaticCanvas);
import './src/filters/webgl_backend.class'; // optional image_filters
import './src/filters/2d_backend.class'; // optional image_filters
import './src/filters/base_filter.class'; // optional image_filters
import './src/filters/colormatrix_filter.class'; // optional image_filters
import './src/filters/brightness_filter.class'; // optional image_filters
import './src/filters/convolute_filter.class'; // optional image_filters
import './src/filters/grayscale_filter.class'; // optional image_filters
import './src/filters/invert_filter.class'; // optional image_filters
import './src/filters/noise_filter.class'; // optional image_filters
import './src/filters/pixelate_filter.class'; // optional image_filters
import './src/filters/removecolor_filter.class'; // optional image_filters
import './src/filters/filter_generator'; // optional image_filters
import './src/filters/blendcolor_filter.class'; // optional image_filters
import './src/filters/blendimage_filter.class'; // optional image_filters
import './src/filters/resize_filter.class'; // optional image_filters
import './src/filters/contrast_filter.class'; // optional image_filters
import './src/filters/saturate_filter.class'; // optional image_filters
import './src/filters/vibrance_filter.class'; // optional image_filters
import './src/filters/blur_filter.class'; // optional image_filters
import './src/filters/gamma_filter.class'; // optional image_filters
import './src/filters/composed_filter.class'; // optional image_filters
import './src/filters/hue_rotation.class'; // optional image_filters
import { Text } from './src/shapes/text.class'; // optional text
import { TextStyleMixinGenerator } from './src/mixins/text_style.mixin'; // optional Text
fabric.Text = TextStyleMixinGenerator(Text);
import { IText } from './src/shapes/itext.class'; // optional itext
fabric.IText = IText;
import { ITextBehaviorMixinGenerator } from './src/mixins/itext_behavior.mixin'; // optional itext_behavior
fabric.IText = ITextBehaviorMixinGenerator(fabric.IText);
import { ITextClickBehaviorMixinGenerator } from './src/mixins/itext_click_behavior.mixin'; // optional itext
fabric.IText = ITextClickBehaviorMixinGenerator(fabric.IText);
import { ITextKeyBehaviorMixinGenerator } from './src/mixins/itext_key_behavior.mixin'; // optional itext_behavior
fabric.IText = ITextKeyBehaviorMixinGenerator(fabric.IText);
import { TextIMixinGenerator } from './src/mixins/itext.svg_export'; // optional itext
fabric.Text = TextIMixinGenerator(fabric.Text);
import { Textbox } from './src/shapes/textbox.class'; // optional textbox
// fabric.Textbox = Textbox;
import { ObjectControls, TextboxControls } from './src/mixins/default_controls'; // optional interaction
FabricObject.prototype.controls = ObjectControls;
// this is breaking the prototype inheritance, no time / ideas to fix it.
// is important to document that if you want to have all objects to have a
// specific custom control, you have to add it to Object prototype and to Textbox
// prototype. The controls are shared as references. So changes to control `tr`
// can still apply to all objects if needed.
//  OR STOP USING SHARED OBJECTS!
Textbox.prototype.controls = TextboxControls;
//  extends fabric.StaticCanvas, fabric.Canvas, fabric.Object, depends on fabric.PencilBrush and fabric.Rect
// import './src/mixins/eraser_brush.mixin'; // optional erasing
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
if (typeof window !== 'undefined') {
  window.fabric = fabric;
}
