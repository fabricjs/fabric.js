---
date: '2020-07-10'
description: A list of breaking changes from v3 to v4
title: Upgrade to fabric 4.x
---

`Canvas.uniScaleTransform` has been removed, `Canvas.uniformScaling` has been added.
The property was poorly named, and its purpose was unclear.
If `uniformScaling` is true, objects get scaled proportionally, if uniscaleKey is pressed, the behaviour get swapped. From true to false or from false to true. `Canvas.uniscaleKey` is the key that swaps the value of `Canvas.uniformScaling`.

`Object.lockUniScaling` has been removed. It was unclear how it should have interacted with the old `Canvas.uniformScaling` and the `uniscaleKey`.

`Object.hasRotatingPoint` has been removed. If you do not want an object to have the rotating control, set it to invisible or make a control set that does not have the control at all.

`Object.rotatingPointOffset` has been removed. You can now tweak the `offsetY` property of the `mtr` control of the standard control set, or of any other control.

The function `Canvas.onBeforeScaleRotate` has been removed. Please subscribe to `Canvas.on('before:transform')` and move your code to the callback.

`Object.setShadow` and `BaseBrush.setShadow` have been removed. Please use:
```js
// before
Object.setShadow(options);

// after
Object.set('shadow', new fabric.Shadow(options));
// or
Object.shadow = new fabric.Shadow(options);
```

Similarly `Object.setGradient` has been removed. Please use:

```js
// before
Object.setGradient(options);

// after
Object.set('fill', new fabric.Gradient(otherOptions));
Object.set('stroke', new fabric.Gradient(otherOptions));

// or
Object.fill = new fabric.Gradient(otherOptions));
Object.stroke = new fabric.Gradient(otherOptions));

// the old setGradient function had a different option format.
// as a recap, let's show the correct gradient options here:
{
  type: 'linear',
  gradientUnits: 'pixels', // or 'percentage'
  coords: { x1: 0, y1: 0, x2: 50, y2: 0 },
  colorStops:[
    { offset: 0, color: 'red' },
    { offset: 1, color: 'green'}
  ]
}
```

The options format is slightly different, but since the introduction of percentage values for gradients,
writing a gradient for an object is easier and it does not make sense to maintain examples and code for 2 different way of doing the exact same thing.

For the same reason, the following methods have also been removed:
`Object.setPatternFill` changes to  `Object.set('fill', new fabric.Pattern(options))`;
`Object.setColor` changes to `Object.set('fill', color)`;


Although `Object.transformMatrix` was deprecated in version 2, the rendering of it was kept until now. It is now completely ignored.

Removed the `object:selected` event. Use `selection:created`. In the callback you will still find  `target` in the options, but you will also find `selected` which contains all of the objects selected during that single event.


`Gradient.forObject` has been removed. The new Gradient with relative coordinates introduced in version 3 makes this method no longer useful.


`Object.clipTo` and `Canvas.clipTo` have been removed. While clipTo was a notch faster and sharper than clipPath, it was difficult to serialize and also nested clipTo were not possible at all. In future, clipPath will be improved to make it sharper.

`Canvas.loadFromDatalessJSON` has been removed. It was just an alias for `loadFromJSON`.

In the observable mixin, `observe`, `stopObserving`, `trigger` have been removed. You can keep using `on`, `off`, and `fire` since they are shorter and often referred to in our documentation.

Removed the ability for `Object.set` to take a function as a value. It was a rather unusual and non-standard use case.

Removed `fabric.util.customTransformMatrix` Use the replacement `fabric.util.composeMatrix`

Removed 2 utils members that were not used anywhere: `fabric.util.getScript` and `fabric.util.getElementStyle`

Removed private member `Canvas._setImageSmoothing`. Added `fabric.util.setImageSmoothing(ctx, value)` to replace it. Now it is used by `fabric.Canvas` and `fabric.Image`, but still considered private, so not useful for the developer.

Removed  `Image.setCrossOrigin`. Having the property `crossOrigin` on the `fabric.Image` class was misleading and prone to errors. `crossOrigin` is for loading/reloading of image resources, and must be specified at each load.