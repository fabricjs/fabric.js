---
date: '2017-06-17'
description: 'Understanding what Fabric.js is in order to better use it in your projects'
title: Introduction to Fabric.js. Part 5
---

## Zoom and pan, introduction to Fabric.js part 5

We've covered so many topics in the previous series; from basic object manipulations to animations, events, filters, groups, and subclasses. But there's still couple of very interesting and useful things to discuss!

### Zoom and panning

Let's see how we can implement a basic system of zoom and pan with the mouse interactions. We will use the mouse wheel to zoom up to 20X ( 2000% ) on a canvas and a alt + click action to drag around.  
We start be hooking up the basic controls:

<canvas id="step1" width="400" height="400"></canvas>

```js
canvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.setZoom(zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
})
```    
<script>
var canvas = new fabric.Canvas('step1'); canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'blue', angle: 10 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'red', top: 44, left: 80 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'yellow', top: 80, left: 35 })) canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'purple', angle: -19, top: 70, left: 70 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'green', top: 110, left: 30 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'orange', top: 12, left: 100, angle: 30 })) canvas.on('mouse:wheel', function(opt) { var delta = opt.e.deltaY; var zoom = canvas.getZoom(); zoom *= 0.999 ** delta; if (zoom > 20) zoom = 20; if (zoom < 0.01) zoom = 0.01; canvas.setZoom(zoom); opt.e.preventDefault(); opt.e.stopPropagation(); })
</script>

This is a basic zoom control, limited between 1% and 2000%. we want now to add dragging of the canvas. We will use ALT + DRAG, but you can change to another combination. The idea is that a mousedown with alt will set a boolean to true, so that a mouse move event can then understand that is time for dragging.  
<canvas id="step2" width="400" height="400"></canvas>

```js
canvas.on('mouse:down', function(opt) {
  var evt = opt.e;
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
canvas.on('mouse:move', function(opt) {
  if (this.isDragging) {
    var e = opt.e;
    var vpt = this.viewportTransform;
    vpt[4] += e.clientX - this.lastPosX;
    vpt[5] += e.clientY - this.lastPosY;
    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});
canvas.on('mouse:up', function(opt) {
  // on mouse up we want to recalculate new interaction
  // for all objects, so we call setViewportTransform
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});
```
<script>
(function(){ var canvas = new fabric.Canvas('step2'); canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'blue', angle: 10 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'red', top: 44, left: 80 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'yellow', top: 80, left: 35 })) canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'purple', angle: -19, top: 70, left: 70 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'green', top: 110, left: 30 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'orange', top: 12, left: 100, angle: 30 })) canvas.on('mouse:wheel', function(opt) { var delta = opt.e.deltaY; var zoom = canvas.getZoom(); zoom *= 0.999 ** delta; if (zoom > 20) zoom = 20; if (zoom < 0.01) zoom = 0.01; canvas.setZoom(zoom); opt.e.preventDefault(); opt.e.stopPropagation(); }); canvas.on('mouse:down', function(opt) { var evt = opt.e; if (evt.altKey === true) { this.isDragging = true; this.selection = false; this.lastPosX = evt.clientX; this.lastPosY = evt.clientY; } }); canvas.on('mouse:move', function(opt) { if (this.isDragging) { var e = opt.e; var vpt = this.viewportTransform; vpt[4] += e.clientX - this.lastPosX; vpt[5] += e.clientY - this.lastPosY; this.requestRenderAll(); this.lastPosX = e.clientX; this.lastPosY = e.clientY; } }); canvas.on('mouse:up', function(opt) { this.setViewportTransform(this.viewportTransform); this.isDragging = false; this.selection = true; }); })()
</script>

Ok, this is a basic setup that will allow you to control zoom and panning. There are still a couple of possible enhancement.  
For example we can make the wheel-zoom to center the canvas around the point where the cursor is:  
<canvas id="step3" width="400" height="400"></canvas>

```js
canvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
```    
<script>
(function(){ var canvas = new fabric.Canvas('step3'); canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'blue', angle: 10 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'red', top: 44, left: 80 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'yellow', top: 80, left: 35 })) canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'purple', angle: -19, top: 70, left: 70 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'green', top: 110, left: 30 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'orange', top: 12, left: 100, angle: 30 })) canvas.on('mouse:wheel', function(opt) { var delta = opt.e.deltaY; var zoom = canvas.getZoom(); zoom *= 0.999 ** delta; if (zoom > 20) zoom = 20; if (zoom < 0.01) zoom = 0.01; canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom); opt.e.preventDefault(); opt.e.stopPropagation(); }); canvas.on('mouse:down', function(opt) { var evt = opt.e; if (evt.altKey === true) { this.isDragging = true; this.selection = false; this.lastPosX = evt.clientX; this.lastPosY = evt.clientY; } }); canvas.on('mouse:move', function(opt) { if (this.isDragging) { var e = opt.e; var vpt = this.viewportTransform; vpt[4] += e.clientX - this.lastPosX; vpt[5] += e.clientY - this.lastPosY; this.lastPosX = e.clientX; this.lastPosY = e.clientY; this.requestRenderAll(); } }); canvas.on('mouse:up', function(opt) { this.setViewportTransform(this.viewportTransform); this.isDragging = false; this.selection = true; }); })()
</script>

As a final touch we can limit the panning area to avoid view to go infinity in one direction. We stroke a rect of 1000x1000 pixels that will represent our panning area. And we add the code to limit the movements in that boundaries:
<canvas id="step4" width="400" height="400"></canvas>
```js
canvas.on('mouse:wheel', function(opt) {
var delta = opt.e.deltaY;
var zoom = canvas.getZoom();
zoom *= 0.999 ** delta;
if (zoom > 20) zoom = 20;
if (zoom < 0.01) zoom = 0.01;
canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
opt.e.preventDefault();
opt.e.stopPropagation();
var vpt = this.viewportTransform;
if (zoom < 400 / 1000) {
  vpt[4] = 200 - 1000 * zoom / 2;
  vpt[5] = 200 - 1000 * zoom / 2;
} else {
  if (vpt[4] >= 0) {
    vpt[4] = 0;
  } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
    vpt[4] = canvas.getWidth() - 1000 * zoom;
  }
  if (vpt[5] >= 0) {
    vpt[5] = 0;
  } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
    vpt[5] = canvas.getHeight() - 1000 * zoom;
  }
})
```
<script>
(function(){ var canvas = new fabric.Canvas('step4'); var bg = new fabric.Rect({ width: 990, height: 990, stroke: 'pink', strokeWidth: 10, fill: '', evented: false, selectable: false }); bg.fill = new fabric.Pattern({ source: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAASElEQVQ4y2NkYGD4z0A6+M3AwMBKrGJWBgYGZiibEQ0zIInDaCaoelYyHYcX/GeitomjBo4aOGrgQBj4b7RwGFwGsjAwMDAAAD2/BjgezgsZAAAAAElFTkSuQmCC' }, function() { bg.dirty = true; canvas.requestRenderAll() }); bg.canvas = canvas; canvas.backgroundImage = bg; canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'blue', angle: 10 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'red', top: 44, left: 80 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'yellow', top: 80, left: 35 })) canvas.add(new fabric.Rect({ width: 50, height: 50, fill: 'purple', angle: -19, top: 70, left: 70 })) canvas.add(new fabric.Circle({ radius: 50, fill: 'green', top: 110, left: 30 })) canvas.add(new fabric.Ellipse({ rx: 50, ry: 10, fill: 'orange', top: 12, left: 100, angle: 30 })) canvas.on('mouse:wheel', function(opt) { var delta = opt.e.deltaY; var zoom = canvas.getZoom(); zoom *= 0.999 ** delta; if (zoom > 20) zoom = 20; if (zoom < 0.01) zoom = 0.01; canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom); opt.e.preventDefault(); opt.e.stopPropagation(); var vpt = this.viewportTransform; if (zoom < 0.4) { vpt[4] = 200 - 1000 * zoom / 2; vpt[5] = 200 - 1000 * zoom / 2; } else { if (vpt[4] >= 0) { vpt[4] = 0; } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) { vpt[4] = canvas.getWidth() - 1000 * zoom; } if (vpt[5] >= 0) { vpt[5] = 0; } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) { vpt[5] = canvas.getHeight() - 1000 * zoom; } } }); canvas.on('mouse:down', function(opt) { var evt = opt.e; if (evt.altKey === true) { this.isDragging = true; this.selection = false; this.lastPosX = evt.clientX; this.lastPosY = evt.clientY; } }); canvas.on('mouse:move', function(opt) { if (this.isDragging) { var e = opt.e; var zoom = canvas.getZoom(); var vpt = this.viewportTransform; if (zoom < 0.4) { vpt[4] = 200 - 1000 * zoom / 2; vpt[5] = 200 - 1000 * zoom / 2; } else { vpt[4] += e.clientX - this.lastPosX; vpt[5] += e.clientY - this.lastPosY; if (vpt[4] >= 0) { vpt[4] = 0; } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) { vpt[4] = canvas.getWidth() - 1000 * zoom; } if (vpt[5] >= 0) { vpt[5] = 0; } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) { vpt[5] = canvas.getHeight() - 1000 * zoom; } } this.requestRenderAll(); this.lastPosX = e.clientX; this.lastPosY = e.clientY; } }); canvas.on('mouse:up', function(opt) { this.setViewportTransform(this.viewportTransform); this.isDragging = false; this.selection = true; }); })()
</script>