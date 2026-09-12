---
date: '2016-05-16'
description: 'Changelog for version 1 of Fabric.JS'
title: 'Changelog v1'
---

## Fabric.js release highlights (v1)

### Version 1.7.22 & 1.7.23

Fabric 1.x is in manteinence mode. Just bugfixes backported from ongoing 2.x

- BACKPORT gradient parsing float
- REVERT this.ctx fix from textbox
- BACKPORT Fix for typeError on removing textbox from mousedown

### Version 1.7.21

Fabric 1.x is in manteinence mode. Just bugfixes backported from ongoing 2.x

- BACKPORT cache fuzzyness fix part 2
- BACKPORT freedrawing fix part 2
- BACKPORT toDataURL backstoreOnly resize
- BACKPORT Removal of unnecessary context creation on text init

### Version 1.7.20

Fabric 1.x is in manteinence mode. Just bugfixes backported from ongoing 2.x

    Group from object and subTargetCheck
    cache canvas deletion
    cache fuzzyness
    free drawing and direction of start/end points
    noScaleCache from stop refreshing cache of not transforming objects

### Version 1.7.19

Fabric 1.x is in manteinence mode. Just bugfixes no features or improvements.

    Fixed drawing path displacement #4318
    Fixed the flip of images with scale equally #4313
    Fixed touch touch detection #4302

### Version 1.7.18

    Fixed doubling of subtargets for preserveObjectStacking = true #4297
    Added a dirty set to objects in group destroy.

### Version 1.7.17

Small bugix release, mostly selection and text bugfixes reported by users

    Change: swapped style white-space:nowrap with attribute wrap="off" since the style rule was creating
            problems in browsers like ie11 and safari. #4119
    Fix: Remove an object from activeGroup if removed from canvas #4120
    Fix: avoid bringFroward, sendBackwards to swap objects in active selections #4119
    Fix: avoid disposing canvas on mouse event to throw error #4119
    Fix: make svg respect white spaces #4119
    Fix: avoid exporting bgImage and overlayImage if excludeFromExport = true #4119
    Fix: Avoid group fromObject mutating original data #4111
  

### Version 1.7.16

Small bugix release.

    Improvement: Add information to onChange and onComplete animation function #4068
    Improvement: avoid multiplying identity matrices in calcTransformMatrix function
    Fix: ativeGroup did not destroy correctly if a toObject was happening
    Improvement: Pass the event to object:modified when available. #4061
  

### Version 1.7.15

Quick bug fix release and and 2 improvements. Shadow with no offset can be cached, and this is a speed boost if you are using shadow to do halos.  
Added a note in text docs that allow devs to ovveride some custom key behaviour

    Improvement: Made iText keymap public. #4053
    Improvement: Fix a bug in updateCacheCanvas that was returning always true #4051
  

### Version 1.7.14

Cache improvement release! Two new features are now in the cache system. The cache will not grow over certain sizes when scaling objects, and also the \_cacheCanvas will be resized in advance by a 10% margin so that we do not have to resize each mousemove event.  
Check [here](/fabric-object-caching) for more details  
The staefull check has been speed up a bit taking inspiration from `fast-deep-equal` package on npm.  
Some bug relative to deep state check and group that where invalidating the cache for weird reason have been hopefully solved.

  Improvement: Avoid cache canvas to resize each mouse move step. #4037
  Improvement: Make cache canvas limited in size. #4035
  Fix: Make groups and statefull cache work. #4032
  Add: Marked the hiddentextarea from itext so that custom projects can recognize it. #4022
  

### Version 1.7.13

Small bugfix release

  Fix: Try to minimize delay in loadFroJson #4007
  Fix: allow fabric.Color to parse rgba(x,y,z,.a) without leading 0 #4006
  Allow path to execute Object.initialize, make extensions easier #4005
  Fix: properly set options from path fromDatalessObjects #3995
  Check for slice before action.slice. Avoid conflicts with heavy customized code. #3992
  

### Version 1.7.12

Bug fixes and some new properties added to mouse events.

    Fix: removed possible memleaks from window resize event. #3984
    Fix: restored default cursor to noTarget only. unselectable objects get the standard hovercursor. #3953
    Cache fixes: fix uncached pathGroup, removed cache creation at initialize time #3982
    Improvement: nextTarget to mouseOut and prevTarget to mouseOver #3900
    Improvement: add isClick boolean to left mouse up #3898
    Fix: can start selection on top of non selectable object #3892
    Improvement: better management of right/middle click #3888
    Fix: subTargetCheck on activeObject/activeGroup was firing too many events #3909
    Fix: After addWithUpdate or removeWithUpdate object coords must be updated. #3911
  

### Version 1.7.11

    Hotifx for broken PathGroups (SVGs)

### Version 1.7.10

Many fixes to be a minor release:  
Fixes to SVG export for polygons and for radial gradients in general. Introducing a caching logic for groups that allow to smart cache what has not shadow as children object. This should reduce caching visual errors by much and still allowing for cache optimization.  
Introduced some manual checks on the value of Math.cos so that we can output a correct angle of 90 or 270 degrees for objects.

    Fix: correct svg export for radial gradients #3807
    Fix: Update fireout events to export the event object #3853
    Fix: Improve callSuper to avoid infinite loops (not all of them) #3844
    Fix: avoid selectionBackgroundColor leak on toDataUrl #3862
    Fix: toDatelessObject for Group #3863
    Improvement: better caching logic for groups #3864
    Fix: correct svg gradient export for radial in polygons #3866
    Fix: First draw could be empty for some objects #3870
    Fix: Always send event data to object:selected #3871
    Improvement: reduce angle calculation error #3872
  

### Version 1.7.9

Small fixes for text related problems. If you are using text in your application, you should update.

    Fix: Avoid textarea wrapping from chome v57+ #3804
    Fix: double click needed to move cursor when enterEditing is called programatically #3804
    Fix: Style regression when inputing new style objects #3804
    Add: try to support crossOrigin for svg image tags #3804
  

### Version 1.7.8 and 1.7.7

This is maybe the last release of the 1.x branch. New important and api breaking work is in progress and will be labeled as fabric 2.x  
The change i like most comes from a casual contributor, `by12` and fixes path bounding box calculation. No more trimmed paths!  
A change in translation on the cache canvas fixed blurriness introduced since 1.7.3, that is also worth an update.  
For iText, Textbox typers, the style object does not get polluted with useless empty objects now.  
And last but not the least, we have a new flag called `fabric.StaticCanvas.prototype.skipOffscreen` default to `false` that will calculate with objects aCoords if the object is on the screen or outside the screen and will skip the rendering part completely. This is an optional feature but it turns out to be very usefull when you are dealing with large number of objects and you are using zoom or panning much.  
While object.oCoords needs to be updated every zoom/pan, aCoords are static with object position and are still valid when we change the viewport. This allows us to detect if they are offscreen simply calculating the viewportCoords at the expense of 2 transformed points calculation. A demo page will follow soon.

    Fix: Fix dirty flag propagation #3782
    Fix: Path parsing error in bounding boxes of curves #3774
    Add: Middle click mouse management on canvas #3764
    Add: Add parameter to detect and skip offscreen drawing #3758
    Fix: textarea loosing focus after a drag and exit from canvas #3759
    Fix for opacity parsing in svg with nested opacities #3747
    Fix text initialization and boundingrect #3745
    Fix line bounding box #3742
    Improvement: do not pollute style object while typing if not necessary #3743
    fix for broken prototype chain when restoring a dataless object on fill an stroke #3735
    fix for deselected event not fired on mouse actions #3716
    fix for blurriness introduced on 1.7.3 #3721
  

### Version 1.7.6 ( plus 1.7.5 and 1.7.4)

New functionalities about coordinates: Now setCoords updates both the corner coords for mouse interaction and a new set called aCoords that is a set of absolute coordinates that a dev can use for its own calculation on positions.  
Introduced a set of coordinates on canvas that let you figure out where the current viewport start and finish. A new method for objects, called \`isOnScreen\` let;s you find out if at least a corner of an object is visible in the current viewport Fabric.Color class now can export colors in HEX + opacity format Notable fixes: We switched some touch event handling to accomodate latest chrome changes Removed gaps on continuos textbackgroundColor on Itext

    Fix: make the cacheCanvas created on the fly if not available
    Improvement: draw textbackgroundColor in one single pass when possible
    Improvement: fire selection changed event just if text is editing
    Improvement: Add object property 'needsItsOwnCache'
    Improvement: Skip unnecessary transform if they can be detected with a single if
    Fix: Moved all the touch event to passive false so that they behave as before chrome changes
    Fix: force top and left in the object representation of a path to avoid reparsing on restore
    Add: Enable deselected event for activeObject switch. Ensure deactivateAll call exitEditing
    Fix: Perform subtargetCheck also if the group is an active object and on activeGroup
    Fix: Made cursor operation more precise at high canvas zoom level
    Add: Made getBoundingRect available to return both absolute or standard bounding rect
    Add: Introduced calcViewportBoundaries() function for fabric.StaticCanvas
    Add: Introduced isOnScreen() function for fabric.Object
    Subclassed Polygon from polyline
    Fix: Removed reference to hovered target when target gets removed
    Fix: Removed hover cursor for non selectable objects
    Fix: Switch to passive event for touch move
    Fix: Restart rendering of cursor after entering some text
    Add: fabric.Color support toHexa() method now
  

### Version 1.7.3

Mixed release, cleaning and important bugfixes.  
Objects `fromObject` methods have been reworked to be able to wait for Patterns full loading process before actually creating the object, so that the first render has the pattern ready to show. That was a longstanding bug since 2013.  
Reworked some of the canvas background and overlay code so that gradient and patterns works and are saved and reloaded correctly.  
During loadFromJSON process, if an image errors out, the process cotinue smooth, the reviver function is invoked with a third argument `error` equal to true.  
Usuals objectCaching improvements: dirty flag propagation from childObjects to parents, added a couple of pixels around the cache canvas to avoid aliasing, added bigger padding for text with custom fonts.

    Improvement: mousewheel event has target in the arguments as all the other events. object now fires mousewheel
    Improvement: Pattern loads for canvas background and overlay, corrected svg pattern export.
    Fix: Wait for pattern loading before calling callback.
    Fix: add 2 extra pixels to cache canvases to avoid aliasing cut.
    Fix: Rerender when deselect an itext editing object.
    Fix: save new state of dimensionProperties at every cache clear.
    Improvement: Better error managment in loadFromJSON.
    Improvement: do not reload backgroundImage as an image if is different type.
    Improvement: if a children element is set dirty, set the parent dirty as well.
  

### Version 1.7.2

Again a maintenance release for iText custom fonts and cache and a workaround for macOS sierra problem with 'object:modified'

    Fix: Textbox do not use stylemap for line wrapping #3546
    Fix: Fix for firing object:modfied in macOS sierra #3539
    Fix: Itext with object caching was not refreshing selection correctly. #3538
    Fix: stateful now works again with activeGroup and dinamyc swap between stateful false/true. #3537
    Fix: includeDefaultValues was not applied to child objects of groups and path-groups. #3497
    Fix: Itext style is cloned on paste action now, allow copie of styles to be independent. #3502
    Fix: Add subclasses properties to cacheProperties. #3490
    Add: Shift and Alt key used for transformations are now dinamic. #3479
    Fix: fix to polygon and cache. Added cacheProperties for all classes #3490
  

### Version 1.7.1

Just small bugfixes and support for custom properties in gradient and pattern toObject method.

    Add: Gradients/Patterns support customAttributes in toObject method #3477
    Fix: IText/Textbox not blurring keyboard on ios 10 #3476
    Fix: Shadow on freedrawing and zoomed canvas #3475
    Fix: Fix for group returning negative scales #3474
    Fix: hotfix for textbox #3441 #3473
  

### Version 1.7.0

Introducing object caching, please refer to the example page for more information [caching](/fabric-object-caching)

    Add: Object Caching #3417
    Improvement: group internal objects have coords not affected by canvas zoom #3420
    Fix: itext cursor trails on initDimension #3436
    Fix: null check on .setActive #3435
    Fix: function error in clone deep. #3434
  

### Version 1.6.7

A bugfix release with a new function, snap to angle during rotation.  
How to activate it? Populate \`snapAngle\` and \`snapTreshold\` in the object properties

    Add: Snap rotation added to objects. two parameter introduced, snapAngle and snapTreshold. \[#3383\]
    Fix: Pass target to right click event. \[#3381\]
    Fix: Correct rendering of bg color for styled text and correct clearing of itext area. \[#3388\]
    Add: Fire mouse:over on the canvas when we enter the canvas from outside the element. \[#3389\]
    Fix: Fix calculation of words width with spaces and justify. \[#3408\]
    Fix: Do not export defaults properties for bg and overlay if requested. \[#3415\]
  

### Version 1.6.6

A bugfix release with 2 new image filters, contrast and saturation

    Add: Contrast and Saturate filters #3341
    Fix: Correct registering and removal of events to handle iText objects.
    Fix: Corrected 2 regression of 1.6.5 (dataurl export and itext clicks)
    Fix: Corrected path boundaries calculation for Arcs ( a and A )
  

### Version 1.6.5

A bugfix release with some small news:  
New feature `backgroundColor` is now supported from all classes.  
`Clone` and `fromObject` methods are now equal for all classes. You can use the callback for any cloning.  
Right click `mouse:down` support. disabled by default can be enabled using the `fireRightClick` property and the canvas element context menu can be disabled enabling `stopContextMenu` on the fabric canvas.

The font-family quoting from 1.6.4 has been reverted because it made no possible to use multiple font family names. So if you are using a font family that has a name with spaces and numbers you have to wrap in in quotes by yourself.

    Fix: charspacing, do not get subzero with charwidth.
    Improvement: add callback support to all object cloning. #3212
    Improvement: add backgroundColor to all classe #3248
    Fix: add custom properties to backgroundImage and overlayImage #3250
    Fix: Object intersection is calculated on boundingBox and boundingRect, intersection is fired if objects are overlapping #3252
    Change: Restored previous selection behaviour, added key to selection active object under overlaid target #3254
    Improvement: hasStateChanged let you find state changes of complex properties. #3262
    Fix: IText/Textbox shift click selection backward. #3270
    Revert: font family quoting was a bad idea. node-canvas stills use it. #3276
    Fix: fire mouse:over event for activeObject and activeGroup when using findTarget shourtcuts #3285
    Fix: clear method clear all properties of canvas #3305
    Fix: text area position method takes in account canvas offset #3306
    Improvement: Added event on right click and possibility to hide the context menu with a flag 3308
    Fix: remove canvas reference from object when object gets removed from canvas #3307
    Improvement: use native stroke dash if available #3309
    Fix: Export correct src when exporting to svg #3310
    Fix: Stop text to go on zero dimensions #3312
    Fix: Error in dataURL with multiplier was outputting very big canvas with retina #3314
    Fix: Error in style map was not respecting style if textbox started with space #3315
  

### Version 1.6.4

In fabric 1.6.4 we added some new features and refinement to text objects:  
New feature `charspacing` has been added, charspacing is expressed in thousands of em unit, meaning that with a value of 1000 and a fontsize of 40, you will have an additional space of 40px between chars.  
Lineheight managment has been improved, now the lineheight does not have an extra padding below the line if there are no other lines of text.  
Now that HiddenTextarea of iText object can follow the typing cursor better, it has been attached again to body of document and thanks to this IE browsers copy paste has been fixed.  
`selection:changed` event firing has been reduced so that it fires just when necessary  
Fonts with particular names, like 'Slabo 27px' or 'Exo 2' should be handled correctly now.

We have one new filter, a generic `ColorMatrix` filter from one of our contributors.

An old missing feature has been finally added, when restoring object from JSON, the apply filter function is executed before firing the callback, so that we can re render the canvas when everything is properly set up

Other small fixes to svg import and zoomed canvas. Finally shift click to select and unselect should work on every canvas zoom/pan.

New event: `object:deselected` is fired when an object loose its active state. Other than that, to the `before:selection:cleared` and `selection:cleared` the target is passed as an argument to the event fired.

This is the raw changelog:

    Improvement: Ignore svg: namespace during svg import. #3081
    Improvement: Better fix for lineHeight of iText/Text #3094
    Improvement: Support for gradient with 'Infinity' coordinates #3082
    Improvement: Generally "improved" logic of targeting #3111
    Fix: Selection of active group with transparency and preserveObjectStacking true or false #3109
    Fix: pattern brush now create the same pattern seen while drawing #3112
    Fix: Allow css merge during svg import #3114
    Improvement: added numeric origins handling fomr 0 to 1. #3121
    Fix: Fix a defect with shadow of objects in a scaled group. #3134
    Improvement: Do not fire unecessary selection:changed events. #3119
    Fix: Attached hiddenTextarea to body fixes IE, thanks to @plainview. #3137
    Fix: Shift unselect activegroup on transformed canvas. #3144
    Added: ColorMatrix filter #3139
    Fix: Fix condition in wich restoring from Object could cause object overwriting #3146
    Change: cloneAsImage for Object and toDataUrl for object are not retina enabled by default. Added option to enable. #3147
    Improvement: Added textSpacing support for text/itext/textbox #3097
    Fix: Quote font family when setting the context fontstyle #3191
    Fix: use getSrc during image export, make subclassing easier, return eventually the .src property if nothing else is available #3189
    Fix: Inverted the meaning of border scale factor #3154
    Improvement: Added support for RGBA in HEX notation. #3202
    Improvement: Added object deselected event. #3195
    Fix: loadFromJson callback now gets fired after filter are applied #3210
  

### Version 1.6.3

Biggest new in 1.6.3 is support of sub-targets in group. Group has a new property `subTargetCheck` default to false that allows the findTarget functions to go deep in the group nested objects.  
Events will fire for both the group and all the list of sub targets found in case of nested groups

Other changes inclued better handling of pan and zooming. Transparency checking is now aware of current viewportTransform and 3 new functions have been added to center objects in the current viewport instead of canvas: `viewportCenterObject`, `viewportCenterObjectH`, `viewportCenterObjectV`. Viewport fixes include cursor width in text editiong mode and the 1.6.2 newly itroduced `selectionBackgroundColor`

This is the raw changelog:

    Improvement: Use reviver callback for background and overlay image when doing svg export. #2975
    Improvement: Added object property excludeFromExport to avoid exporting the object to JSON or to SVG. #2976
    Improvement: Correct the calculation of text boundingbox. Improves svg import #2992
    Added: Export id property to SVG #2993
    Improvement: Call the callback on loadSvgFromURL on failed xml load with null agument #2994
    Improvement: Clear only the Itext area on contextTop during cursor animation #2996
    Added: Char widths cache has been moved to fabric level and not iText level. Added fabric.util.clearFabricCharWidthsCache(fontName) #2995
    Fix: do not set background or overlay image if the url load fails. #3003
    Fix: iText mousemove event removal, clear the correct area for Itext, stopped redrawing selection if not necessary #3016
    Fix: background image and overlay image scale and move with canvas viewportTransform, parameter available #3019
    Added: support sub targeting in groups in events #2997
    Fix: Select transparent object on mouse up because of \_maybeGroupObject #2997
    Fix: Remove reference to lastRenderedObject on canvas.remove #3023
    Fix: Wait for all objects to be loaded before deleting the properties and setting options. #3029
    Fix: Object Padding is unaffected by object transform. #3057
    Fix: Restore lastRenderedObject usage. Introduced Canvas.lastRenderedKey to retrieve the lastRendered object from down the stack #3057
    Fix: \_calcTextareaPosition correctly calculate the position considering the viewportTransform. #3057
    Fix: Fixed selectionBacgroundColor with viewport transform. #3057
    Improvement: Correctly render the cursor with viewport scaling, improved the cursor centering. #3057
    Fix: Use canvas zoom and pan when using is target transparent. #2980
    Improvement: Added additional methods to center object on canvas. #3044
  

### Version 1.6.2

![](/article_assets/1.6.2.png)

With 1.6.2 we introduce some new customization options for controls and user interaction. It is now possible to customize the keys used for control interaction.  
Before those where the predefined keys:

  Alt Key: Switching from normal transform to centered transform during scaling objects.
  Shift Key: on br,bl,tr,lt was switching from proportional to free resize, on mt, ml, mr, bw was switching between resize and skew.
  

As of 1.6.2 is possible to use those configuration option to define which keys are used:

  \* values: altKey, shiftKey, ctrlKey,
  fabric.Object.uniScaleKey: key used to switch between proportional and not proportional scaling
  fabric.Object.altActionKey: key used to switch between different action on same corner (skew/scale)
  fabric.Object.centeredKey: key used to switch on/off the centered transform
  

`hoverCursor` now appears also on non selectable objects but `moveCursor` does not appear if the object can't be moved. In addition `moveCursor` is now customizable with the property `moveCursor`.  
The biggest change is the possibility of customizing the look of controls. Both border and controls can be filled and stroked and can also have a dash-array instead of a continue line. Corners can be both square or round.  
To control those feature you can use those new properties:

  borderDashArray: Dash stroke of borders
  cornerDashArray: Dash stroke of corners
  cornerStrokeColor: If corners are filled, this property controls the color of the stroke
  cornerStyle: standrd 'rect' or 'circle'
  selectionBackgroundColor: add an opaque or transparent layer to the selected object.
  

Small bugfixes includes: Itext firing `object:modified` on text change, possibility to restore custom canvas properties other than objects during canvas loadFromJSON, some SVG color output fix and some dataURL improvements.  
This is the raw changelog:

    Fix: restore canvas properties on loadFromJSON with includeProperties. #2921
    Fix: Allow hoverCursor on non selectable objects, moveCursor does not appear if the object is not moveable. Added object.moveCursor to specify a cursor for moving per object. #2924
    Fix: Add missing stroke.live translation, allow gradientTransform for dashed line. #2926
    Improvement: Allow customization of keys that iteract with mouse action ( multiselect key, free tranform key, alternative action key, centered transform key ) #2925
    Added: Make iText fires object:modified on text change on exit editing #2927
    Added: \[control customization part 1\] cornerDashArray, borderDashArray. Now borderScaleFactor influences both border and controls, changed default corner size to 13 #2932
    Fix: createSVGFontFacesMarkup was failing to retrieve fonts in style #2935
    Fix: shadow not scaled with dataUrl to multiplier #2940
    Added: \[control customization part 2\] cornerStrokeColor. Now is possible to specify separate stroke and fill color for the controls #2933
    Fix: Itext width calculation with caching false was returning nan. #2943
    Added: \[control customization part 3\] Rounded corners. It is possible to specify cornerStyle for the object. 'rect' or 'circle' #2942
    Added: \[control customization part 4\] Selection background. It is possible to specify selectionBackgroundColor for the object. #2950
    Fix: Behaviour of image with filters with resize effects and Object to/from json #2954
    Fix: Svg export should not output color notation in rgba format #2955
    Fix: minScaleLimit rounding bug #2964
    Fix: Itext spacing in justify mode bug #2971
    Fix: Object.toDataUrl export when some window.devicepixelRatio is present (retina or browser zoom) #2972