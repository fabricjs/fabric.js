**Version 1.3.0**

- [BACK_INCOMPAT] Remove selectable, hasControls, hasBorders, hasRotatingPoint, transparentCorners, perPixelTargetFind from default object/json representation of objects.

- [BACK_INCOMPAT] Object rotation now happens around originX/originY point UNLESS `centerTransform=true`.

- [BACK_INCOMPAT] fabric.Text#textShadow has been removed - new fabric.Text.shadow property (type of fabric.Shadow).

- [BACK_INCOMPAT] fabric.BaseBrush shadow properties are combined into one property => fabric.BaseBrush.shadow (shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY no longer exist).

- [BACK_INCOMPAT] `fabric.Path.fromObject` is now async. `fabric.Canvas#loadFromDatalessJSON` is deprecated.

**Version 1.2.0**

- [BACK_INCOMPAT] Make `fabric.Object#toDataURL` synchronous.

- [BACK_INCOMPAT] `fabric.Text#strokeStyle` -> `fabric.Text#stroke`, for consistency with other objects.

- [BACK_INCOMPAT] `fabric.Object.setActive(…)` -> `fabric.Object.set('active', …)`.
                `fabric.Object.isActive` is gone (use `fabric.Object.active` instead)

- [BACK_INCOMPAT] `fabric.Group#objects` -> `fabric.Group._objects`.

**Version 1.1.0**

- [BACK_INCOMPAT] `fabric.Text#setFontsize` becomes `fabric.Object#setFontSize`.

- [BACK_INCOMPAT] `fabric.Canvas.toDataURL` now accepts options object instead linear arguments.
                `fabric.Canvas.toDataURLWithMultiplier` is deprecated;
                use `fabric.Canvas.toDataURL({ multiplier: … })` instead

**Version 1.0.0**
