//@ts-nocheck
import { fabric } from './HEADER';
// import './lib/event'), // optional gestures
import * as constants from './constants';
Object.assign(fabric, constants);

// console.log(fabric)

import { Observable } from './mixins/observable.mixin';
import { CollectionMixinGenerator } from './mixins/collection.mixin';
import { CommonMethods } from './mixins/common_methods.mixin';

import { applyMixins } from './mixins/apply_mixins';

fabric.Observable = Observable;
fabric.Collection = CollectionMixinGenerator(class { });
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
// import './log';
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

import { CanvasStraighteningMixinGenerator } from "./mixins/canvas_straightening.mixin";

fabric.StaticCanvas = StaticCanvas;
fabric.StaticCanvas = CanvasStraighteningMixinGenerator(fabric.StaticCanvas);


import './canvas.class'; // optional interaction
import { CanvasEventsMixinGenerator } from './mixins/canvas_events.mixin'; // optional interaction
import { CanvasGroupingMixinGenerator } from './mixins/canvas_grouping.mixin'; // optional interaction
import { CanvasGesturesMixinGenerator } from './mixins/canvas_gestures.mixin'; // optional gestures


fabric.Canvas = applyMixins(fabric.Canvas, [
  CanvasEventsMixinGenerator,
  CanvasGroupingMixinGenerator,
  CanvasGesturesMixinGenerator
]);

import { FabricObject } from './shapes/object.class';
fabric.Object = FabricObject;


import { ActiveSelection, Circle, Ellipse, Group, Image, Line, Path, Polygon, Polyline, Rect, Triangle, IText, Text, Textbox } from './shapes';
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


import * as filters from './filters'
Object.assign(fabric.Image, { filters });


import { BaseBrush, CircleBrush, PatternBrush, PencilBrush, SprayBrush } from './brushes';
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
