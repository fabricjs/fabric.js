import { fabric } from './HEADER';
// import './lib/event'), // optional gestures
import './src/mixins/observable.mixin';
import './src/mixins/collection.mixin';
import './src/mixins/shared_methods.mixin';
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
import './src/point.class';
import './src/intersection.class';
import './src/color.class';
import './src/controls.actions'; // optional interaction
import './src/controls.render'; // optional interaction
import './src/control.class'; // optional interaction
import './src/gradient.class'; // optional gradient
import './src/pattern.class'; // optional pattern
import './src/shadow.class'; // optional shadow
import './src/static_canvas.class';
import './src/brushes/base_brush.class'; // optional freedrawing
import './src/brushes/pencil_brush.class'; // optional freedrawing
import './src/brushes/circle_brush.class'; // optional freedrawing
import './src/brushes/spray_brush.class'; // optional freedrawing
import './src/brushes/pattern_brush.class'; // optional freedrawing
import './src/canvas.class'; // optional interaction
import './src/mixins/canvas_events.mixin'; // optional interaction
import './src/mixins/canvas_grouping.mixin'; // optional interaction
import './src/mixins/canvas_dataurl_exporter.mixin';
import './src/mixins/canvas_serialization.mixin'; // optiona serialization
import './src/mixins/canvas_gestures.mixin'; // optional gestures


import { FabricObject as FabricObject } from './src/shapes/Object';
fabric.Object = FabricObject;

import oom from './src/mixins/object_origin.mixin';
import ogm from './src/mixins/object_geometry.mixin';
import oam from './src/mixins/object_ancestry.mixin';
import osm from './src/mixins/object_stacking.mixin';
import osxm from './src/mixins/object.svg_export';
import statfulMixin from './src/mixins/stateful.mixin';
import oim from './src/mixins/object_interactivity.mixin'; // optional interaction
import am from './src/mixins/animation.mixin'; // optional animation

import sm from './src/mixins/object_straightening.mixin'; // optional objectstraightening

[oom, ogm, oam, osm, osxm, statfulMixin, oim, am, sm].forEach(mixin => mixin(fabric));

// import { ActiveSelection } from './src/shapes/ActiveSelection';
// import { Circle } from './src/shapes/Circle';
// import { Ellipse } from './src/shapes/Ellipse';
// import { Group } from './src/shapes/Group';
// import { Image } from './src/shapes/Image';
// import { Line } from './src/shapes/Line';
// import { Path } from './src/shapes/Path';
// import { Polygon } from './src/shapes/Polygon';
// import { Polyline } from './src/shapes/Polyline';
// import { Rect } from './src/shapes/Rect';
// import { Triangle } from './src/shapes/Triangle';

// fabric.ActiveSelection = ActiveSelection;
// fabric.Circle = Circle;
// fabric.Ellipse = Ellipse;
// fabric.Group = Group;
// fabric.Image = Image;
// fabric.Line = Line;
// fabric.Path = Path;
// fabric.Polyline = Polyline;
// fabric.Polygon = Polygon;
// fabric.Rect = Rect;
// fabric.Text = Text;
// fabric.IText = IText;
// fabric.Textbox = Textbox;
// fabric.Triangle = Triangle;





// import './src/filters/webgl_backend.class'; // optional image_filters
// import './src/filters/2d_backend.class'; // optional image_filters
// import './src/filters/base_filter.class'; // optional image_filters
// import './src/filters/colormatrix_filter.class'; // optional image_filters
// import './src/filters/brightness_filter.class'; // optional image_filters
// import './src/filters/convolute_filter.class'; // optional image_filters
// import './src/filters/grayscale_filter.class'; // optional image_filters
// import './src/filters/invert_filter.class'; // optional image_filters
// import './src/filters/noise_filter.class'; // optional image_filters
// import './src/filters/pixelate_filter.class'; // optional image_filters
// import './src/filters/removecolor_filter.class'; // optional image_filters
// import './src/filters/filter_generator'; // optional image_filters
// import './src/filters/blendcolor_filter.class'; // optional image_filters
// import './src/filters/blendimage_filter.class'; // optional image_filters
// import './src/filters/resize_filter.class'; // optional image_filters
// import './src/filters/contrast_filter.class'; // optional image_filters
// import './src/filters/saturate_filter.class'; // optional image_filters
// import './src/filters/vibrance_filter.class'; // optional image_filters
// import './src/filters/blur_filter.class'; // optional image_filters
// import './src/filters/gamma_filter.class'; // optional image_filters
// import './src/filters/composed_filter.class'; // optional image_filters
// import './src/filters/hue_rotation.class'; // optional image_filters

// import { Text } from './src/shapes/Text';
// import './src/mixins/text_style.mixin'; // optional text
// import { IText } from './src/shapes/IText';
// import './src/mixins/itext_behavior.mixin'; // optional itext
// import './src/mixins/itext_click_behavior.mixin'; // optional itext
// import './src/mixins/itext_key_behavior.mixin'; // optional itext
// import './src/mixins/itext.svg_export'; // optional itext
// import { Textbox } from './src/shapes/Textbox';


import './src/mixins/default_controls'; // optional interaction
//  extends fabric.StaticCanvas, fabric.Canvas, fabric.Object, depends on fabric.PencilBrush and fabric.Rect
// import './src/mixins/eraser_brush.mixin'; // optional erasing
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
if (typeof window !== 'undefined') {
  window.fabric = fabric;
}
