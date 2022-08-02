import { fabric } from './HEADER.js';
// import './lib/event.js'), // optional gestures
import './src/mixins/observable.mixin.js';
import './src/mixins/collection.mixin.js';
import './src/mixins/shared_methods.mixin.js';
import './src/util/misc.js';
// import './src/util/named_accessors.mixin.js'; i would imagine dead forever or proper setters/getters
import './src/util/path.js';
import './src/util/lang_array.js';
import './src/util/lang_object.js';
import './src/util/lang_string.js';
import './src/util/lang_class.js';
import './src/util/dom_event.js'; // optional interaction
import './src/util/dom_style.js';
import './src/util/dom_misc.js';
import './src/util/dom_request.js';
import './src/log.js';
import './src/util/animate.js'; // optional animation
import './src/util/animate_color.js'; // optional animation
import './src/util/anim_ease.js'; // optional easing
import './src/parser.js'; // optional parser
import './src/elements_parser.js'; // optional parser
import './src/point.class.js';
import './src/intersection.class.js';
import './src/color.class.js';
import './src/controls.actions.js'; // optional interaction
import './src/controls.render.js'; // optional interaction
import './src/control.class.js'; // optional interaction
import './src/gradient.class.js'; // optional gradient
import './src/pattern.class.js'; // optional pattern
import './src/shadow.class.js'; // optional shadow
import './src/static_canvas.class.js';
import './src/brushes/base_brush.class.js'; // optional freedrawing
import './src/brushes/pencil_brush.class.js'; // optional freedrawing
import './src/brushes/circle_brush.class.js'; // optional freedrawing
import './src/brushes/spray_brush.class.js'; // optional freedrawing
import './src/brushes/pattern_brush.class.js'; // optional freedrawing
import './src/canvas.class.js'; // optional interaction
import './src/mixins/canvas_events.mixin.js'; // optional interaction
import './src/mixins/canvas_grouping.mixin.js'; // optional interaction
import './src/mixins/canvas_dataurl_exporter.mixin.js';
import './src/mixins/canvas_serialization.mixin.js'; // optiona serialization
import './src/mixins/canvas_gestures.mixin.js'; // optional gestures
import './src/shapes/object.class.js';
import './src/mixins/object_origin.mixin.js';
import './src/mixins/object_geometry.mixin.js';
import './src/mixins/object_ancestry.mixin.js';
import './src/mixins/object_stacking.mixin.js';
import './src/mixins/object.svg_export.js';
import './src/mixins/stateful.mixin.js';
import './src/mixins/object_interactivity.mixin.js'; // optional interaction
import './src/mixins/animation.mixin.js'; // optional animation
import './src/shapes/line.class.js';
import './src/shapes/circle.class.js';
import './src/shapes/triangle.class.js';
import './src/shapes/ellipse.class.js';
import './src/shapes/rect.class.js';
import './src/shapes/polyline.class.js';
import './src/shapes/polygon.class.js';
import './src/shapes/path.class.js';
import './src/shapes/group.class.js';
import './src/shapes/active_selection.class.js'; // optional interaction
import './src/shapes/image.class.js';
import './src/mixins/object_straightening.mixin.js'; // optional objectstraightening
import './src/filters/webgl_backend.class.js'; // optional image_filters
import './src/filters/2d_backend.class.js'; // optional image_filters
import './src/filters/base_filter.class.js'; // optional image_filters
import './src/filters/colormatrix_filter.class.js'; // optional image_filters
import './src/filters/brightness_filter.class.js'; // optional image_filters
import './src/filters/convolute_filter.class.js'; // optional image_filters
import './src/filters/grayscale_filter.class.js'; // optional image_filters
import './src/filters/invert_filter.class.js'; // optional image_filters
import './src/filters/noise_filter.class.js'; // optional image_filters
import './src/filters/pixelate_filter.class.js'; // optional image_filters
import './src/filters/removecolor_filter.class.js'; // optional image_filters
import './src/filters/filter_generator.js'; // optional image_filters
import './src/filters/blendcolor_filter.class.js'; // optional image_filters
import './src/filters/blendimage_filter.class.js'; // optional image_filters
import './src/filters/resize_filter.class.js'; // optional image_filters
import './src/filters/contrast_filter.class.js'; // optional image_filters
import './src/filters/saturate_filter.class.js'; // optional image_filters
import './src/filters/vibrance_filter.class.js'; // optional image_filters
import './src/filters/blur_filter.class.js'; // optional image_filters
import './src/filters/gamma_filter.class.js'; // optional image_filters
import './src/filters/composed_filter.class.js'; // optional image_filters
import './src/filters/hue_rotation.class.js'; // optional image_filters
import './src/shapes/text.class.js'; // optional text
import './src/mixins/text_style.mixin.js'; // optional text
import './src/shapes/itext.class.js'; // optional itext
import './src/mixins/itext_behavior.mixin.js'; // optional itext
import './src/mixins/itext_click_behavior.mixin.js'; // optional itext
import './src/mixins/itext_key_behavior.mixin.js'; // optional itext
import './src/mixins/itext.svg_export.js'; // optional itext
import './src/shapes/textbox.class.js'; // optional textbox
import './src/mixins/default_controls.js'; // optional interaction
//  extends fabric.StaticCanvas, fabric.Canvas, fabric.Object, depends on fabric.PencilBrush and fabric.Rect
// import './src/mixins/eraser_brush.mixin.js'; // optional erasing
if (typeof exports !== 'undefined') {
  exports.fabric = fabric;
}
if (typeof window !== 'undefined') {
  window.fabric = fabric;
}
