---
date: '2017-06-18'
description: 'Changelog for version 2 to 5'
title: 'Changelog'
---

## Fabric.js release highlights
Find general upgrades notes <a href="/upgrade-guide">here</a>

### Version 5.0.0

This is last major version of fabricJS written in ES5.
There aren't big new breaking changes, the main reason for the major increase was a node update that was required to remove a vulnerability in a JSDOM sub dependency, we bumped node to 14 minimum and we removed many deprecated methods.
There is a full list of changes in order to handle this upgrade at this link: [v5 breaking changes](/v5-breaking-changes).

There are also many changes from the contributors, especially Sachar and Steve, that are officially part of the team now.

Nice additions:
- you can now draw a straight line with pencil brush pressing shiftKey
- it is now possible to access all animations that are currently running, see [`fabric.runningAnimations`](/fabric-intro-part-2#running_animations) [Shachar Nencel](https://github.com/ShaMan123)
- The Eraser brush (optional) has been rewritten in order to fix some problems and now supports undoing out of the box [Shachar Nencel](https://github.com/ShaMan123)
- add pathAlign to text on paths [Steve Eberhardt](https://github.com/melchiar)
- stroke bounding box for objects with acute angles has been fixed almost completely (`miter` is fully supported) [Shachar Nencel](https://github.com/ShaMan123)

Notable fixes:
- many control box fixes
- performance fix after canvas resize
- performance fix for rtl/ltr
- performance fix for 0 width textlines

And:
- different reported security issues
- path measurements consistency fixes
- 2 small fixes in gesture handling

```
- fix(fabric.Canvas): unflag contextLost after a full re-render [`#7646`](https://github.com/fabricjs/fabric.js/pull/7646)
- **BREAKING**: remove 4.x deprecated code [`#7630`](https://github.com/fabricjs/fabric.js/pull/7630)
- feat(fabric.StaticCanvas, fabric.Canvas): limit breaking changes [`#7627`](https://github.com/fabricjs/fabric.js/pull/7627)
- feat(animation): animations registry [`#7528`](https://github.com/fabricjs/fabric.js/pull/7528)
- docs(): Remove not working badges [`#7623`](https://github.com/fabricjs/fabric.js/pull/7623)
- ci(): add auto-changelog package to quickly draft a changelog [`#7615`](https://github.com/fabricjs/fabric.js/pull/7615)
- feat(fabric.EraserBrush): added `eraser` property to Object instead of attaching to `clipPath`, remove hacky `getClipPath`/`setClipPath` [#7470](https://github.com/fabricjs/fabric.js/pull/7470), see **BREAKING** comments.
- feat(fabric.EraserBrush): support `inverted` option to undo erasing [#7470](https://github.com/fabricjs/fabric.js/pull/7470)
- fix(fabric.EraserBrush): fix doubling opacity objects while erasing [#7445](https://github.com/fabricjs/fabric.js/issues/7445) [#7470](https://github.com/fabricjs/fabric.js/pull/7470)
- **BREAKING**: fabric.EraserBrush: The Eraser object is now a subclass of Group. This means that loading from JSON will break between versions.
Use this [code](https://gist.github.com/ShaMan123/6c5c4ca2cc720a2700848a2deb6addcd) to transform your json payload to the new version.
- feat(fabric.Canvas): fire an extra mouse up for the original control of the initial target [`#7612`](https://github.com/fabricjs/fabric.js/pull/7612)
- fix(fabric.Object) bounding box display with skewY when outside group [`#7611`](https://github.com/fabricjs/fabric.js/pull/7611)
- fix(fabric.text) fix rtl/ltr performance issues [`#7610`](https://github.com/fabricjs/fabric.js/pull/7610)
- fix(event.js) Prevent dividing by 0 in for touch gestures [`#7607`](https://github.com/fabricjs/fabric.js/pull/7607)
- feat(): `drop:before` event [`#7442`](https://github.com/fabricjs/fabric.js/pull/7442)
- ci(): Add codeql analysis step [`#7588`](https://github.com/fabricjs/fabric.js/pull/7588)
- security(): update onchange to solve security issue [`#7591`](https://github.com/fabricjs/fabric.js/pull/7591)
- **BREAKING**: fix(): MAJOR prevent render canvas with quality less than 100% [`#7537`](https://github.com/fabricjs/fabric.js/pull/7537)
- docs(): fix broken link [`#7579`](https://github.com/fabricjs/fabric.js/pull/7579)
- **BREAKING**: Deps(): MAJOR update to jsdom 19 node 14 [`#7587`](https://github.com/fabricjs/fabric.js/pull/7587)
- Fix(): JSDOM transative vulnerability [`#7510`](https://github.com/fabricjs/fabric.js/pull/7510)
- fix(fabric.parser): attempt to resolve some issues with regexp [`#7520`](https://github.com/fabricjs/fabric.js/pull/7520)
- fix(fabric.IText)  fix for possible error on copy paste [`#7526`](https://github.com/fabricjs/fabric.js/pull/7526)
- fix(fabric.Path): Path Distance Measurement Inconsistency [`#7511`](https://github.com/fabricjs/fabric.js/pull/7511)
- Fix(fabric.Text): Avoid reiterating measurements when width is 0 and measure also empty lines for consistency. [`#7497`](https://github.com/fabricjs/fabric.js/pull/7497)
- fix(fabric.Object): stroke bounding box [`#7478`](https://github.com/fabricjs/fabric.js/pull/7478)
- fix(fabric.StaticCanvas): error of changing read-only style field [`#7462`](https://github.com/fabricjs/fabric.js/pull/7462)
- fix(fabric.Path): setting `path` during runtime [`#7141`](https://github.com/fabricjs/fabric.js/pull/7141)
- chore() update canvas to 2.8.0 [`#7415`](https://github.com/fabricjs/fabric.js/pull/7415)
- fix(fabric.Group) realizeTransfrom should be working when called with NO parent transform [`#7413`](https://github.com/fabricjs/fabric.js/pull/7413)
- fix(fabric.Object) Fix control flip and control box [`#7412`](https://github.com/fabricjs/fabric.js/pull/7412)
- feat(fabric.Text): added pathAlign property for text on path [`#7362`](https://github.com/fabricjs/fabric.js/pull/7362)
- docs(): Create SECURITY.md [`#7405`](https://github.com/fabricjs/fabric.js/pull/7405)
- docs(): Clarify viewport transformations doc [`#7401`](https://github.com/fabricjs/fabric.js/pull/7401)
- docs(): specify default value and docs for enablePointerEvents [`#7386`](https://github.com/fabricjs/fabric.js/pull/7386)
- feat(fabric.PencilBrush): add an option to draw a straight line while pressing a key [`#7034`](https://github.com/fabricjs/fabric.js/pull/7034)
```

### Version 4.6.0

A massive changelog for this release.

A lot of external contribution this release, with improvements on many sides.

- RTL improvements
- text on path improvements ( align, side of the path, path offset, path rendering) [Steve Eberhardt](https://github.com/melchiar)
- new utils for path transformations
- added `once` to the event emitter [Shachar Nencel](https://github.com/ShaMan123)
- ability to append the hiddenTextarea on a custom element [Dave Lage](https://github.com/rockerBOO)
- a new vibrance filter [Steve Eberhardt](https://github.com/melchiar)
- animate will now return a function to stop the animation [Shachar Nencel](https://github.com/ShaMan123)
- improvements to the optional eraser brush plugin [Shachar Nencel](https://github.com/ShaMan123)


```
- feat(fabric.util): added fabric.util.transformPath to add transformations to path points [#7300](https://github.com/fabricjs/fabric.js/pull/7300)
- feat(fabric.util): added fabric.util.joinPath, the opposite of fabric.util.parsePath [#7300](https://github.com/fabricjs/fabric.js/pull/7300)
- fix(fabric.util): use integers iterators [#7233](https://github.com/fabricjs/fabric.js/pull/7233)
- feat(fabric.Text) add path rendering to text on path [#7328](https://github.com/fabricjs/fabric.js/pull/7328)
- feat(fabric.iText): Add optional hiddenTextareaContainer to contain hiddenTextarea [#7314](https://github.com/fabricjs/fabric.js/pull/7314)
- fix(fabric.Text) added pathStartOffset and pathSide to props lists for object export [#7318](https://github.com/fabricjs/fabric.js/pull/7318)
- feat(animate): add imperative abort option for animations [#7275](https://github.com/fabricjs/fabric.js/pull/7275)
- fix(Fabric.text): account for fontSize in textpath cache dimensions ( to avoid clipping ) [#7298](https://github.com/fabricjs/fabric.js/pull/7298)
- feat(Observable.once): Add once event handler [#7317](https://github.com/fabricjs/fabric.js/pull/7317)
- feat(fabric.Object): Improve drawing of controls in group. [#7119](https://github.com/fabricjs/fabric.js/pull/7119)
- fix(EraserBrush): intersectsWithObject edge cases [#7290](https://github.com/fabricjs/fabric.js/pull/7290)
- fix(EraserBrush): dump canvas bg/overlay color support [#7289](https://github.com/fabricjs/fabric.js/pull/7289)
- feat(fabric.Text) added pathSide property to text on path [#7259](https://github.com/fabricjs/fabric.js/pull/7259)
- fix(EraserBrush) force fill value [#7269](https://github.com/fabricjs/fabric.js/pull/7269)
- fix(fabric.StaticCanvas) properly remove objects on canvas.clear [#6937](https://github.com/fabricjs/fabric.js/pull/6937)
- feat(fabric.EraserBrush): improved erasing:end event [#7258](https://github.com/fabricjs/fabric.js/pull/7258)
- fix(shapes): fabric.Object._fromObject never should return [#7201](https://github.com/fabricjs/fabric.js/pull/7201)
- feat(fabric.filters) Added vibrance filter (for increasing saturation of muted colors) [#7189](https://github.com/fabricjs/fabric.js/pull/7189)
- fix(fabric.StaticCanvas): restore canvas size when disposing [#7181](https://github.com/fabricjs/fabric.js/pull/7181)
- feat(fabric.util): added `convertPointsToSVGPath` that will convert from a list of points to a smooth curve. [#7140](https://github.com/fabricjs/fabric.js/pull/7140)
- fix(fabric.Object): fix cache invalidation issue when objects are rotating [#7183](https://github.com/fabricjs/fabric.js/pull/7183)
- fix(fabric.Canvas): rectangle selection works with changing viewport [#7088](https://github.com/fabricjs/fabric.js/pull/7088)
- feat(fabric.Text): textPath now support textAlign [#7156](https://github.com/fabricjs/fabric.js/pull/7156)
- fix(fabric.EraserBrush): test eraser intersection with objects taking into account canvas viewport transform [#7147](https://github.com/fabricjs/fabric.js/pull/7147)
- fix(fabric.Object): support `excludeFromExport` set on `clipPath` [#7148](https://github.com/fabricjs/fabric.js/pull/7148).
- fix(fabric.Group): support `excludeFromExport` set on objects [#7148](https://github.com/fabricjs/fabric.js/pull/7148).
- fix(fabric.StaticCanvas): support `excludeFromExport` set on `backgroundColor`, `overlayColor`, `clipPath` [#7148](https://github.com/fabricjs/fabric.js/pull/7148).
- fix(fabric.EraserBrush): support object resizing (needed for eraser) [#7100](https://github.com/fabricjs/fabric.js/pull/7100).
- fix(fabric.EraserBrush): support canvas resizing (overlay/background drawables) [#7100](https://github.com/fabricjs/fabric.js/pull/7100).
- fix(fabric.EraserBrush): propagate `clipPath` of group to erased objects when necessary so it is correct when ungrouping/removing from group [#7100](https://github.com/fabricjs/fabric.js/pull/7100).
- fix(fabric.EraserBrush): introduce `erasable = deep` option for `fabric.Group` [#7100](https://github.com/fabricjs/fabric.js/pull/7100).
- feat(fabric.Collection): the `contains` method now accepts a second boolean parameter `deep`, checking all descendants, `collection.contains(obj, true)` [#7139](https://github.com/fabricjs/fabric.js/pull/7139).
- fix(fabric.StaticCanvas): disposing canvas now restores canvas size and style to original state.
```

### Version 4.5.0 and 4.5.1

Introduced fabric RTL support for text/itext and an optional mixin with an eraser brush.

```
- fix(fabric.Text): fixes decoration rendering when there is a single rendering for full text line [#7104](https://github.com/fabricjs/fabric.js/pull/7104)
- fix(fabric.Text): spell error which made the gradientTransform not working [#7059](https://github.com/fabricjs/fabric.js/pull/7059)
- fix(fabric.util): unwanted mutation in fabric.util.rotatePoint [#7117](https://github.com/fabricjs/fabric.js/pull/7117)
- fix(svg parser): Ensure that applyViewboxTransform returns an object and not undefined/null [#7030](https://github.com/fabricjs/fabric.js/pull/7030)
- fix(fabric.Text): support firefox with ctx.textAlign for RTL text [#7126](https://github.com/fabricjs/fabric.js/pull/7126)
- fix(fabric.PencilBrush) decimate deleting end of a freedrawing line [#6966](https://github.com/fabricjs/fabric.js/pull/6966)
- feat(fabric.Text): Adding support for RTL languages by adding `direction` property [#7046](https://github.com/fabricjs/fabric.js/pull/7046)
- feat(fabric) Add an eraser brush as optional module [#6994](https://github.com/fabricjs/fabric.js/pull/6994)
- fix v4: 'scaling' event triggered before object position is adjusted [#6650](https://github.com/fabricjs/fabric.js/pull/6650)
- Fix(fabric.Object): CircleControls transparentCorners styling [#7015](https://github.com/fabricjs/fabric.js/pull/7015)
- Fix(svg_import): svg parsing in case it uses empty use tag or use with image href [#7044](https://github.com/fabricjs/fabric.js/pull/7044)
- fix(fabric.Shadow): `offsetX`, `offsetY` and `blur` supports float [#7019](https://github.com/fabricjs/fabric.js/pull/7019)
```

### Version 4.4.0

The highlights of this versions are:

We added target to each selection event, so you can stop using this, and you can use fat arrows function freely for event handling. This is a change of direction, so if you notice some event that can benefit from having the target specified rather than using the `this` keyword, please open an issue and we can address it.

A new property on pencil brush, `limitedToCanvasSize` will let you stop drawing outside the canvas.

There is a new property on objects that is currently an experiment.
We do want to support a more flexible way to select objects, so we added a property, called `activeOn`, that will let you specify `up` or `down` and this will let you select the object either on mousedown/touchstart  or mouseup/touchend, to account for interactions with dragging for example.
Now this is an *experiment*, meaning that we want to add more flavours to it, like for example, can it be multi selected? Can it be shift selected, can it be drag selected?
You can experiment with this value, but you have to consider the behaviour may slightly change and you will have to correct your app later on.
Consider it a beta feature. We marked it as @private in the docs, and we clarified it as experimental.

There are an handful of fixes, some of them found and contributed back from developers outside the project.
Thank you @zhangshine, @rileygowan @CharlesRA.

```
- fix(fabric.Object) wrong variable name `cornerStrokeColor ` [#6981](https://github.com/fabricjs/fabric.js/pull/6981)
- fix(fabric.Text): underline color with text style ( regression from text on a path) [#6974](https://github.com/fabricjs/fabric.js/pull/6974)
- fix(fabric.Image): Cache CropX and CropY cache properties [#6924](https://github.com/fabricjs/fabric.js/pull/6924)
- fix(fabric.Canvas): Add target to each selection event [#6858](https://github.com/fabricjs/fabric.js/pull/6858)
- fix(fabric.Image): fix wrong scaling value for the y axis in renderFill [#6778](https://github.com/fabricjs/fabric.js/pull/6778)
- fix(fabric.Canvas): set isMoving on real movement only  [#6856](https://github.com/fabricjs/fabric.js/pull/6856)
- fix(fabric.Group) make addWithUpdate compatible with nested groups [#6774](https://github.com/fabricjs/fabric.js/pull/6774)
- fix(Fabric.Text): Add path to text export and import [#6844](https://github.com/fabricjs/fabric.js/pull/6844)
- fix(fabric.Canvas) Remove controls check in the pixel accuracy target [#6798](https://github.com/fabricjs/fabric.js/pull/6798)
- feat(fabric.Canvas): Added activeOn 'up/down' property [#6807](https://github.com/fabricjs/fabric.js/pull/6807)
- feat(fabric.BaseBrush): limitedToCanvasSize property to brush [#6719](https://github.com/fabricjs/fabric.js/pull/6719)
```

### Version 4.3.1

Improved feature: Text on a path now has better angles and better spread of chars over the curve.
Also 3 bugs fixed and small improvements.

A special thanks to those people for contributing in this release:
[Raj](https://github.com/prog-rajkamal)
[Kastriot Salihu](https://github.com/KastriotSalihu)

```
- fix(fabric.Control) implement targetHasOneFlip using shorthand [#6823](https://github.com/fabricjs/fabric.js/pull/6823)
- fix(fabric.Text) fix typo in cacheProperties preventing cache clear to work [#6775](https://github.com/fabricjs/fabric.js/pull/6775)
- fix(fabric.Canvas): Update backgroundImage and overlayImage coordinates on zoom change [#6777](https://github.com/fabricjs/fabric.js/pull/6777)
- fix(fabric.Object): add strokeuniform to object toObject output. [#6772](https://github.com/fabricjs/fabric.js/pull/6772)
- fix(fabric.Text): Improve path's angle detection for text on a path [#6755](https://github.com/fabricjs/fabric.js/pull/6755)
```

### Version 4.3.0
New feature: Text on a path!
This was a long time requested feature, with the name of curved text. We decided to go to path support, and leave developers figure out how to do a path that looks like a curve.
This feature is still in BETA, meaning that it renders correctly, with most features of static text.
It does not account for text editing or wrapping or multiline.
(check pr [#6543](https://github.com/fabricjs/fabric.js/pull/6543))

Another new feature of this release is the ability to specify control size per control rather than per obejct.
fabric.Control.sizeX and fabric.Control.sizeY will take precedence on cornerSize.
(check pr [#6562](https://github.com/fabricjs/fabric.js/pull/6562))

A special thanks to those people for contributing in this release:
[Steve Eberhardt](https://github.com/melchiar)
[Jason Sturges](https://github.com/jasonsturges)
[Claas Cassens](https://github.com/claas-c)
[Victor Hagsand](https://github.com/virror)
[gloriousjob](https://github.com/gloriousjob)
[SlaneYang](https://github.com/proYang)

```
- fix(fabric.Textbox): Do not let splitbygrapheme split text previously unwrapped [#6621](https://github.com/fabricjs/fabric.js/pull/6621)
- feat(fabric.controlsUtils) Move drag to actions to control handlers [#6617](https://github.com/fabricjs/fabric.js/pull/6617)
- feat(fabric.Control): Add custom control size per control. [#6562](https://github.com/fabricjs/fabric.js/pull/6562)
- fix(svg_export): svg export in path with gradient and added tests [#6654](https://github.com/fabricjs/fabric.js/pull/6654)
- fix(fabric.Text): improve compatibility with transformed gradients [#6669](https://github.com/fabricjs/fabric.js/pull/6669)
- feat(fabric.Text): Add ability to put text on paths BETA [#6543](https://github.com/fabricjs/fabric.js/pull/6543)
- fix(fabric.Canvas): rotation handle should take origin into account [#6686](https://github.com/fabricjs/fabric.js/pull/6686)
- fix(fabric.Text): Text on path, fix non linear distance of chars over path  [#6671](https://github.com/fabricjs/fabric.js/pull/6671)
```

### Version 4.2.0
Just minor fixes, mouseup event can again have a different target compared to mousedown, and the textbox controls correctly fire a resize event rather than a scaling one.
```
- fix(fabric.utils): ISSUE-6566 Fix SVGs for special Arc lines [#6571](https://github.com/fabricjs/fabric.js/pull/6571)
- fix(fabric.Canvas): Fix mouse up target when different from action start [#6591](https://github.com/fabricjs/fabric.js/pull/6591)
- added: feat(fabric.controlsUtils): Fire resizing event for textbox width [#6545](https://github.com/fabricjs/fabric.js/pull/6545)
```

### Version 4.1.0
Added a `before:path:created` event, as a user request, in order to handle brushes objects before they get added to canvas.
Generic Path change of logic. Now complex SVG paths are simplified into an absolute only command version. On top of that, A, S, T, V and H commands are converted to C, Q and L. With this done, it is simpler to connect custom controls to path properties, and also it made it possible to add a path measure utility that we will need to implement the long requested text on a path feature.
```
- feat(Brushes): add beforePathCreated event #6492;
- feat(fabric.Path): Change the way path is parsed and drawn. simplify path at parsing time #6504;
- feat(fabric.Path): Simplify S and T command in C and Q. #6507;
- fix(fabric.Textbox): ISSUE-6518 Textbox and centering scaling #6524;
- fix(fabric.Text): Ensure the shortcut text render the passed argument and not the entire line #6526;
- feat(fabric.util): Add a function to work with path measurements #6525;
- fix(fabric.Image): rendering pixel outside canvas size #6326;
- fix(fabric.controlsUtils): stabilize scaleObject function #6540;
- fix(fabric.Object): when in groups or active groups, fix the ability to shift deselect #6541;
```
### Version 4.0.0
Added a new api to handle controls customizations. Read more here [controls api](/controls-api)

Several breaking changes. Read more here [V4 breaking changes](/v4-breaking-changes)
### Version 3.6.4 - 3.6.6
Just backporting some generic fixes from the 4.0 work.
```
- fix(fabric.Image): fix safari drawing bug for using drawImage outside element boundaries #6326
- fix(fabric.Itext): fix copy paste of text with style #6418
- fix(fabric.Itext): carry over style of selected test when replacing by typing (cherry-pick) #6172
```
### Version 3.6.3
Mostly backporting work that happened after 4 beta to version 3 branch
```
- fix(Object): ISSUE 6196 use set('canvas') to restore canvas #6216
- fix(fabric.IText): exitEditing won't error on missing hiddenTextarea. #6138
- fix(fabric.Object): getObjectScaling takes in account rotation of objects inside groups. #6118
- fix(fabric.Group): will draw shadow will call parent method. #6116
- fix(svg_parsers): Add support for empty \<style/\> tags (#6169)
- fix(SVG_export, text): Check font faces markup for objects within groups (#6195)
- fix(svg_export): remove extra space from svg export (#6209)
- fix(svg_import): ISSUE-6170 do not try to create missing clippath (#6210)
- fix(fabric.Object) Adding existence check for this.canvas on object stacking mixins (#6207)
```
### Version 3.6.2
```
- fix fabric.Object.toDataURL blurriness on images with odd pixel number [#6131](https://github.com/fabricjs/fabric.js/pull/6131)
```
### Version 3.6.1
```
- fix(gradient, text): ISSUE-6014 ISSUE-6077 support percentage gradient in text [#6090](https://github.com/fabricjs/fabric.js/pull/6090)
- fix(filters): ISSUE-6072 convolution filter is off by one [#6088](https://github.com/fabricjs/fabric.js/pull/6088)
- fix(transform): Fix a bug in the skewing logic [#6082](https://github.com/fabricjs/fabric.js/pull/6088)
```
### Version 3.6.0
```
- fix: ISSUE-5512 better Clippath transform parsing in SVG [#5983](https://github.com/fabricjs/fabric.js/pull/5983)
- fix: ISSUE-5984 Avoid enter editing in non selectable object [#5989](https://github.com/fabricjs/fabric.js/pull/5989)
- Tweak to object._setLineDash to avoid cycles when nothing in array [#6000](https://github.com/fabricjs/fabric.js/pull/6000)
- fix: ISSUE-5867 Fix the extra new line selection with empty line [#6011](https://github.com/fabricjs/fabric.js/pull/6011)
- Improvement: Use SVG Namespace for SVG Elements [#5957](https://github.com/fabricjs/fabric.js/pull/5957)
- Improvement: ISSUE-4115 - triggers in/out events for sub targets [#6013](https://github.com/fabricjs/fabric.js/pull/6013)
- Improvement: Upper canvas retina scaling [#5938](https://github.com/fabricjs/fabric.js/pull/5938)
```
### Version 3.5.1
```
- Fix for textbox non defined in scaleObject [#5896](https://github.com/fabricjs/fabric.js/pull/5896)
- Fix canvas pattern as background and exports [#5973](https://github.com/fabricjs/fabric.js/pull/5973)
- Fix for type error if style is null when checking if is empty [#5971](https://github.com/fabricjs/fabric.js/pull/5971)
- Fix for load from datalessJSON for svg groups with sourcePath [#5970](https://github.com/fabricjs/fabric.js/pull/5970)
```
### Version 3.5.0
```
- Deprecation: deprecated 3 method of the api that will disappear in fabric 4: setPatternFill, setColor, setShadow.
- Fix: remove line dash modification for strokeUniform [#5953](https://github.com/fabricjs/fabric.js/pull/5953)
- Improvement: ISSUE-5955 parse svg clip-path recursively [#5960](https://github.com/fabricjs/fabric.js/pull/5960)
- Fix: object.toCanvasElement of objects in groups [#5962](https://github.com/fabricjs/fabric.js/pull/5962)
- change pencil brush finalize to be in line with other brushes [#5866](https://github.com/fabricjs/fabric.js/pull/5866)
```
### Version 3.4.0
  Huge rewrite of gradient parsing! Now gradients have a property more called `gradientUnits` and allow to specify gradients with percentages.
  A couple of deprecation for <code>Object.setGradient</code>. A new doc page explaining gradients from top to bottom coming soon.
```
- SVG import: Implement fill-opacity in on Path objects with gradients. #5812
- Animation: Trigger onChange and onComplete with the right values. #5813
- SVG import: Fix gradient parsing. #5836
```
### Version 3.3.0
Rewrite pointer/touch events! It seems now that pointer events and touch events can work correctly with multi fingers.
Attention has been made in freedrawing with accidental multi touch usage and ability to work with pencils.
Also a small fix for the word boundaries in text.
Some deprecation on old event properties required another minor version bump.
```
 - Differently support multi mouse events. #5785
 - Word boundary search update. #5788
```
### Version 3.2.0
This version is mainly a bug fix release for the new feature. It gets a minor bump because of official deprecation of Object.transformMatrix.
```
 - Fix Group.toSVG export missing opacity and visibility. #5755
 - Pass raw event information to brushes. #5687
 - Added deprecation warning for Object.transformMatrix. #5747
 - Fix decimante points breaking point drawing in freedrawing. #5771
```
### Version 3.1.0
A new property to the pencil brush has been added. The `decimate` will allow you to remove extra points to the brush and simplify the outcoming path.
also when parsing floats from SVG, now scientific notation with uppercase E is supported.

```
 - Fix free draw positioning. #5718
 - Improvement: Support scientific notation with uppercase E. #5731
 - Add: PencilBrush brush now support decimate property to remove dots that are too near to each other. #5718
```
### Version 3.0.0
Support for Node 4 and 6 is removed, now fabricJS uses JSDOM 15.1 also as SVG parser under node, and uses node-canvas 2.5+.
This brings improved support under node, including better text support.
splitByGrapheme and strokeUniform have been properly fixed.
Some new properties: <code>fabric.Shadow</code> gets nonScaling that makes the shadow fixed during scaling operations, <code>fabric.disableStyleCopyPaste</code>
will control style copy/pasting during copy operations between IText and Textbox objects. Finally <code>Canvas.enablePointerEvents</code> will let you use
pointer events instead of mouse events.
For image filtering <code>fabric.forceGLPutImageData</code> will let you set a slower but more compatible webgl texture copy. This helps on computer running on old intel hardware.
Detecting the presence of the hardware is developer duty.
Finally <code>fabric.Object.objectCaching</code> set to false will disable objectCaching only if current setup does not require it. Is not more a preference than a mandatory setting.
If an object has a clipPath, objectCaching will be automatically activated.
```
- Breaking: removed support for node 4 and 6. #5356
- Breaking: changed objectCaching meaning to disable caching only if possible. #5566
- Breaking: private method _setLineStyle can set only empty object now #5588
- Breaking: private method _getLineStyle can only return boolean now #5588
- Fix: splitByGrapheme can now handle cursor properly #5588
- Add: Added hasStroke and hasFill, helper methods for decisions on caching and for devs, change image shouldCache method #5567
- Fix: Canvas toObject won't throw error now if there is a clipPath #5556
- Add: added nonScaling property to shadow class #5558
- Fix: fixed import of Rect from SVG when has 0 dimensions. #5582
- Fix: Shadow offset in dataurl export with retina #5593
- Fix: Text can be used as clipPath in SVG export (output is not correct yet) #5591
- Add: Fabric.disableStyleCopyPaste to disable style transfers on copy-paste of itext #5590
- Fix: avoid adding quotes to fontFamily containing a coma #5624
- Fix: strokeUniform and cache dimensions #5626
- Fix: Do not call onSelect on objects that won't be part of the selection #5632
- Fix: fixed handling of empty lines in splitByGrapheme #5645
- Fix: Textbox selectable property not restored after exitEditing #5655
- Fix: 'before:selection:cleared' event gets target in the option passed #5658
- Added: enablePointerEvents options to Canvas activates pointer events #5589
- Fix: Polygon/Polyline/Path respect points position when initializing #5668
- Fix: Do not load undefine objects in group/canvas array when restoring from JSON or SVG. #5684
- Improvement: support for canvas background or overlay as gradient #5684
- Fix: properly restore clipPath when restoring from JSON #5641
- Fix: respect chainable attribute in observable mixin #5606
- Added: fabric.forceGLPutImageData #5672```

### Version 2.7.0
Added <code>strokeUniform</code> property, that lets you scale objects without deforming the stroke (only outside groups)
```
- Add: strokeUniform property, avoid stroke scaling with paths #5473
- Fix: fix bug in image setSrc #5502
- Add: strokeUniform import/export svg #5527
- Fix: GraphemeSplit and toSvg for circle #5544
- Improvement: support running in a XML document #5530```
### Version 2.6.0
Mostly svg fixes for this release, on input and output
```
- Fix: Shift click and onSelect function #5348
- Fix: Load from Json from images with filters and resize filters #5346
```
### Version 2.5.0
Mostly svg fixes for this release, on input and output
```
- Fix: Shift click and onSelect function #5348
- Fix: Load from Json from images with filters and resize filters #5346
```
### Version 2.4.6
Mostly svg fixes for this release, on input and output
```
- Fix: Shift click and onSelect function #5348
- Fix: Load from Json from images with filters and resize filters #5346
```
### Version 2.4.5
Mostly svg fixes for this release, on input and output
```
- Fix: Shift click and onSelect function #5348
- Fix: Load from Json from images with filters and resize filters #5346
```
### Version 2.4.4
```
- Fix: add clipPath to stateful cache check. #5384
- Fix: restore draggability of small objects #5379
- Improvement: Added strokeDashOffset to objects and from SVG import. #5398
- Fix: do not mark objects as invisible if strokeWidth is > 0 #5382
- Improvement: Better gradients parsing with xlink:href #5357
```
### Version 2.4.3
A handful of fixes for group and clipPaths, Image serializations and filters, click interactions
```
- Fix: Shift click and onSelect function #5348
- Fix: Load from Json from images with filters and resize filters #5346
- Fix: Remove special case of 1x1 rect #5345
- Fix: Group with clipPath restore #5344
- Fix: Fix shift + click interaction with unselectable objects #5324
```
### Version 2.4.2
Clippath to SVG fixed, a couple of nice bugfixes for targeting in nested groups and svg loading in ie11
```
- Fix: Better toSVG support to enable clipPath #5284
- Fix: Per pixel target find and groups and sub targets #5287
- Fix: Object clone as Image and shadow clipping #5308
- Fix: IE11 loading SVG #5307
```
### Version 2.4.1
First round of feedback for clipPath bugs, plus other bugfixes that piled up while working on clipPaths
```
- Fix: Avoid enterEditing if another object is the activeObject #5261
- Fix: clipPath enliving for Image fromObject #5279
- Fix: toDataURL and canvas clipPath #5278
- Fix: early return if no xml is available #5263
- Fix: clipPath svg parsing in nodejs #5262
- Fix: Avoid running selection logic on mouse up #5259
- Fix: fix font size parsing on SVG #5258
- Fix: Avoid extra renders on mouseUp/Down #5256
```
### Version 2.4.0
Launched clipPath support, check tutorial for more info <a href="/clippath-part1" >ClipPath tutorials</a>
### Version 2.3.6

Fixed a regression in spray brush created by the 2.3.5 group fix.
Make the image class aware of natural dimensions of the image element if available and restored two fingers events that were broken since we improved the normal events.
The issue of iText interaction fixed in 2.3.5 has been reopened with a less common interaction problem. We are working on automated interaction tests before fixing it.

```
- Fix: Make image.class aware of naturalWidth and naturalHeight. #5178
- Fix: Make 2 finger events works again #5177
- Fix: Make Groups respect origin and correct position ( fix spray/circle brushes ) #5176
```
### Version 2.3.5

2 notable changes! From now canvas.getObjects() will return a copy of the array of objects. The documentation was never clear about what was given back. Not returning a copy was creating subtle strange bugs that often took hours to debug. Also resize filters and color filters should interact properly with each other now. On top of this minor improvements in svg import export.

```
- Change: make canvas.getObjects() always return a shallow copy of the array #5162
- Fix: Improve fabric.Pattern.toSVG to look correct on offsets and no-repeat #5164
- Fix: Do not enter edit in Itext if the mouseUp is relative to a group selector #5153
- Improvement: Do not require xlink namespace in front of href attribut for svgs ( is a SVG2 new spec, unsupported ) #5156
- Fix: fix resizeFilter having the wrong cached texture, also improved interaction between filters #5165
```
### Version 2.3.4

Lot of bug fixes and improvement by contributors. A big news: we have an automated visual tests suite that works across browser, node and travis.

Notable changes:

```
- Fix: ToSVG was ignoring excludeFromExport for backgroundImage and OverlayImage. #5075
- Fix: ToSVG for circle with start and end angles. #5085
- Fix: Added callback for setPatternFill. #5101
- Fix: Resize filter taking in account multiple scale sources. #5117
- Fix: Blend image filter clean after refilter. #5121
- Fix: Object.toDataURL should not be influenced by zoom. #5139
- Improvement: requestRenderAllBound add to Canvas instance. #5138
- Improvement: Make path bounding cache optional and also reacheable/cleanable #5140
- Improvement: Make the logic of isNeutralState filters work before filtering start. #5129
- Improvement: Added some code to clean up some memory when canvas is disposed in nodejs. #5142
- Fix: Make numeric origins work with group creation. #5143
```
### Version 2.3.3

Some well reported bugs got easily fixed. Generic fonts like serif, sans-serif, monospace works again. We were quoting the font name for all fonts in order to avoid problem with fonts starting with numbers or with spaces in the family name, but it looks like that you cannot do that for serif, sans-serif, fantasy, monospace and cursive. Those are sort of reserved name and must be used without quotes. Fabric was leaving trails of text selection if a fast zoom would happen when an itext had selected text or blinking cursor. While this is an edge case created by developers, the fix was fairly easy and so we fixed it. Also zero width characters were correctly measured but then wrongly retrieved from measuring cache. That whould mean that text would break and also that there was a performance hit ( very small ) since a 0 width joiner, spacer, non joiner was always measured and never returned from cache. All the fix have been handled in a single PR that you can check here: <br /> <a href="https://github.com/fabricjs/fabric.js/pull/5048" >#5048</a>

### Version 2.3.2
Lot of small IText fixes and a group caching bug removed.
```
 - Fix: justify + charspacing + textDecoration Add and improve more events for transformations and mouse interaction. #5007 #5009
 - Fix: Enter edit on object selected programmatically. #5010
 - Fix: Canvas.dispose was not removing all events properly. #5020
 - Fix: Make rgba and hsla regex work case insensitive. #5017
 - Fix: Make group transitioning from not cached to cached work. #5021
 ```
### Version 2.3.0
Added new events and a performance improvement for pixel transparency on cached object. Cached objects gets now sampled directly on their cached to check for transparency without a repaint. Check the new events <a href="/new-events">here</a>
```
- Add and improve more events for transformations and mouse interaction #4979
- Improvement: whenever possible use cache for target transparency sampling #4955
```
### Version 2.2.4
Just fixes to brushes, filters and events mostly coming from contributors.
A new method is added isPartiallyOnscreen for objects, helps you identify when the object is crossing your viewport boundaries and an important bug in statefull processing is fixed that was causing type errors when comparing an array with null or an object with null or a string
```
- Fix getPointer on touch devices #4866
- Fix issues with selectionDashArray bleeding into free drawing #4894
- Fix blur filter for nodejs #4905
- Fix Register mousemove as non passive to help touch devices #4933
- Fix modified shadow tosvg for safari compatibility #4934
- Fix shader to avoid premultiplied alpha pixel getting dirty in blend filter #4936
- Add isPartiallyOnScreen method #4856
- Fix isEqual failing on array/null or objects/null/string compare #4949
- Fix pencilBrush with alpha and with rerendering canvas #4938
```
### Version 2.2.3
There are mixed changes. Most of them are about toSVG and fromSVG without new big features.<br />
  There 2 changes that may interests you and change how your code behaves:<br />
  When rotating an object by mouse, the origins are no more forced to be centered, that means that top and left of the rotating object
  will not change to centerPoint without you asking for that. Top and Left will change accordingly to what you see on screen, like it happens
  for scale, skew and translate. Is a good change, but it may be considered a behaviour change. I did not feel like leave it like this nor to issue
  a major version for it. <br />
  Another change is that setSrc on image is also going to reset width and heigth to the one of the element. Since width and height now crop an image
  or just render it with white space around if dimensions do not match, changing width and heigth back to default is something that i consider a bugfix.
  If you built a feature between 2.0 and 2.2.2 that rely on swapping image sources and not changing widht and height, this may gonna break.

```
-  improvement: Allow to parse quoted url string. url('#myid') #4881
-  improvement: text fromSVG import char-spacing attribute #3718
-  fix: text toSVG export with multiple spaces in safari #4880
-  fix: setSrc reset width and height on images #4877
-  improvements: Removed forced origin swap when rotating #4878
-  fix: Make the background of canvas cover all SVG in toSVG export #4852
-  fix: Added startAngle to cacheProperties for fabric.Circle #4875
-  fix: Rerender all the content of upperCanvas if canvas gets resized #4850
-  fix: Remove references to context when disposing #4846
-  improvements: Added single quoting to font names in toSVG #4840
-  improvements: Added reserved space to wrapLine functionality #4841
```
### Version 2.2.2
```
-  Fixed: Applying filters to an image will invalidate its cache #4828
-  Fixed: Attempt at fix font families that requires quoting #4831
-  Improvement: check upperCanvas client size for textarea position #4827
-  Fixed: Attempt to fix multiple touchends #4804
-  Fixed: Wrapping of textbox with charspacing #4803
-  Fixed: bad calculation of empty line in text (regression from 2.2.0) #4802
```
### Version 2.2.0
```
-  New feature: superscript and subscript! check the demo to see how to activate it, along with the docs.
-  Fixes to text kerning with fonts that have a positive kerning on couples
-  Fixed: super/sub script svg export #4780
-  Added: Text superScript and subScript support #4765
-  Fixed: negative kerning support (Pacifico font) #4772
-  Fixed: removing text on mousedown should be safe now #4774
-  Improved: pass to inner functions the parameter calculate coords in isOnscreen #4763
```
### Version 2.1.0

New events! now objects and canvas can fire <code>drop</code>, <code>dragover</code>, <code>dragleave</code> and <code>dragenter</code>
Refer to our events demo for an introduction, specific demo coming soon: <a href="/events" >Events demo</a>.
Also an important fix for styled textboxes, and more to come, since some methods are marked as broken in the current JSDOC sources.
Since it has been requested, the amd footer has been inserted in the standard fabricjs build, removing the need to have 2 files built every time.

```
-  Added: Drag and drop event binding #4421
-  Fixed: isEmptyStyle implementation for TextBox #4762
```
### Version 2.0.3

This time is contributors time!
<a href="https://github.com/boomyao">@boomayao</a> noticed that the pencilBrush was doing too much work and wrote a function to draw just the new segment, <a href="https://github.com/stefanhayden">@stefanhayden</a> fixed the clanStyle function for text styles, <a href="https://github.com/scriptspry">@scriptspry</a> fixed a weird interaction between onBeforeScaleRotate and canvasZoom, <a href="https://github.com/blucobalto">@blucobalto</a> reported the exact line and problem of a group subclass problem.

```
-  Fix: now sub target check can work with subclasses of fabric.Group #4753
-  Improvement: PencilBrush is now compexity 1 instead of complexity N during draw #4743
-  Fix the cleanStyle was not checking for the right property to exist #4751
-  Fix onBeforeScaleRotate with canvas zoom #4734
```
### Version 2.0.2

Fix image toSVG export for images with cropping. Improved math around coordinates to avoid long decimals

### Version 2.0.1

Fix a bad mutation problem for filters in Image restore from JSON, also the interaction between retina and dataURL. Both bugfixes coming from contributors.

```
- fixed filter for blend image in WEBGL
- fixed interactions between canvas toDataURL and multiplier + retina
- fixed bug with originX and originY not invalidating the transform
- fixed unwanted mutation on object enliving in fabric.Image```
