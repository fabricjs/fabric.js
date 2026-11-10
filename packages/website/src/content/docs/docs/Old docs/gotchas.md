---
date: '2019-08-26'
description: 'A list of common issues with fabricJS'
title: Frequent issues / gotchas
---

This page contains a list of the most common issues opened by people approaching fabricJS for the first time. Those pitfalls are caused both from the lack of clear explanations and non perfect docs. Here we try to address the common issues.

### Objects are no more selectable - setCoords

Fabric mantains 2 sets of coordinates to quickly know where an object is on the canvas. Those are linked to 2 objects properties, oCoords and aCoords.  
Those coordinates are updated by fabricJS automatically when an user interact with objects corners or ends a transformation, a drag for example. In all the other cases is the developer that has to call `Object.setCoords()` in order to have the object recognized in the rendered position.  
The most commmon Symptom is an object not being selectable. This happens after the dev changed by code the top/left or the scale or the canvas viewport. After those operations, that same code should call `setCoords()` eventually on all objects.

```js
  function repositionRect(x, y) {
    rect.left = x;
    rect.top = y;
    rect.setCoords();
  }
```

### Wrong position after reloading a JSON object - NUM_FRACTION_DIGITS

Fabric can serialize and deserialize objects in a plain object format.  
When dealing with serialization, floats can be a problem and give long strings with an unnecessary quantity of decimals. This blows up the string size.  
To reduce that, there is a constant defined on the Object called `NUM_FRACTION_DIGITS`, historically set to 2. That means that a top value of `3.454534413123` is saved as `3.45`, same for scale, width, height. This is mostly fine unless you are dealing without situation where precision matter.  
To make an example, a very large image, can be scaled down to a small size using a scale of `0.0151`.  
In this case a serialization would save it as `0.02` changing meaningully the scale. If you are facing such situations, in your project set the constant higher: `fabric.Object.NUM_FRACTION_DIGITS = 8` to have 8 decimals on properties.  
This affects SVG export too.

### Objects misbehave when dealing with text input - numbers vs strings

Sometimes in prototypes and quick proof of concepts, people change fabric objects properties with text inputs.  
Fabric documentation states that top, left, scaleX, angle and other properties requires numbers as values.  
**Text inputs return strings.** Fabric.js does not check types and does not convert them, when it does convert a string to a number is because of a side effect of some code and is not a feature to rely on.  
Use parseInt and parseFloat before assigning a value to a property that requires a number.

### Object does not update after changing property - objectCaching

A common source of confusion is when a developer assigns a new property to fill and the objects does not update after a renderAll.  
Fabric.js does cache objects as images to speed up rendering. If you want fabricJS to know that something changed and that a particular object needs to be redrawn, use the `set` method.

```ts
  rect.set('fill', 'red');
  canvas.requestRenderAll();
```
or, as an alternative:

```ts
  rect.fill = 'red';
  rect.stroke = 'blue';
  rect.set('dirty', true);
```
For more information and detailed explanation, check the [dedicated caching page](/docs/old-docs/fabric-object-caching/).


### Objects have a transparent stroke of width 1 by default

By default, objects have a transparent stroke of width 1 that shift their bounding box by 0.5 pixel horizontally and vertically from the fill.

This is not apparent if you work with rect that have sizes of 200-300 and above, but when dealing with small rectangle this gap is clear and when streching the rectangle in one direction only is even more evident.

This gap is the stroke, the border that is being drawn transparent.

There are a couple of reason for this:
- if it had no strokeWidth, setting stroke color would bring no results
- SVG have the same default so for svg import it made sense to do so
- Before fabric v1.5 stroke wasn't part of the control bounding box and position so this wasn't an issue.

To remove the stroke:

```js
rect.set('strokeWidth', 0);
```

### Blurry Objects - retinaScaling

All objects need a reference of `fabric.Canvas` for proper rendering. Without the reference objects can't access the retina scaling value ([device pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio#correcting_resolution_in_a_canvas)), resulting in bad resolution. This usually happens when an object is a child of a custom object. Fix it by using the parent's `_set` method.  

To reference canvas:

```ts
fabric.MyCustomObject = fabric.util.createClass(fabric.Object, {
  _set(key, value){
    // this is a good place to pass down options to children
    this.callSuper('_set', key, value);
    //  set canvas on nested object
    key === 'canvas' && this._nestedObject._set(key, value);
  }
});
```
### Object.clone vs util.object.clone

`fabric.Object` has a `clone` method for creating copy of an instance. The subclasses of `fabric.Object` inherits this method and it can be used for replicating shapes in canvas.  
There is also a static method `clone` in `fabric.util.object`, which is for creating copy of any object. It has an extra handling for copying fabricJS objects and is mostly for internal use. This method should be avoided for purpose of duplicating objects in canvas.