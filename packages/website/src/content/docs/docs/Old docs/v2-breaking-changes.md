---
date: '2017-07-29'
description: A list of breaking changes from v1 to v2
title: Upgrade to fabric 2.x
---

### Removed methods

Object.getWidth() and Object.getHeight have been renamed to getScaledWidth and getScaledHeight.  
The reason behind it is that they were confusion on what they were supposed to give back.  
If you use the accessors optional mixin, you get them back but they will just be getters for .width and .height

### fabric.PathGroup

Fabric.PathGroup has been removed. The class existed as container able to render the imported SVGs.  
Since now fabric.Group can handle it, the class has been removed from the codebase.

#### Converting existing fabric.PathGroup in fabric.Group

To convert a PathGroup to a Group from an old cobdebase we have to add a function to fabric so that the process can go smooth.
```js
    fabric.PathGroup = { };
    fabric.PathGroup.fromObject = function(object, callback) {
      var originalPaths = object.paths;
      delete object.paths;
      if (typeof originalPaths === 'string') {
        fabric.loadSVGFromURL(originalPaths, function (elements) {
          var pathUrl = originalPaths;
          var group = fabric.util.groupSVGElements(elements, object, pathUrl);
          group.type = 'group';
          object.paths = originalPaths;
          callback(group);
        });
      }
      else {
        fabric.util.enlivenObjects(originalPaths, function(enlivenedObjects) {
          enlivenedObjects.forEach(function(obj) {
            obj._removeTransformMatrix();
          })
          var group = new fabric.Group(enlivenedObjects, object);
          group.type = 'group';
          object.paths = originalPaths;
          callback(group);
        });
      }
    };
```

This should do the trick.

### [fabric.Image](#image)

Fabric.Image got some changes. Lets' s start with the easy ones. `alignX, alignY, meetOrSlice` are gone. Old objects carrying those 3 properties will evntually restore it at no use. This feature was introduced by myself to support: [preserveAspectRatio](https://developer.mozilla.org/en/docs/Web/SVG/Attribute/preserveAspectRatio) attribute from SVGs. It turned out that outside SVGs no one had ever a clue of how using it and other than the reference example SVG no other SVG ever used it. A complete useless thing. `I would be happy to be proven wrong anyway`. Instead of it we introduced `cropX`, `cropY` attributes. Those 2 new attributes togheter with the classic width and height can still emulate the full functionality of SVG's preserveAspectRatio attribute and let you do more. So the image svg parser got bigger to translate `preserveAspectRatio` into a combination of `scaleX, scaleY, width, height, cropX, cropY`, but you can do more. More what?  
****You can actually crop pictures!****. There is no interface for it and maybe there will be not, but you can do that with the normal events. So a fundamental behaviour has changed: before 2.0 release, altering a fabric.Image width and height property would make it bigger or smaller, exactly as scaleX and scaleY would do. This was a side effect of drawImage htmlCanvas api. Now for images drawImage is used in the 9 parameter form: `ctx.drawImage(element, cropX, cropY, width, height, dx, dy, dw, dh)`.  
So cropX and cropY represent how much are you cropping from the top left corner for the image, in pixels, no scales involved.  
Width and height properties are influencing how much of the image are you using. A crop rectangle.

### fabric.Image.fromObject IMPORTANT!

Due to changes in how width and height are handled, the old JSON will not load properly if the image dimensions have been modified. What follow is a dropin replacement for `fabric.Image.fromObject` to fix the difference:
```js
     **
     * Creates an instance of fabric.Image from its object representation
     * @static
     * @param {Object} object Object to create an instance from
     * @param {Function} callback Callback to invoke when an image instance is created
     */
     fabric.Image.fromObject = function(object, callback) {
       fabric.util.loadImage(object.src, function(img, error) {
         if (error) {
           callback && callback(null, error);
           return;
         }
         fabric.Image.prototype._initFilters.call(object, object.filters, function(filters) {
           object.filters = filters || [];
           fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function(resizeFilters) {
             object.resizeFilter = resizeFilters[0];
             if (typeof object.version === 'undefined') {
               var elWidth = img.naturalWidth || img.width;
               var elHeight = img.naturalHeight || img.height;
               var scaleX = (object.scaleX || 1) * object.width / elWidth;
               var scaleY = (object.scaleY || 1) * object.height / elHeight;
               object.width = elWidth;
               object.height = elHeight;
               object.scaleX = scaleX;
               object.scaleY = scaleY;
             }
             var image = new fabric.Image(img, object);
             callback(image);
           });
         });
       }, null, object.crossOrigin);
     };
``` 

**Image.applyFilters got sync!**  
the applyFilter functions of fabric.Image on the version 1.x is:

    1) create a new canvas to hosted the filtered image
    2) copy the current image on that canvas
    3) for each filter do the following:
      a) getImageData from the canvas
      b) processImageData
      c) write everything on the canvas
      d) rinse, repeat.
    4) a the end convert the canvas in dataUrl
    5) create a new Image element and load the dataUrl

So the function, after blocking the main thread for many many milliseconds, sometimes thousands, start an async process to load the image back on an imageElement, with pain of the callback managment, and no benefit of it, since it was heavily blocking.  
The new process is different. First of all is on WEBGL, but a complete explanation of that will come, if you do not have WEBGL available, the process is as follow:

    1) create a new canvas to host the filtered image if you do not have one.
    2) copy the current image on that canvas, getImageData from the canvas.
    3) for each filter do the following:
      a) processImageData
    4) At the end putImageData on the canvas.
    5) Keep that canvas as drawing element since is ok
    6) If you filter again, the canvas is cleaned and reused.

If you ever built a slider to preview brightness in real time with the old code, every sliding, every mousemove, you were creating a new canvas element, stop using it at the next tick, memory went up for all canvases created, at some point the GC would kick in and stop you for some time. The DataURL took time, even considering that everything was happening in your memory, to a dataurl operation from a grid of pixel is involved a PNG compression, a reading and a PNG decompression from the image element, a painting over the Bitmap. Is not for free. Even without WEBGL the new canvas filtering is faster. So important, all the examples you find around ( i corrected all that i could find ):

```
    img.applyFilters(canvas.renderAll.bind(canvas));
```

are out dated and will throw error. You have just to do:

    img.applyFilters();
    canvas.requestRenderAll(); // or the old canvas.renderAll() if you prefer or need it
    // Optionally you can pass a filters array to applyFilter
    // if you want to apply something that is not the image filter chain.
    img.applyFilters([ new fabric.Image.filters.Contrast({ contrast: 15 })]);
    

Another breaking change is that the `.resizeFilters` is no more an array of resize filter. Is a single resizeFilter that you can use when the object is scaled on the canvas.

    image.resizeFilter = new fabric.Image.filters.ResizeFilter({type: 'hermite'});
    

Resize filters are not ready in WEBGL yet.

### [fabric.Image.filters](#filters)

[About filtering](/fabric-filters) Here you find a complete explanation of the filter logic of fabricJS, including how to write your filters. What changed?  
Structure of the filter changed.  
Filters include a WEBGL shader to operate fast on the GPU.  
Filters can be COMPOSED! you can use the new class ComposedFilter that is like a group of filters where you can save your custom filter.  
New filters like Blur and Gamma. ( Colormatrix and Saturation have been silently introduced in 1.7.x ).

### [use of requestAnimationFrame and automatic renders from the api](#requestRenderAll)

`Canvas.renderall` is a sync operation, blocking the main thread for a decent amount of milliseconds.  
When dragging around object for each mouse mouse move fired you were getting a renderAll, also when adding may objects with a for loop, you were getting a renderAll for each object if you did not stop the rendering with `renderOnAddRemove = false`.  
Additionally some methods were rendering to display the canvas changes, others were not.  
In this release we tried to do things better.  
We suggest to replace `Canvas.renderAll` with `Canvas.requestRenderAll`, and this has been already done for all the actions that involve mouse operations. requestRenderAll ad renderAll interact in this way:
```js
      /**
       * Append a renderAll request to next animation frame.
       * a boolean flag will avoid appending more.
       * @return {fabric.Canvas} instance
       * @chainable
       */
      requestRenderAll: function () {
        if (!this.isRendering) {
          this.isRendering = fabric.util.requestAnimFrame(this.renderAndResetBound);
        }
        return this;
      },

      /**
       * Function created to be instance bound at initialization
       * used in requestAnimationFrame rendering
       * @return {fabric.Canvas} instance
       * @chainable
       */
      renderAndReset: function() {
        this.isRendering = 0;
        this.renderAll();
      },

      /**
       * Renders the canvas
       * @return {fabric.Canvas} instance
       * @chainable
       */
      renderAll: function () {
        var canvasToDrawOn = this.contextContainer;
        if (this.isRendering) {
          fabric.window.cancelAnimationFrame(this.isRendering);
        }
        this.renderCanvas(canvasToDrawOn, this._objects);
        return this;
      },
```

`Canvas.requestRenderAll` is going to append a render to the next frame ( a sort of dynamic setTimeout ) and save in `this.rendering` the handler to that request. When the times come, fabric zeros the handler and renders with `renderAll`.  
if You call requestRenderAll twice before you get a render, the second one is skipped ( check the `if(!this.isRendering)` ).  
This will greatly improve the app performance since during dragging on macOS you get something more than 60 mouse move events in one second, and most of them are wasted cpu time in rendering a frame that get in the screen before the vsync. If your renderAll takes too much time, you will probably render one frame each 2 but is better than a cpu at hogged at 100% that cannot finish a frame before another is requested.  
If you do not like it, the old plain renderAll is still there.  
The old renderAll before rendering check if there is a quequed rendered frame and will cancel the animation pending, since it is about to render immediately.  

### List of methods that call requestRenderAll

Those methods render on their own and can be stopped with `renderOnAddRemove = false`:

      Collection.add ( Group, Canvas, ActiveSelection classes )
      Collection.insertAt ( Group, Canvas, ActiveSelection classes )
      Collection.remove ( Group, Canvas, ActiveSelection classes )
      StaticCanvas.setViewportTransform
      StaticCanvas.clear
      StaticCanvas.sendToBack
      StaticCanvas.sendBackwards
      StaticCanvas.bringToFront
      StaticCanvas.bringForward
      StaticCanvas.moveTo
      StaticCanvas._centerObject ( all the center related function, viewport or not)

Those methods fire a render and they just do it:

      IText.enterEditing
      StaticCanvas.setDimensions

The property `renderOnAddRemove` looks misnamed at least. This property already existed, and in version 1 it was covering just add , remove and insertAt. As a fabricjs developer and without requestAnimationFrame and without caching, using some methods that would force a render was very frustrating for me, and i ended up always writing crazy functions to do what the methods to but without rendering. So i builded up the idea that this was something that a developer wanted to control.  
Keep `renderOnAddRemove` to `true` and use the methods normally. Consecutive request to rendering are ignored anyway. If you want to avoid rendering completely, just set it to false, and call requestRenderAll when you need it.

### Selection handling

With the `Canvas` class fabric.js can handle a layer of selection / interaction.  
Fabric can handle also multiple selection using a special class called `ActiveSelection`.  
When a mouse interaction is performed by a user that utilize an app based on fabricJS, there are some built in selection functionalities.  
What follow is a default overview of the selection process:  
- Left click on an object selects it.  
- Click and drag on the canvas creates a rectangular selection. All the bounding boxes intersecting with this rectangle will be selected on mouse up creating a multi selection.  
- Clicking on objects with shift selects it or add it to the current selection, changing from a selected object to a multi selection of 2 objects.  

#### How this is handled internally

An object is selected and behaves as selected when is on a canvas and is referenced on that canvas `_activeObject` property.  
A multi selection is represented by an `ActiveSelection` object, that is a special class derived from the `Group` class, referenced in the `_activeObject` property of the canvas.  
There is one active object at time and it is either an object or a multi selection.

#### Modify the selection programatically

Developers can create/destroy or change selection, outside of user mouse interactions in the following ways:  
`canvas.setActiveObject(object)` sets the object passed as argument as the active one. The current selected object gets discarded.  
`canvas.discardActiveObject()` Remove the current selection.  
`canvas.getActiveObject()` Returns a reference to the current active object.  
`canvas.getActiveObjects()` Returns an array containing a reference to the current selected objects, one or many.  
None of this methods render the canvas again, so you have to call `canvas.requestRenderAll` after them to see the changes. `canvas._setActiveObject()` and `canvas._discardActiveObject()` are two private method used from the non private ones to make the selection job. They do not contain the event firing code, and they are not chainable. if you need to handle a selection process but you do not want to fire the side effects you inserted in the selection events, you may try to use those.

#### Create a multi selection

```js
// rect1 and rect2 are 2 object on a canvas, canvas is the canvas instance
var selection = new fabric.ActiveSelection(\[rect1, rect2\], {
  canvas: canvas
});
canvas.setActiveObject(selection);
```
#### Add an object to a multi selection
```js
// rect1 and rect2 are 2 object on a canvas, grouped in a multi selection
// rect3 is another object on the canvas
var selection = canvas.getActiveObject();
if (selection.type === 'activeSelection') {
  selection.addWithUpdate(rect3)
}
```
So an object that is on a canvas can be an activeObject. Many object in a canvas can be grouped in an ActiveSelection object and behave like a multi seleciton. The objects inside the multi selection are still direct children of the canvas, and the ActiveSelection object, even if referenced in the `_activeObject` property of the canvas, **it is not included in the canvas objects**. canvas.getObjects() will not contain the ActiveSelection object. The active selection has a mandatory canvas property that has to be the actual canvas or it will not work.  
Future non breaking updates to fabric may simplify this aspect, changing the canvas property of the multi selection implictly in some method.  
A take away point is that the ActiveSelection is a service class that behaves in some predetermined way and that has little space for customization.

#### IMPORTANT

discardActiveObject on a multi selection triggers lot of side effects. If you are planning to do something with objects inside an active selection and reuse them, and then trash the activeSelection, **first discardActiveObject**, then do what you want to do with the objects, then in case select a new object.  

#### Removed methods

The following methods are no more available since the introduction of ActiveSelection:  

setActiveGroup(group)
getActiveGroup();
deactivateAll();
discardActiveGroup();
deactivateAllWithDispatch();

### How to react to user selection

Regarding selections fabric provides callbacks and events.  
Events fired by objects are:

selected
deselected

Events fired by canvas are:

selection:created
selection:updated
before:selection:cleared
selection:cleared
// deprecated
object:selected

For each object are available 2 callbacks

onDeselect
onSelect

Those callbacks are empty and meant to be overridden, and should not used to execute much logic, but just to return a boolean to cancel the current process depending on dynamic conditions for which mutating the properties of objects like selectable, evented or others, is not comfortable or anyway brings to weird code paths.

#### Firing events

Those events are meant to intercept user interaction with the selection of fabric.  
You should expect the canvas to fire `selection:created` every time the user pass from a situation of no selection to something selected. Each object involved in the seleciton process, one or more, by click or click and drag, will fire the `selected` event.  
When `selection:created` fires, it receives as first argument of the callback an object that contains property 'selected', with an array of all the selected fabric instances.  
When an user remove or add an object from the multiselection or switch from single to multi selection, or simply move the selection from the object A to the object B, the event `selection:updated` fires. The event receives as first argument of the callback an object that contains both 'selected' and 'deselected' property contaning an array of the objects that entered or exited the selection status. Each object involved in the process fires its own single event.  
Finally when an user destroy a multiple selection or deselect an object, the event `selection:cleared` fires, getting in arguments an object with the 'deselected' property.  
The event `object:selected` is considered deprecated and will be removed in the next major version of fabricjs.

#### Callbacks on multiple selection

The callbacks onSelect and onDeselect are not available yet on the click and drag selection or on the shift click selection and will be added as a feature as soon as branch 2.0 is ready.