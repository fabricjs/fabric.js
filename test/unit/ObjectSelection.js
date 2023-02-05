QUnit.module('Object Selection', function (hooks) {
    let canvas;
    hooks.beforeEach(() => {
        canvas = this.canvas = new fabric.Canvas(null, { enableRetinaScaling: false, width: 600, height: 600 });
    });
    hooks.afterEach(() => {
        fabric.config.restoreDefaults();
        return canvas.dispose();
    });

    function stubCollectObjects(stub) {
        canvas._groupSelector.collectObjects = stub;
    }
    function getSelectionBBox() {
        return canvas._groupSelector.shape.getBoundingRect(true, true)
    }
    function collectObjects(bbox = getSelectionBBox(), e = {}) {
        return canvas._groupSelector.collectObjects(bbox, e);
    }
    function groupSelectedObjects(bbox = {}, e = {}) {
        return canvas._groupSelector.groupSelectedObjects(bbox, e);
    }

    QUnit.test('groupSelectedObjects fires selected for objects', function (assert) {
        var fired = 0;
        var rect1 = new fabric.Rect();
        var rect2 = new fabric.Rect();
        var rect3 = new fabric.Rect();
        stubCollectObjects(() => [rect1, rect2, rect3]);
        rect1.on('selected', function () { fired++; });
        rect2.on('selected', function () { fired++; });
        rect3.on('selected', function () { fired++; });
        groupSelectedObjects();
        assert.equal(fired, 3, 'event fired for each of 3 rects');
    });

    QUnit.test('groupSelectedObjects fires selection:created if more than one object is returned', function (assert) {
        var isFired = false;
        var rect1 = new fabric.Rect();
        var rect2 = new fabric.Rect();
        var rect3 = new fabric.Rect();
        stubCollectObjects(() => [rect1, rect2, rect3]);
        canvas.on('selection:created', function () { isFired = true; });
        groupSelectedObjects();
        assert.equal(isFired, true, 'selection created fired');
        assert.equal(canvas.getActiveObject().type, 'activeSelection', 'an active selection is created');
        assert.equal(canvas.getActiveObjects()[2], rect1, 'rect1 is first object');
        assert.equal(canvas.getActiveObjects()[1], rect2, 'rect2 is second object');
        assert.equal(canvas.getActiveObjects()[0], rect3, 'rect3 is third object');
        assert.equal(canvas.getActiveObjects().length, 3, 'contains exactly 3 objects');
    });

    QUnit.test('groupSelectedObjects fires selection:created if one only object is returned', function (assert) {
        var isFired = false;
        var rect1 = new fabric.Rect();
        stubCollectObjects(() => [rect1]);
        canvas.on('selection:created', function () { isFired = true; });
        groupSelectedObjects();
        assert.equal(isFired, true, 'selection:created fired for groupSelectedObjects');
        assert.equal(canvas.getActiveObject(), rect1, 'rect1 is set as activeObject');
    });

    QUnit.test('collectObjects collects object contained in area', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
        var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
        canvas.add(rect1, rect2, rect3, rect4);
        var collected = collectObjects({
            left: 1,
            top: 1,
            width: 15,
            height: 15
        });
        assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
        assert.equal(collected[3], rect1, 'contains rect1 as last object');
        assert.equal(collected[2], rect2, 'contains rect2');
        assert.equal(collected[1], rect3, 'contains rect3');
        assert.equal(collected[0], rect4, 'contains rect4 as first object');
    });

    QUnit.test('collectObjects do not collects object if area is outside', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
        var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
        canvas.add(rect1, rect2, rect3, rect4);
        var collected = collectObjects({
            left: 24,
            top: 24,
            width: 1,
            height: 1
        });
        assert.equal(collected.length, 0, 'a rect outside objects do not collect any of them');
    });

    QUnit.test('collectObjects collect included objects that are not touched by the selection sides', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 5, left: 5 });
        canvas.add(rect1);
        var collected = collectObjects({
            left: 1,
            top: 1,
            width: 20,
            height: 20
        });
        assert.equal(collected.length, 1, 'a rect that contains all objects collects them all');
        assert.equal(collected[0], rect1, 'rect1 is collected');
    });

    QUnit.test('collectObjects collect topmost object if no dragging occurs', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        canvas.add(rect1, rect2, rect3);
        var collected = collectObjects({
            left: 1,
            top: 1,
            width: 0,
            height: 0
        });
        assert.equal(collected.length, 1, 'a rect that contains all objects collects them all');
        assert.equal(collected[0], rect3, 'rect3 is collected');
    });

    QUnit.test('collectObjects collect objects if the drag is inside the object', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        canvas.add(rect1, rect2, rect3);
        var collected = collectObjects({
            left: 1,
            top: 1,
            width: 2,
            height: 2
        });;
        assert.equal(collected.length, 3, 'a rect that contains all objects collects them all');
        assert.equal(collected[0], rect3, 'rect3 is collected');
        assert.equal(collected[1], rect2, 'rect2 is collected');
        assert.equal(collected[2], rect1, 'rect1 is collected');
    });

    QUnit.test('collectObjects collects object fully contained in area', function (assert) {
        canvas._groupSelector.selectionFullyContained = true;
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
        var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
        canvas.add(rect1, rect2, rect3, rect4);
        var collected = collectObjects({
            left: -1,
            top: -1,
            width: 30,
            height: 30
        });
        assert.equal(collected.length, 4, 'a rect that contains all objects collects them all');
        assert.equal(collected[3], rect1, 'contains rect1 as last object');
        assert.equal(collected[2], rect2, 'contains rect2');
        assert.equal(collected[1], rect3, 'contains rect3');
        assert.equal(collected[0], rect4, 'contains rect4 as first object');
    });

    QUnit.test('collectObjects does not collect objects not fully contained', function (assert) {
        canvas._groupSelector.selectionFullyContained = true;
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
        var rect3 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 0 });
        var rect4 = new fabric.Rect({ width: 10, height: 10, top: 10, left: 10 });
        canvas.add(rect1, rect2, rect3, rect4);
        var collected = collectObjects({
            left: 5,
            top: 5,
            width: 20,
            height: 20
        });
        assert.equal(collected.length, 1, 'a rect intersecting objects does not collect those');
        assert.equal(collected[0], rect4, 'contains rect1 as only one fully contained');
    });

    QUnit.test('collectObjects does not collect objects that have onSelect returning true', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
        rect1.onSelect = function () {
            return true;
        };
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 2, left: 2 });
        canvas.add(rect1, rect2);
        var collected = collectObjects({
            left: 1,
            top: 1,
            width: 20,
            height: 20
        });
        assert.equal(collected.length, 1, 'objects are in the same position buy only one gets selected');
        assert.equal(collected[0], rect2, 'contains rect2 but not rect 1');
    });

    QUnit.test('collectObjects does not call onSelect on objects that are not intersected', function (assert) {
        var rect1 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 0 });
        var rect2 = new fabric.Rect({ width: 10, height: 10, top: 0, left: 10 });
        var onSelectRect1CallCount = 0;
        var onSelectRect2CallCount = 0;
        rect1.onSelect = function () {
            onSelectRect1CallCount++;
            return false;
        };
        rect2.onSelect = function () {
            onSelectRect2CallCount++;
            return false;
        };
        canvas.add(rect1, rect2);
        // Intersects none
        collectObjects({
            left: 25,
            top: 25,
            width: 1,
            height: 1
        });
        var onSelectCalls = onSelectRect1CallCount + onSelectRect2CallCount;
        assert.equal(onSelectCalls, 0, 'none of the onSelect methods was called');
        // Intersects one
        collectObjects({
            left: 0,
            top: 0,
            width: 5,
            height: 5
        });
        assert.equal(onSelectRect1CallCount, 0, 'rect1 onSelect was not called. It will be called in _setActiveObject()');
        assert.equal(onSelectRect2CallCount, 0, 'rect2 onSelect was not called');
        // Intersects both
        collectObjects({
            left: 0,
            top: 0,
            width: 15,
            height: 5
        });
        assert.equal(onSelectRect1CallCount, 1, 'rect1 onSelect was called');
        assert.equal(onSelectRect2CallCount, 1, 'rect2 onSelect was called');
    });

    
    QUnit.test('mouse:down and group selector', function (assert) {
        const e = { clientX: 30, clientY: 40, which: 1, target: canvas.upperCanvasEl };
        canvas._groupSelector.width = 0;
        const rect = new fabric.Rect({ width: 150, height: 150 });
        const expectedGroupSelector = { left: 30, top: 40, width: 0, height: 0 };
        canvas.absolutePan(new fabric.Point(50, 80));
        canvas.__onMouseDown(e);
        canvas.__onMouseMove(e);
        assert.deepEqual(getSelectionBBox(), expectedGroupSelector, 'a new groupSelector is created');
        canvas.add(rect);
        canvas.__onMouseUp(e);
        canvas.__onMouseDown(e);
        assert.equal(canvas._groupSelector.active, false, 'with object on target no groupSelector is started');
        rect.selectable = false;
        canvas.__onMouseUp(e);
        canvas.__onMouseDown(e);
        assert.deepEqual(canvas._groupSelector.active, false, 'with object non selectable but already selected groupSelector is not started');
        canvas.__onMouseUp(e);
        canvas.discardActiveObject();
        rect.isEditing = true;
        canvas.__onMouseDown(e);
        assert.deepEqual(canvas._groupSelector.active, false, 'with object editing, groupSelector is not started');
        canvas.__onMouseUp(e);
        canvas.discardActiveObject();
        rect.isEditing = false;
        canvas.__onMouseDown(e);
        canvas.__onMouseMove(e);
        assert.deepEqual(getSelectionBBox(), expectedGroupSelector, 'a new groupSelector is created');
        canvas.__onMouseUp(e);
    });

    QUnit.test('group selector is not affected by vpt change', function (assert) {
        var e = { which: 1, target: canvas.upperCanvasEl };
        canvas.__onMouseDown({ ...e, clientX: 15, clientY: 30 });
        canvas.__onMouseMove({ ...e, clientX: 30, clientY: 40 });
        canvas.setViewportTransform([2, 0, 0, 1, 80, 50]);
        canvas.__onMouseMove({ ...e, clientX: 30, clientY: 45 });
        assert.deepEqual(getSelectionBBox(), {
            left: 15,
            top: 30,
            width: 16,
            height: 16
        }, 'groupSelector is updated');
    });
});