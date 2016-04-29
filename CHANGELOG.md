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
