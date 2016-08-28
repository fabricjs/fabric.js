**Version 1.6.4**

- Improvement: Ignore svg: namespace during svg import. [#3081](https://github.com/kangax/fabric.js/pull/3081)
- Improvement: Better fix for lineHeight of iText/Text [#3094](https://github.com/kangax/fabric.js/pull/3094)
- Improvement: Support for gradient with 'Infinity' coordinates [#3082](https://github.com/kangax/fabric.js/pull/3082)
- Improvement: Generally "improved" logic of targeting [#3111](https://github.com/kangax/fabric.js/pull/3111)
- Fix: Selection of active group with transparency and preserveObjectStacking true or false [#3109](https://github.com/kangax/fabric.js/pull/3109)
- Fix: pattern brush now create the same pattern seen while drawing [#3112](https://github.com/kangax/fabric.js/pull/3112)
- Fix: Allow css merge during svg import [#3114](https://github.com/kangax/fabric.js/pull/3114)
- Improvement: added numeric origins handling fomr 0 to 1. [#3121](https://github.com/kangax/fabric.js/pull/3121)
- Fix: Fix a defect with shadow of objects in a scaled group. [#3134](https://github.com/kangax/fabric.js/pull/3134)
- Improvement: Do not fire unecessary selection:changed events. [#3119](https://github.com/kangax/fabric.js/pull/3119)
- Fix: Attached hiddenTextarea to body fixes IE, thanks to @plainview. [#3137](https://github.com/kangax/fabric.js/pull/3137)
- Fix: Shift unselect activegroup on transformed canvas. [#3144](https://github.com/kangax/fabric.js/pull/3144)
- Added: ColorMatrix filter [#3139](https://github.com/kangax/fabric.js/pull/3139)
- Fix: Fix condition in wich restoring from Object could cause object overwriting [#3146](https://github.com/kangax/fabric.js/pull/3146)
- Change: cloneAsImage for Object and toDataUrl for object are not retina enabled by default. Added option to enable. [#3147](https://github.com/kangax/fabric.js/pull/3147)
- Improvement: Added textSpacing support for text/itext/textbox [#3097](https://github.com/kangax/fabric.js/pull/3097)
- Fix: Quote font family when setting the context fontstyle [#3191](https://github.com/kangax/fabric.js/pull/3191)
- Fix: use getSrc during image export, make subclassing easier, return eventually the .src property if nothing else is available [#3189](https://github.com/kangax/fabric.js/pull/3189)
- Fix: Inverted the meaning of border scale factor [#3154](https://github.com/kangax/fabric.js/pull/3154)
- Improvement: Added support for RGBA in HEX notation. [#3202](https://github.com/kangax/fabric.js/pull/3202)
- Improvement: Added object deselected event. [#3195](https://github.com/kangax/fabric.js/pull/3195)
- Fix: loadFromJson callback now gets fired after filter are applied [#3210](https://github.com/kangax/fabric.js/pull/3210)

**Version 1.6.3**

- Improvement: Use reviver callback for background and overlay image when doing svg export. [#2975](https://github.com/kangax/fabric.js/pull/2975)
- Improvement: Added object property excludeFromExport to avoid exporting the object to JSON or to SVG. [#2976](https://github.com/kangax/fabric.js/pull/2976)
- Improvement: Correct the calculation of text boundingbox. Improves svg import [#2992](https://github.com/kangax/fabric.js/pull/2992)
- Added: Export id property to SVG [#2993](https://github.com/kangax/fabric.js/pull/2993)
- Improvement: Call the callback on loadSvgFromURL on failed xml load with null agument [#2994](https://github.com/kangax/fabric.js/pull/2994)
- Improvement: Clear only the Itext area on contextTop during cursor animation [#2996](https://github.com/kangax/fabric.js/pull/2996)
- Added: Char widths cache has been moved to fabric level and not iText level. Added fabric.util.clearFabricCharWidthsCache(fontName) [#2995](https://github.com/kangax/fabric.js/pull/2995)
- Fix: do not set background or overlay image if the url load fails. [#3003](https://github.com/kangax/fabric.js/pull/3003)
- Fix: iText mousemove event removal, clear the correct area for Itext, stopped redrawing selection if not necessary [#3016](https://github.com/kangax/fabric.js/pull/3016)
- Fix: background image and overlay image scale and move with canvas viewportTransform, parameter available [#3019](https://github.com/kangax/fabric.js/pull/3019)
- Added: support sub targeting in groups in events [#2997](https://github.com/kangax/fabric.js/pull/2997)
- Fix: Select transparent object on mouse up because of _maybeGroupObject [#2997](https://github.com/kangax/fabric.js/pull/2997)
- Fix: Remove reference to lastRenderedObject on canvas.remove [#3023](https://github.com/kangax/fabric.js/pull/3023)
- Fix: Wait for all objects to be loaded before deleting the properties and setting options. [#3029](https://github.com/kangax/fabric.js/pull/3029)
- Fix: Object Padding is unaffected by object transform. [#3057](https://github.com/kangax/fabric.js/pull/3057)
- Fix: Restore lastRenderedObject usage. Introduced Canvas.lastRenderedKey to retrieve the lastRendered object from down the stack [#3057](https://github.com/kangax/fabric.js/pull/3057)
- Fix: _calcTextareaPosition correctly calculate the position considering the viewportTransform. [#3057](https://github.com/kangax/fabric.js/pull/3057)
- Fix: Fixed selectionBacgroundColor with viewport transform. [#3057](https://github.com/kangax/fabric.js/pull/3057)
- Improvement: Correctly render the cursor with viewport scaling, improved the cursor centering. [#3057](https://github.com/kangax/fabric.js/pull/3057)
- Fix: Use canvas zoom and pan when using is target transparent. [#2980](https://github.com/kangax/fabric.js/pull/2980)

**Version 1.6.2**

- Fix: restore canvas properties on loadFromJSON with includeProperties. [#2921](https://github.com/kangax/fabric.js/pull/2921)
- Fix: Allow hoverCursor on non selectable objects, moveCursor does not appear if the object is not moveable.
Added object.moveCursor to specify a cursor for moving per object. [#2924](https://github.com/kangax/fabric.js/pull/2924)
- Fix: Add missing stroke.live translation, allow gradientTransform for dashed line. [#2926](https://github.com/kangax/fabric.js/pull/2926)
- Improvement: Allow customization of keys that iteract with mouse action ( multiselect key, free tranform key, alternative action key, centered transform key ) [#2925](https://github.com/kangax/fabric.js/pull/2925)
- Added: Make iText fires object:modified on text change on exit editing [#2927](https://github.com/kangax/fabric.js/pull/2927)
- Added: [control customization part 1] cornerDashArray, borderDashArray. Now borderScaleFactor influences both border and controls, changed default corner size to 13 [#2932](https://github.com/kangax/fabric.js/pull/2932)
- Fix: createSVGFontFacesMarkup was failing to retrieve fonts in style [#2935](https://github.com/kangax/fabric.js/pull/2935)
- Fix: shadow not scaled with dataUrl to multiplier [#2940](https://github.com/kangax/fabric.js/pull/2940)
- Added: [control customization part 2] cornerStrokeColor. Now is possible to specify separate stroke and fill color for the controls [#2933](https://github.com/kangax/fabric.js/pull/2933)
- Fix: Itext width calculation with caching false was returning nan. [#2943](https://github.com/kangax/fabric.js/pull/2943)
- Added: [control customization part 3] Rounded corners. It is possible to specify cornerStyle for the object. 'rect' or 'circle' [#2942](https://github.com/kangax/fabric.js/pull/2942)
- Added: [control customization part 4] Selection background. It is possible to specify selectionBackgroundColor for the object. [#2950](https://github.com/kangax/fabric.js/pull/2950)
- Fix: Behaviour of image with filters with resize effects and Object to/from json [#2954](https://github.com/kangax/fabric.js/pull/2954)
- Fix: Svg export should not output color notation in rgba format [#2955](https://github.com/kangax/fabric.js/pull/2955)
- Fix: minScaleLimit rounding bug [#2964](https://github.com/kangax/fabric.js/pull/2964)
- Fix: Itext spacing in justify mode bug [#2971](https://github.com/kangax/fabric.js/pull/2971)
- Fix: Object.toDataUrl export when some window.devicepixelRatio is present (retina or browser zoom) [#2972](https://github.com/kangax/fabric.js/pull/2972)


**Version 1.6.1**

- Fix: image with broken element throwing error on toObject() [#2878](https://github.com/kangax/fabric.js/pull/2878)
- Fix: Warning on trying to set proprietary browser version of ctxImageSmoothingEnabled [#2880](https://github.com/kangax/fabric.js/pull/2880)
- Fix: Fixed Svg import regression on color and drawing polylines [#2887](https://github.com/kangax/fabric.js/pull/2887)
- Fix: Fixed animation ease that starts and stop at same value [#2888](https://github.com/kangax/fabric.js/pull/2888)
- Fix: Allow a not stateful canvas to fire object:modified at end of transform. [#2890](https://github.com/kangax/fabric.js/pull/2890)
- Fix: Made event handler removal safer. Removing firing events will not cause errors. [#2883](https://github.com/kangax/fabric.js/pull/2883)
- Fix: Proper handling of perPixelTargetFind and multi selections [#2894](https://github.com/kangax/fabric.js/pull/2894)
- Fix: Do not clear contextTop on drawingMode, to allow drawing over animations [#2895](https://github.com/kangax/fabric.js/pull/2895)
- Change the dependencies to optional. Allow npm to continue installing if nodecanvas installation fail.[#2901](https://github.com/kangax/fabric.js/pull/2901)
- Fix: Check again the target on mouseup [#2902](https://github.com/kangax/fabric.js/pull/2902)
- Fix: On perPixelTargetFind detect corners only if target is active [#2903](https://github.com/kangax/fabric.js/pull/2903)
- Improvement: Add canvas mouseout event listener [#2907](https://github.com/kangax/fabric.js/pull/2907)
- Improvement: Make small object draggable easier [#2907](https://github.com/kangax/fabric.js/pull/2907)
- Improvement: Use sendToBack, bringToFront, bringForward, sendBackwards for multiple selections [#2908](https://github.com/kangax/fabric.js/pull/2908)

**Version 1.6.0**

- Fix rendering of activeGroup objects while preserveObjectStacking is active. [ regression from [#2083](https://github.com/kangax/fabric.js/pull/2083) ]
- Fix `fabric.Path` initialize with user options [#2117](https://github.com/kangax/fabric.js/pull/2117)
- Fix sorting of objects in activeGroup during rendering [#2130](https://github.com/kangax/fabric.js/pull/2130).
- Make sure that 'object.canvas' property is always set if the object is directly or indirectly on canvas [#2141](https://github.com/kangax/fabric.js/pull/2141)
- Fix _getTopLeftCoords function that was returning TopCenter [#2127](https://github.com/kangax/fabric.js/pull/2127)
- Fix events not being fired after resize with pinch zoom [#510](https://github.com/kangax/fabric.js/pull/510)
- Fix mouse:over, mouse:out events not receiving event object [#2146](https://github.com/kangax/fabric.js/pull/2146)
- Don't include elements from `<metadata>` during SVG parsing [#2160](https://github.com/kangax/fabric.js/pull/2160)
- Fix some iText new glitches and old bugs about style deleting and inserting, faster function for get2dCursorLocation [#2153](https://github.com/kangax/fabric.js/pull/2153)
- Change bounding box calculation, made strokewidth always considered in dimensions. Switched group stroke default to 0 strokewidth. [#2155](https://github.com/kangax/fabric.js/pull/2155)
- Fix scaling function for object with strokewidth [#2178](https://github.com/kangax/fabric.js/pull/2178)
- Fix image fromObject restoring resizeFilter [#2164](https://github.com/kangax/fabric.js/pull/2164)
- Fix double application of filter upon image init [#2164](https://github.com/kangax/fabric.js/pull/2164)
- Fix image.filter.Resize toObject and fromObject [#2164](https://github.com/kangax/fabric.js/pull/2164)
- Fix strokeWidth calculation during resize operations [#2178](https://github.com/kangax/fabric.js/pull/2178)
- Fix iText selection on upperCanvas to support transformMatrix [#2173](https://github.com/kangax/fabric.js/pull/2173)
- Removed unnecessary calls to removeShadow and restoreGlobalCompositeOperation  [#2175](https://github.com/kangax/fabric.js/pull/2175)
- Fix the offset for pattern and gradients filling and stroking in text [#2183](https://github.com/kangax/fabric.js/pull/2183)
- Fix loading of stroke gradients from Object [#2182](https://github.com/kangax/fabric.js/pull/2182)
- Fix segmentation fault on node.js when image doesn't exist [#2193](https://github.com/kangax/fabric.js/pull/2193)
- Fix iText border selection when changing fontWeight [#2201](https://github.com/kangax/fabric.js/pull/2201)
- Fix calculation of object dimensions for geometry functions translation and scaling. [#2206](https://github.com/kangax/fabric.js/pull/2206)
- Fix iText cursor position on click at end of line [#2217](https://github.com/kangax/fabric.js/pull/2217)
- Fix error on parsing style string with trailing spaces [#2256](https://github.com/kangax/fabric.js/pull/2256)
- Fix delegated properties leaking on objects in a group when restoring from json [#2101](https://github.com/kangax/fabric.js/pull/2101)
- Fix cursor click position in rotated i-Text when origins different from TOPLEFT. [#2269](https://github.com/kangax/fabric.js/pull/2269)
- Fix mouse position when the canvas is in a complex style scrolling situation [#2128](https://github.com/kangax/fabric.js/pull/2128)
- Fix parser regex for not parsing svg tags attribute [#2311](https://github.com/kangax/fabric.js/pull/2311)
- Add id attribute to standard attribute parsing from SVG elements [#2317](https://github.com/kangax/fabric.js/pull/2317)
- Fix text decoration opacity [#2310](https://github.com/kangax/fabric.js/pull/2310)
- Add simple color animation utility in /src/util/animate_color.js [#2328](https://github.com/kangax/fabric.js/pull/2328)
- Fix itext paste function to check for source of copied text and strip carriage returns (\r)[#2336](https://github.com/kangax/fabric.js/pull/2336)
- Fix pattern class serialize the source using toDataURL if available [#2335](https://github.com/kangax/fabric.js/pull/2335)
- Fix imageSmoothingEnabled warning on chrome and reinit the property after setDimensions [#2337](https://github.com/kangax/fabric.js/pull/2337)
- Add ability to parse path elements with no path specified. [#2344](https://github.com/kangax/fabric.js/pull/2344)
- Fix shiftClick with activeGroup in case of normal and scaled groups [#2342](https://github.com/kangax/fabric.js/pull/2342)
- Add support for colors in shadow svg export [#2349](https://github.com/kangax/fabric.js/pull/2349)
- Add support for inner viewBoxes in svg parsing [#2345](https://github.com/kangax/fabric.js/pull/2345)
- Fix BoundingBox calculation for pathGroups that have inner transformMatrix [#2348](https://github.com/kangax/fabric.js/pull/2348)
- Fix export toObject to include transformMatrix property [#2350](https://github.com/kangax/fabric.js/pull/2350)
- Fix textbox class to supporto toSVG() and newest style fixes [#2347]
(https://github.com/kangax/fabric.js/pull/2347)
- Fix regression on text ( textDecoration and textlinebackground ) [#2354](https://github.com/kangax/fabric.js/pull/2354)
- Add support for multi keys chars using onInput event [#2352](https://github.com/kangax/fabric.js/pull/2352)
- Fix iText and textbox entering in edit mode if clicked on a corner [#2393](https://github.com/kangax/fabric.js/pull/2393)
- Fix iText styles error when in justify align [#2370](https://github.com/kangax/fabric.js/pull/2370)
- Add support for shadow export in svg for groups, pathgroups and images. [#2364]
- Add rendering shadows for groups [#2364](https://github.com/kangax/fabric.js/pull/2364)
- Add support for parsing nested SVGs  x and y attributes [#2399](https://github.com/kangax/fabric.js/pull/2399)
- Add support for gradientTransform in setGradient(fill or stroke) [#2401](https://github.com/kangax/fabric.js/pull/2401)
- Fix Error in svg parsed that was stopping on gradient color-stop missing stop attribute [#2414](https://github.com/kangax/fabric.js/pull/2414)
- toObject method return copied arrays for array like properties [#2407](https://github.com/kangax/fabric.js/pull/2407)
- Fix Set stop value of colorstop to 0 if stop attribute not present [#2414](https://github.com/kangax/fabric.js/pull/2414)
- Fix correct value of e.button for mouse left click if e.which not supported[#2453](https://github.com/kangax/fabric.js/pull/2453)
- Add check for host property in getScrollTopLeft[#2462](https://github.com/kangax/fabric.js/pull/2462)
- Fix check for object.selectable in findTarget[#2466](https://github.com/kangax/fabric.js/pull/2466)
- Fix After rendering a gesture set originX/Y to its original value[#2479](https://github.com/kangax/fabric.js/pull/2479)
- Add support for skewing objects using shift and m-controls in interactive mode, and using object.skewX/Y [#2482](https://github.com/kangax/fabric.js/pull/2482)
- Fix gradientTransform not exported in gradient toObject [#2486](https://github.com/kangax/fabric.js/pull/2486)
- Fix object.toDataUrl with multiplier [#2487](https://github.com/kangax/fabric.js/pull/2487)
BACK INCOMPATIBILITY: removed 'allOnTop' parameter from fabric.StaticCanvas.renderAll.
- Fix mask filter, mask image is now streched on all image [#2543](https://github.com/kangax/fabric.js/pull/2543)
- Fix text onInput event to behave correctly if some text is selected [#2501](https://github.com/kangax/fabric.js/pull/2502)
- Fix object with selectable = false could be selected with shift click [#2503](https://github.com/kangax/fabric.js/pull/2503)
- Fix for mask filter when bigger or smaller image is used [#2534](https://github.com/kangax/fabric.js/pull/2534)
- Improvement: simplified renderAll logic [#2545](https://github.com/kangax/fabric.js/pull/2545)
- Improvement: Manage group transformation with skew rotate and scale [#2549](https://github.com/kangax/fabric.js/pull/2549)
- Fix: Add shadow affectStroke to shadow to Object method [#2568](https://github.com/kangax/fabric.js/pull/2568)
- Fix: Made multitouch pinch resize works with skewed object [#2625](https://github.com/kangax/fabric.js/pull/2625)
- Improvement: Added retina screen support [#2623](https://github.com/kangax/fabric.js/pull/2623)
- Change: Set default Image strokeWidth to 0 to improve image rendering [#2624](https://github.com/kangax/fabric.js/pull/2624)
- Fix: multitouch zoom gesture speed back to normal speed [#2625](https://github.com/kangax/fabric.js/pull/2625)
- Fix: fix controls rendering with retina scaling and controls above overlay [#2632](https://github.com/kangax/fabric.js/pull/2632)
- Improvements: resize SVG using viewport/viewbox. [#2642](https://github.com/kangax/fabric.js/pull/2642)
- Improvements: Svg import now supports rotate around point [#2645](https://github.com/kangax/fabric.js/pull/2645)
- Change: Opacity is no more a delegated property for group [#2656](https://github.com/kangax/fabric.js/pull/2656)
- Fix: Itext now check for editable property before initializing cursor [#2657](https://github.com/kangax/fabric.js/pull/2657)
- Fix: Better SVG export support for shadows of rotated objects [#2671](https://github.com/kangax/fabric.js/pull/2671)
- Fix: Avoid polygon polyline to change constructor point array [#2627](https://github.com/kangax/fabric.js/pull/2627)
- SVG import: support fill/stroke opacity when no fill/stroke attribute is present [#2703](https://github.com/kangax/fabric.js/pull/2703)
- Fix: remove white filter set opacity to 0 instead of 1 [#2714](https://github.com/kangax/fabric.js/pull/2714)
- Cleaning: removing unused fabric.Canvas.activeInstance [#2708](https://github.com/kangax/fabric.js/pull/2708)
- Change: remove flipping of text string when flipping object [#2719](https://github.com/kangax/fabric.js/pull/2719)
- Fix: Correct shift click on generic transformerd active groups [#2720](https://github.com/kangax/fabric.js/pull/2720)
- SVG import: parse svg with no spaces between transforms [#2738](https://github.com/kangax/fabric.js/pull/2738)
- Fix: Fallback to styleElement.text for IE9 [#2754](https://github.com/kangax/fabric.js/pull/2754)
- Fix: data url for node [#2777](https://github.com/kangax/fabric.js/pull/2777)
- Improvement: Extended font face to all text class during svg export [#2797](https://github.com/kangax/fabric.js/pull/2797)
- Fix: retina scaling dataurl and shadows. [#2806](https://github.com/kangax/fabric.js/pull/2806)
- Improvement: Better look to iText decoration shadows. [#2808](https://github.com/kangax/fabric.js/pull/2808)
- Improvement: New text shadow export to SVG. [#2827](https://github.com/kangax/fabric.js/pull/2827)
- fix: location of optimized 1x1 rects. [#2817](https://github.com/kangax/fabric.js/pull/2817)
- fix: TextBox handling of consecutive spaces. [#2852](https://github.com/kangax/fabric.js/pull/2852)
- fix: Respect shadow in svg export of flipped objects. [#2854](https://github.com/kangax/fabric.js/pull/2854)
- fix: Check presence of style for textBox in svg export. [#2853](https://github.com/kangax/fabric.js/pull/2853)
- Improvement: Added node compatibility for v4 and v5. [#2872](https://github.com/kangax/fabric.js/pull/2872)
- Fix: Canvas dispose remove the extra created elements. [#2875](https://github.com/kangax/fabric.js/pull/2875)
- IText improvements to cut-copy-paste, edit, mobile jumps and style. [#2868](https://github.com/kangax/fabric.js/pull/2868)

**Version 1.5.0**

**Edge**
- Added image preserve aspect ratio attributes and functionality (fabric.Image.alignY, fabric.Image.alignY, fabric.Image.meetOrSlic )
- Added ImageResizeFilters , option to resize dinamically or statically the images using a set of resize filter alghoritms.
- [BACK_INCOMPAT] `fabric.Collection#remove` doesn't return removed object -> returns `this` (chainable)

- Add "mouse:over" and "mouse:out" canvas events (and corresponding "mouseover", "mouseout" object events)
- Add support for passing options to `fabric.createCanvasForNode`

- Various iText fixes and performance improvements
- Fix `overlayImage` / `overlayColor` during selection mode
- Fix double callback in loadFromJSON when there's no objects
- Fix paths parsing when number has negative exponent
- Fix background offset in iText
- Fix style object deletion in iText
- Fix typo in `_initCanvasHandlers`
- Fix `transformMatrix` not affecting fabric.Text
- Fix `setAngle` for different originX/originY (!= 'center')
- Change default/init noise/brightness value for `fabric.Image.filters.Noise` and `fabric.Image.filters.Brightness` from 100 to 0
- Add `fabric.Canvas#imageSmoothingEnabled`
- Add `copy/paste` support for iText (uses clipboardData)

**Version 1.4.0**

- [BACK_INCOMPAT] JSON and Cufon are no longer included in default build

- [BACK_INCOMPAT] Change default objects' originX/originY to left/top

- [BACK_INCOMPAT] `fabric.StaticCanvas#backgroundImage` and `fabric.StaticCanvas#overlayImage` are `fabric.Image` instances. `fabric.StaticCanvas#backgroundImageOpacity`, `fabric.StaticCanvas#backgroundImageStretch`, `fabric.StaticCanvas#overlayImageLeft` and `fabric.StaticCanvas#overlayImageTop` were removed.

- [BACK_INCOMPAT] `fabric.Text#backgroundColor` is now `fabric.Object#backgroundColor`

- [BACK_INCOMPAT] Remove `fabric.Object#toGrayscale` and `fabric.Object#overlayFill` since they're too specific

- [BACK_INCOMPAT] Remove `fabric.StaticCanvas.toGrayscale` since we already have that logic in `fabric.Image.filters.Grayscale`.

- [BACK_INCOMPAT] Split `centerTransform` into the properties `centeredScaling` and `centeredRotation`. Object rotation now happens around originX/originY point UNLESS `centeredRotation=true`. Object scaling now happens non-centered UNLESS `centeredScaling=true`.

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
