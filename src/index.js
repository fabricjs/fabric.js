import { fabric } from './HEADER';
// import './lib/event'), // optional gestures
import { Observable } from './mixins/observable.mixin';
import { CollectionMixinGenerator } from './mixins/collection.mixin';
import { CommonMethods } from './mixins/common_methods.mixin';

fabric.Observable = Observable;
fabric.Collection = CollectionMixinGenerator(new class { });
fabric.CommonMethods = CommonMethods;

import './util/misc';
// import './src/util/named_accessors.mixin'; i would imagine dead forever or proper setters/getters
import './util/path';
import './util/lang_array';
import './util/lang_object';
import './util/lang_string';
import './util/lang_class';
import './util/dom_event'; // optional interaction
import './util/dom_style';
import './util/dom_misc';
import './util/dom_request';
import './log';
import './util/animate'; // optional animation
import './util/animate_color'; // optional animation
import './util/anim_ease'; // optional easing
import './parser'; // optional parser
import './elements_parser'; // optional parser

import { Point } from './point.class';
import { Intersection } from './intersection.class';
import { Color } from './color/color.class';
import * as controlsUtils from './controls.actions'; // optional interaction
import { Control } from './control.class'; // optional interaction
import { Gradient } from './gradient.class'; // optional gradient
import { Pattern } from './pattern.class'; // optional pattern
import { Shadow } from './shadow.class'; // optional shadow
import { StaticCanvas } from './static_canvas.class';

fabric.Point = Point;
fabric.Intersection = Intersection;
fabric.Color = Color;
fabric.controlsUtils = controlsUtils;
fabric.Pattern = Pattern;
fabric.Shadow = Shadow;
fabric.Control = Control;
fabric.Gradient = Gradient;

fabric.StaticCanvas = StaticCanvas;

import './canvas.class'; // optional interaction
import { CanvasEventsMixinGenerator } from './mixins/canvas_events.mixin'; // optional interaction
fabric.Canvas = CanvasEventsMixinGenerator(fabric.Canvas);
import { CanvasGroupingMixinGenerator } from './mixins/canvas_grouping.mixin'; // optional interaction
fabric.Canvas = CanvasGroupingMixinGenerator(fabric.Canvas);
import { CanvasGesturesMixinGenerator } from './mixins/canvas_gestures.mixin'; // optional gestures
fabric.Canvas = CanvasGesturesMixinGenerator(fabric.Canvas);

//import { Object as FabricObject, ActiveSelection, Circle, Ellipse, Group, Image, Line, Path, Polygon, Polyline, Rect, Triangle } from './src/shapes';
import { FabricObject } from './shapes/object.class';
fabric.Object = FabricObject;
// fabric.ActiveSelection = ActiveSelection;
// fabric.Circle = Circle;
// fabric.Ellipse = Ellipse;
// fabric.Group = Group;
// fabric.Image = Image;
// fabric.Line = Line;
// fabric.Path = Path;
// fabric.Polygon = Polygon;
// fabric.Polyline = Polyline;
// fabric.Rect = Rect;
// fabric.Text = Text;
// fabric.IText = IText;
// fabric.Textbox = Textbox;
// fabric.Triangle = Triangle;
import { ObjectStraighteningMixinGenerator, CanvasObjectStraighteningMixinGenerator } from './mixins/object_straightening.mixin'; // optional objectstraightening
fabric.Object = ObjectStraighteningMixinGenerator(fabric.Object);
fabric.StaticCanvas = CanvasObjectStraighteningMixinGenerator(fabric.StaticCanvas);

import * as filters from './filters'
Object.assign(fabric, filters);


import { ObjectControls, TextboxControls } from './mixins/default_controls'; // optional interaction
FabricObject.prototype.controls = ObjectControls;
// this is breaking the prototype inheritance, no time / ideas to fix it.
// is important to document that if you want to have all objects to have a
// specific custom control, you have to add it to Object prototype and to Textbox
// prototype. The controls are shared as references. So changes to control `tr`
// can still apply to all objects if needed.
//  OR STOP USING SHARED OBJECTS!
Textbox.prototype.controls = TextboxControls;

import { BaseBrush, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from './brushes'
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
