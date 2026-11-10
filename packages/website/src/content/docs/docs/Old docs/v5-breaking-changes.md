---
date: '2022-02-01'
description: A list of breaking changes from v4 to v5
title: Upgrade to fabric 5.x
---

First of all the minimum node version now supported is 14.
JSDOM will work with 12, and that was the reason to change, but we felt like pushing for 14 at least was the right thing to do.

In fabricJS 4.x there were some deprecated methods and functions kept for backward compatibility.

### Circle startAngle and endAngle

Let's start with the worst change: `Circle.startAngle` and `Circle.endAngle` are now in degree and no more in radians, fo consistency reason.

It invalidates all old design that uses circles and that were exported with default values included.

This is a wild disruptive change, all the others are fairly trivial and should not create any issue, if not with projects that used custom functionalities and overrides.

#### What to do

Well here is tricky, you need to attach a reviver when you import your JSON data or override the fromObject of circle to maintain compatibility.

```js
myCanvas.loadFromJSON(data,
  // callback, usually a re-render and some specific app code
  () => { myCanvas.requestRenderAll() },
  // the reviver
  (data, instance, error) => {
    // detect that version is less than 5
    if (parseInt(data.version.slice(0, 1), 10) < 5) {
      instance.startAngle = fabric.util.radiansToDegrees(data.startAngle);
      instance.endAngle = fabric.util.radiansToDegrees(data.endAngle);
    }
  },
);
```


### Transform event removed
Those events are gone:
```
* @fires object:rotated at the end of a rotation transform
* @fires object:scaled at the end of a scale transform
* @fires object:moved at the end of translation transform
* @fires object:skewed at the end of a skew transform
```
Those events were a leftover of the control logic of 3.x and before.
Do not confuse those with scaling ,rotating, moving, skewing. Those were fired at the end of a transform when some of those action occured.
See them as an extra layer detail on top of `object:modified`.

As a side effect of this change, the canvas method `_addEventOptions`, private and deprecated, has been removed.
The sole purpose of this method was to support this functionality.

#### What to do
If you need this information, you can check in the event `object:modified` for the action property
```js
myRect.on('modified', (opt) => {
  // inspect action and check if the value is what you are looking for
  const action = opt.action;
});
```

### Selection events properties

Events like `selection:updated` and `selection:created` do not have anymore the following properties:
- updated
- target

Those were compatibility properties left after the removal of the old events.
Those properties referenced a fabric.Object.

#### What to do

In the same events you can look at selected and deselected properties that contains an array of events.
The first item of those array is what was referenced on those properties.

### Removal of deprecated methods

`Object.calcCoords` and `Object._calcDimensionsTransformMatrix`, `group.realizeTransform` are gone.
Since we introduced different sets of coordiantes, aCoords and oCoords, the generic method calcCoords wasn't really useful anymore. It wasn't used internally anymore and was left to don't disruput version 4.
In the future we hope to have only aCoords.

`Object._calcDimensionsTransformMatrix` was handling a specific case of some transformation for the bounding boxes.
Some time ago we introduced a generic utility that can do the same, `calcDimensionsMatrix`.
`_calcDimensionsTransformMatrix` was deprecated and was calling `calcDimensionsMatrix` with the following parameters:

```js
_calcDimensionsTransformMatrix: function(skewX, skewY, flipping) {
  return util.calcDimensionsMatrix({
    skewX: skewX,
    skewY: skewY,
    scaleX: this.scaleX * (flipping && this.flipX ? -1 : 1),
    scaleY: this.scaleY * (flipping && this.flipY ? -1 : 1)
  });
}
```

Similar situation for `group.realizeTransform`, unused in fabricJS, and not providing any functionality on top of the generic util it was calling

```js
realizeTransform: function(object, parentMatrix) {
  fabric.util.addTransformToObject(
    object,
    parentMatrix || this.calcTransformMatrix()
  );
  return object;
},
```

#### What to do

for calcCoords, just call either calcACoords or calcOCoords when you need it.
for _calcDimensionsTransformMatrix and realizeTransform, call the utility as shown in the snippet.


### Paths utilis removed

Since the path semplification happened in v4.x the following utils were't usend anymore and kept for compatibility: `utils.getBoundsOfArc`, `utils.drawArc`, `utils.fromArcToBeizers`, `utils.drawDashedLine`
Those utils are now removed.

#### What to do

`drawDashedLine`, `getBoundsOfArc` and `drawArc` are removed, if you really need them, you need to copy them back in your code and maintain yourself.
The interesting part `utils.fromArcToBeizers` is still available in fabricJS for internal use and if you need to you use it, you need to expose it on your own.