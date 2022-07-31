import { fabric } from './HEADER';
// import './lib/event'), // optional gestures
import { Observable } from './src/mixins/observable.mixin';
import { CollectionMixinGenerator } from './src/mixins/collection.mixin';
import { CommonMethods } from './src/mixins/common_methods.mixin';

fabric.Observable = Observable;
fabric.Collection = CollectionMixinGenerator(new class { });
fabric.CommonMethods = CommonMethods;

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
import { Intersection } from './src/intersection.class';
import { Color } from './src/color/color.class';
import * as controlsUtils from './src/controls.actions'; // optional interaction
import { Control } from './src/control.class'; // optional interaction
import { Gradient } from './src/gradient.class'; // optional gradient
import { Pattern } from './src/pattern.class'; // optional pattern
import { Shadow } from './src/shadow.class'; // optional shadow
import { StaticCanvas } from './src/static_canvas.class';

fabric.Point = Point;
fabric.Intersection = Intersection;
fabric.Color = Color;
fabric.controlsUtils = controlsUtils;
fabric.Pattern = Pattern;
fabric.Shadow = Shadow;
fabric.Control = Control;
fabric.Gradient = Gradient;

fabric.StaticCanvas = StaticCanvas;

import './src/canvas.class'; // optional interaction
import { CanvasEventsMixinGenerator } from './src/mixins/canvas_events.mixin'; // optional interaction
fabric.Canvas = CanvasEventsMixinGenerator(fabric.Canvas);
import { CanvasGroupingMixinGenerator } from './src/mixins/canvas_grouping.mixin'; // optional interaction
fabric.Canvas = CanvasGroupingMixinGenerator(fabric.Canvas);
import { CanvasGesturesMixinGenerator } from './src/mixins/canvas_gestures.mixin'; // optional gestures
fabric.Canvas = CanvasGesturesMixinGenerator(fabric.Canvas);

import { FabricObject, ActiveSelection, Circle, Ellipse, Group, Image, Line, Path, Polygon, Polyline, Rect, Triangle } from './src/shapes';
fabric.Object = FabricObject;
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
fabric.Text = Text;
fabric.IText = IText;
fabric.Textbox = Textbox;
fabric.Triangle = Triangle;
import { ObjectStraighteningMixinGenerator, CanvasObjectStraighteningMixinGenerator } from './src/mixins/object_straightening.mixin'; // optional objectstraightening
fabric.Object = ObjectStraighteningMixinGenerator(fabric.Object);
fabric.StaticCanvas = CanvasObjectStraighteningMixinGenerator(fabric.StaticCanvas);

import * as filters from './src/filters'
Object.assign(fabric, filters);


import { ObjectControls, TextboxControls } from './src/mixins/default_controls'; // optional interaction
FabricObject.prototype.controls = ObjectControls;
// this is breaking the prototype inheritance, no time / ideas to fix it.
// is important to document that if you want to have all objects to have a
// specific custom control, you have to add it to Object prototype and to Textbox
// prototype. The controls are shared as references. So changes to control `tr`
// can still apply to all objects if needed.
//  OR STOP USING SHARED OBJECTS!
Textbox.prototype.controls = TextboxControls;

import { BaseBrush, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from './src/brushes'
fabric.BaseBrush = BaseBrush;
fabric.CircleBrush = CircleBrush;
fabric.PatternBrush = PatternBrush;
fabric.PencilBrush = PencilBrush;
fabric.SprayBrush = SprayBrush;


//  extends fabric.StaticCanvas, fabric.Canvas, fabric.Object, depends on fabric.PencilBrush and fabric.Rect
// import './src/mixins/eraser_brush.mixin'; // optional erasing
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
if (typeof window !== 'undefined') {
  window.fabric = fabric;
}
