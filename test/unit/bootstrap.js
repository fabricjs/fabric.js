(function(global){
  
  
  function loadScript(url) {
    var elScript = document.createElement('script');
    elScript.type = 'text/javascript';
    elScript.src = url;
    var elHead = document.getElementsByTagName('head')[0];
    if (elHead) {
      elHead.appendChild(elScript);
    }
  }
  global.loadScript = loadScript;
  
  function observeCompletionEvent() {
    Canvas.base.observeEvent('tests:completed', function(e) {
      global.__testsCompleted = true;
      global.__result = e.memo.result;
    });
  }
  
  var canvasLoader = new YAHOO.util.YUILoader({
    base: '/',
    require: [
      'header', 'console', 'prototype', 'ape-ep-dom', 'ape-extensions', 'prototype-extensions',
      
      'bezier', '2D', 'canvas_element', 'canvas_util', 
      'canvas_parser', 'canvas_istub', 'canvas_object', 'canvas_rect', 
      'canvas_path', 'canvas_group', 'canvas_image', 'canvas_circle', 
      'canvas_ellipse', 'canvas_line', 'canvas_polyline', 'canvas_polygon',
      'canvas_text', 'canvas_color', 'svg_cache', 'canvas_path_group', 
      'canvas_path', 'add_command', 'remove_command', 'transform_command',
      'group_add_command', 'group_remove_command', 'command_history',
      
      'unittest', 'event_simulate', 'unittest_css', 'canvas_assertions',
      'toggle_button', 'text_placeholder',
      'ape_anim'
    ],
    onSuccess: function() {
      init();
      observeCompletionEvent();
    }
  });
  
  canvasLoader.addModule({ name: "console",               type: "js",   path: "core/console.js",                        varName: "console.log" });
  canvasLoader.addModule({ name: "prototype",             type: "js",   path: "core/prototype.js",                      varName: "Prototype" });
  canvasLoader.addModule({ name: "ape-ep-dom",            type: "js",   path: "core/ape-ep-dom.js",                     varName: "APE.dom" });
  canvasLoader.addModule({ name: "ape-extensions",        type: "js",   path: "core/ape-extensions.js",                 varName: "APE.getElement" });
  canvasLoader.addModule({ name: "prototype-extensions",  type: "js",   path: "core/prototype-extensions.js",           varName: "Prototype.getScript" });
  
  // helpers - bezier, points, matrices
  canvasLoader.addModule({ name: "bezier",                type: "js",   path: "canvas/bezier.js",                       varName: "Canvas.Bezier" });
  canvasLoader.addModule({ name: '2D',                    type: 'js',   path: 'canvas/2D.js',                           varName: 'Canvas.Point2D' });
                                                                                                                      
  // canvas element, object and all of the subclasses - shapes                                                        
  canvasLoader.addModule({ name: 'canvas_element',        type: 'js',   path: 'canvas/canvas_element.class.js',         varName: 'Canvas.Element' });
  canvasLoader.addModule({ name: 'canvas_util',           type: 'js',   path: 'canvas/canvas_util.js',                  varName: 'Canvas.util' });
  canvasLoader.addModule({ name: 'canvas_parser',         type: 'js',   path: 'canvas/canvas_parser.js',                varName: 'Canvas.parseSVGDocument' });
  canvasLoader.addModule({ name: 'canvas_istub',          type: 'js',   path: 'canvas/canvas_istub.mixin.js',           varName: 'Canvas.IStub' });
  canvasLoader.addModule({ name: 'canvas_object',         type: 'js',   path: 'canvas/canvas_object.class.js',          varName: 'Canvas.Object' });
  canvasLoader.addModule({ name: 'canvas_circle',         type: 'js',   path: 'canvas/canvas_circle.class.js',          varName: 'Canvas.Circle' });
  canvasLoader.addModule({ name: 'canvas_rect',           type: 'js',   path: 'canvas/canvas_rect.class.js',            varName: 'Canvas.Rect' });
  canvasLoader.addModule({ name: 'canvas_line',           type: 'js',   path: 'canvas/canvas_line.class.js',            varName: 'Canvas.Line' });
  canvasLoader.addModule({ name: 'canvas_polygon',        type: 'js',   path: 'canvas/canvas_polygon.class.js',         varName: 'Canvas.Polygon' });
  canvasLoader.addModule({ name: 'canvas_polyline',       type: 'js',   path: 'canvas/canvas_polyline.class.js',        varName: 'Canvas.Polyline' });
  canvasLoader.addModule({ name: 'canvas_ellipse',        type: 'js',   path: 'canvas/canvas_ellipse.class.js',         varName: 'Canvas.Ellipse' });
  canvasLoader.addModule({ name: 'canvas_image',          type: 'js',   path: 'canvas/canvas_image.class.js',           varName: 'Canvas.Image' });
  canvasLoader.addModule({ name: 'canvas_path',           type: 'js',   path: 'canvas/canvas_path.class.js',            varName: 'Canvas.Path' });
  canvasLoader.addModule({ name: 'canvas_path_group',     type: 'js',   path: 'canvas/canvas_path_group.class.js',      varName: 'Canvas.PathGroup' });
  canvasLoader.addModule({ name: 'canvas_group',          type: 'js',   path: 'canvas/canvas_group.class.js',           varName: 'Canvas.Group' });
  canvasLoader.addModule({ name: 'canvas_color',          type: 'js',   path: 'canvas/canvas_color.class.js',           varName: 'Canvas.Color' });
                                                                                                                      
  // text modules
  canvasLoader.addModule({ name: 'canvas_text',           type: 'js',   path: 'canvas/canvas_text.class.js',            varName: 'Canvas.Text' });
  canvasLoader.addModule({ name: 'canvas_glyph',          type: 'js',   path: 'canvas/canvas_glyph.class.js',           varName: 'Canvas.Glyph' });
  canvasLoader.addModule({ name: 'canvas_text2',          type: 'js',   path: 'canvas/canvas_text2.class.js',           varName: 'Canvas.Text2' });
  canvasLoader.addModule({ name: 'canvas_dynamic_text',   type: 'js',   path: 'canvas/canvas_duynamic_text.class.js',   varName: 'Canvas.DynamicText' });
  
  canvasLoader.addModule({ name: 'svg_cache',             type: 'js',   path: 'ui/svg_cache.js',                        varName: 'Dashboard.SVGCache' });
                                                                                                                      
  // commands and undo/redo implementaton                                                                             
  canvasLoader.addModule({ name: 'command_history',       type: 'js',   path: 'canvas/commands/canvas_command_history.class.js',          varName: 'Canvas.CommandHistory' });
  canvasLoader.addModule({ name: 'add_command',           type: 'js',   path: 'canvas/commands/canvas_add_command.class.js',              varName: 'Canvas.AddCommand' });
  canvasLoader.addModule({ name: 'remove_command',        type: 'js',   path: 'canvas/commands/canvas_remove_command.class.js',           varName: 'Canvas.RemoveCommand' });
  canvasLoader.addModule({ name: 'transform_command',     type: 'js',   path: 'canvas/commands/canvas_transform_command.class.js',        varName: 'Canvas.TransformCommand' });
  canvasLoader.addModule({ name: 'group_add_command',     type: 'js',   path: 'canvas/commands/canvas_group_add_command.class.js',        varName: 'Canvas.AddCommand' });
  canvasLoader.addModule({ name: 'group_remove_command',  type: 'js',   path: 'canvas/commands/canvas_group_remove_command.class.js',     varName: 'Canvas.RemoveCommand' });
                                                          
  // testing facility                                                                                                 
  canvasLoader.addModule({ name: 'unittest',              type: 'js',   path: 'test/lib/unittest.js',                   varName: 'Test.Unit' });
  canvasLoader.addModule({ name: 'event_simulate',        type: 'js',   path: 'test/lib/event.simulate.js',             varName: 'Event.simulate' });
  //canvasLoader.addModule({ name: 'unittest_css',          type: 'css',  path: 'test/lib/unittest.css' });               
  canvasLoader.addModule({ name: 'canvas_assertions',     type: 'js',   path: 'test/lib/canvas_assertions.js',          varName: 'assertSameColor' });
                                                          
  canvasLoader.addModule({ name: 'ape_anim',              type: 'js',   path: 'core/anim.js',                           varName: 'APE.anim' });
  
  canvasLoader.insert();
})(this);