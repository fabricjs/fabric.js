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
