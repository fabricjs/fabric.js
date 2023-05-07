function assertDragEventStream(name, a, b) {
    QUnit.assert.equal(a.length, b.length, `${name} event stream should be same in size`);
    a.forEach(({ target, dragSource, dropTarget, ..._a }, index) => {
        const { target: targetB, dragSource: dragSourceB, dropTarget: dropTargetB, ..._b } = b[index];
        QUnit.assert.equal(target, targetB, `target should match ${index}`);
        QUnit.assert.equal(dragSource, dragSourceB, `dragSource should match ${index}`);
        QUnit.assert.equal(dropTarget, dropTargetB, `dropTarget should match ${index}`);
        QUnit.assert.deepEqual(_a, _b, `event ${index} should match`);
    });
}

(isNode() ? QUnit.module.skip : QUnit.module)('draggable text', function (hooks) {
    let canvas;
    hooks.before(function () {
        canvas = new fabric.Canvas(null, {
            enableRetinaScaling: false
        });
    });
    hooks.after(() => canvas.dispose());
    hooks.afterEach(function () {
        canvas.clear();
        canvas.cancelRequestedRender();
    });

    function assertCursorAnimation(assert, text, active = false) {
        const cursorState = [text._currentTickState, text._currentTickCompleteState].some(
            (cursorAnimation) => cursorAnimation && !cursorAnimation.isDone()
        );
        assert.equal(cursorState, active, `cursor animation state should be ${active}`);
    }

    function wait(ms = 32) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    [true, false].forEach(enableRetinaScaling => {
        QUnit.module(`enableRetinaScaling = ${enableRetinaScaling}`, function (hooks) {
            let canvas, eventData, iText, iText2, eventStream, renderEffects;
            let count = 0, countCanvas = 0;
            hooks.before(() => {
                fabric.config.configure({ devicePixelRatio: 2 });
            });
            hooks.after(() => {
                fabric.config.restoreDefaults();
            });
            hooks.beforeEach(() => {
                canvas = new fabric.Canvas(null, {
                    enableRetinaScaling,
                });
                eventData = {
                    which: 1,
                    target: canvas.upperCanvasEl,
                    preventDefault() {
                        this.defaultPrevented = true;
                    },
                    stopPropagation() {
                        this.propagationStopped = true;
                    },
                    dataTransfer: {
                        data: {},
                        get types() {
                            return Object.keys(this.data);
                        },
                        dropEffect: 'none',
                        getData(type) {
                            return this.data[type];
                        },
                        setData(type, value) {
                            this.data[type] = value;
                        },
                        setDragImage(img, x, y) {
                            this.dragImageData = { img, x, y };
                        },
                    },
                    ...(enableRetinaScaling ? {
                        clientX: 60,
                        clientY: 30
                    } : {
                        clientX: 30,
                        clientY: 15
                    })
                };
                iText = new fabric.IText('test test');
                iText2 = new fabric.IText('test2 test2', { left: 200 });
                canvas.add(iText, iText2);
                canvas.setActiveObject(iText);
                iText.enterEditing();
                iText.selectionStart = 0;
                iText.selectionEnd = 4;
                count = 0;
                countCanvas = 0;
                canvas.on('text:selection:changed', () => {
                    countCanvas++;
                });
                iText.on('selection:changed', () => {
                    count++;
                });
                eventStream = {
                    canvas: [],
                    source: [],
                    target: [],
                };
                ['dragstart', 'dragover', 'drag', 'dragenter', 'dragleave', 'drop', 'dragend', 'changed', 'text:changed'].forEach(type => {
                    canvas.on(type, (ev) => {
                        eventStream.canvas.push({ ...ev, type });
                    });
                    iText.on(type, (ev) => {
                        eventStream.source.push({ ...ev, type });
                    });
                    iText2.on(type, (ev) => {
                        eventStream.target.push({ ...ev, type });
                    });
                });
                renderEffects = [];
                canvas._renderDragEffects = (e, source, target) => renderEffects.push({ e, source, target });
            });
            hooks.afterEach(() => canvas.dispose());
            
            function startDragging(eventData) {
                const e = { ...eventData };
                canvas._onMouseDown({ ...eventData });
                canvas._onDragStart(e);
                return e;
            }

            function createDragEvent(x = eventData.clientX, y = eventData.clientY, dataTransfer = {}) {
                return {
                    ...eventData,
                    defaultPrevented: false,
                    clientX: x,
                    clientY: y,
                    dataTransfer: {
                        ...eventData.dataTransfer,
                        ...dataTransfer
                    }
                };
            }

            QUnit.test('click sets cursor', async function (assert) {
                assert.equal(count, 0, 'selection:changed fired');
                assert.equal(countCanvas, 0, 'text:selection:changed fired');
                let called = 0;
                // sinon spy!!
                // iText.setCursorByClick = () => called++;
                canvas._onMouseDown(eventData);
                assert.ok(iText.draggableTextDelegate.isActive(), 'flagged as dragging');
                assert.ok(iText.shouldStartDragging(), 'flagged as dragging');
                
                await wait();
                assertCursorAnimation(assert, iText);
                // assert.equal(called, 0, 'should not set cursor on mouse up');
                canvas._onMouseUp(eventData);
                assert.ok(!iText.draggableTextDelegate.isActive(), 'unflagged as dragging');
                assert.ok(!iText.shouldStartDragging(), 'unflagged as dragging');
                // assert.equal(called, 1, 'should set cursor on mouse up');
                assert.equal(iText.selectionStart, 2, 'set the selectionStart');
                assert.equal(iText.selectionEnd, 2, 'set the selectionend');
                assertCursorAnimation(assert, iText, true);
                assert.equal(count, 1, 'selection:changed fired');
                assert.equal(countCanvas, 1, 'text:selection:changed fired');
            });

            QUnit.test('drag end over selection focuses hiddenTextarea', function (assert) {
                startDragging(eventData);
                iText.hiddenTextarea.blur();
                canvas._onDragEnd(createDragEvent());
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });

            QUnit.test('drag start', function (assert) {
                const e = startDragging(eventData);
                const charStyle = {
                    "stroke": null,
                    "strokeWidth": 1,
                    "fill": "rgb(0,0,0)",
                    "fontFamily": "Times New Roman",
                    "fontSize": 40,
                    "fontWeight": "normal",
                    "fontStyle": "normal",
                    "underline": false,
                    "overline": false,
                    "linethrough": false,
                    "deltaY": 0,
                    "textBackgroundColor": ""
                };
                assert.equal(e.dataTransfer.data['text/plain'], 'test', 'should set text/plain');
                assert.deepEqual(JSON.parse(e.dataTransfer.data['application/fabric']), {
                    value: 'test',
                    styles: [charStyle, charStyle, charStyle, charStyle]
                }, 'should set application/fabric');
                assert.equal(e.dataTransfer.effectAllowed, 'copyMove', 'should set effectAllowed');
                assert.ok(e.dataTransfer.dragImageData.img instanceof HTMLCanvasElement, 'drag image was set');
                assert.equal(e.dataTransfer.dragImageData.x, 30, 'drag image position');
                assert.equal(e.dataTransfer.dragImageData.y, 15, 'drag image position');
                assert.deepEqual(renderEffects, [], 'not rendered effects yet');
                canvas._onDragEnd(eventData);
                assert.deepEqual(eventStream.source, [
                    {
                        e,
                        target: iText,
                        type: 'dragstart'
                    }, {
                        e: eventData,
                        target: iText,
                        type: 'dragend',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        didDrop: false
                    }
                ], 'events should match');
                assert.deepEqual(eventStream.canvas, eventStream.source, 'events should match');
            });

            QUnit.test('disable drag start: onDragStart', async function (assert) {
                iText.onDragStart = () => false;
                const e = startDragging(eventData);
                assert.equal(iText.shouldStartDragging(), true, 'should flag dragging');
                assert.equal(iText.selectionStart, 0, 'selectionStart is kept');
                assert.equal(iText.selectionEnd, 4, 'selectionEnd is kept');
                assert.deepEqual(e.dataTransfer.data, {}, 'should not set dataTransfer');
                assert.equal(e.dataTransfer.effectAllowed, undefined, 'should not set effectAllowed');
                assert.deepEqual(e.dataTransfer.dragImageData, undefined, 'should not set dataTransfer');
            });

            QUnit.test('disable drag start: start', async function (assert) {
                iText.draggableTextDelegate.start = () => false;
                const e = startDragging(eventData);
                assert.equal(iText.shouldStartDragging(), false, 'should not flag dragging');
                assert.equal(iText.selectionStart, 2, 'selectionStart is set');
                assert.equal(iText.selectionEnd, 2, 'selectionEnd is set');
                assert.deepEqual(e.dataTransfer.data, {}, 'should not set dataTransfer');
                assert.equal(e.dataTransfer.effectAllowed, undefined, 'should not set effectAllowed');
                assert.deepEqual(e.dataTransfer.dragImageData, undefined, 'should not set dataTransfer');
            });

            QUnit.test('disable drag start: isActive', async function (assert) {
                iText.draggableTextDelegate.isActive = () => false;
                const e = startDragging(eventData);
                assert.equal(iText.shouldStartDragging(), false, 'should not flag dragging');
                assert.equal(iText.selectionStart, 0, 'selectionStart is kept');
                assert.equal(iText.selectionEnd, 4, 'selectionEnd is kept');
                assertCursorAnimation(assert, iText);
                assert.deepEqual(e.dataTransfer.data, {}, 'should not set dataTransfer');
                assert.equal(e.dataTransfer.effectAllowed, undefined, 'should not set effectAllowed');
                assert.deepEqual(e.dataTransfer.dragImageData, undefined, 'should not set dataTransfer');
            });

            QUnit.test('drag over: source', function (assert) {
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 0; index < 100; index++) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                const dragEnd = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                canvas._onDragEnd(dragEnd);
                assertDragEventStream('source', eventStream.source, [
                    { e, target: iText, type: 'dragstart' },
                    {
                        e: dragEvents[0],
                        target: iText,
                        type: 'dragenter',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(30, 15),
                        absolutePointer: new fabric.Point(30, 15),
                        isClick: false,
                        previousTarget: undefined
                    },
                    ...dragEvents.slice(0, 32).map(e => ({
                        e,
                        target: iText,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false
                    })),
                    ...dragEvents.slice(32, 93).map(e => ({
                        e,
                        target: iText,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText,
                        canDrop: true
                    })),
                    {
                        e: dragEvents[93],
                        target: iText,
                        type: 'dragleave',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(123, 15),
                        absolutePointer: new fabric.Point(123, 15),
                        isClick: false,
                        nextTarget: undefined
                    },
                    {
                        e: dragEnd,
                        target: iText,
                        type: 'dragend',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        didDrop: false,
                    }
                ]);
                assert.deepEqual(renderEffects, [
                    ...dragEvents.slice(0, 32).map(e => ({ e, source: iText, target: undefined })),
                    ...dragEvents.slice(32, 93).map(e => ({ e, source: iText, target: iText })),
                    ...dragEvents.slice(93).map(e => ({ e, source: iText, target: undefined })),
                ], 'render effects');
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });
            
            QUnit.test('drag over: target', function (assert) {
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 180; index < 190; index = index + 5) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                for (index = 0; index <= 20; index = index + 5) {
                    const dragOverEvent = createDragEvent(eventData.clientX + 190 * canvas.getRetinaScaling(), eventData.clientY - index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                const dragEnd = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                canvas._onDragEnd(dragEnd);
                assertDragEventStream('source in target test', eventStream.source, [
                    { e, target: iText, type: 'dragstart' },
                    {
                        e: dragEnd,
                        target: iText,
                        type: 'dragend',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        didDrop: false,
                    }
                ]);
                assertDragEventStream('target', eventStream.target, [
                    {
                        e: dragEvents[0],
                        target: iText2,
                        type: 'dragenter',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(210, 15),
                        absolutePointer: new fabric.Point(210, 15),
                        isClick: false,
                        previousTarget: undefined
                    },
                    ...dragEvents.slice(0, 5).map(e => ({
                        e,
                        target: iText2,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText2,
                        canDrop: true
                    })),
                    {
                        e: dragEvents[5],
                        target: iText2,
                        type: 'dragleave',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(220, 0),
                        absolutePointer: new fabric.Point(220, 0),
                        isClick: false,
                        nextTarget: undefined
                    },
                ]);
                assert.deepEqual(renderEffects, [
                    ...dragEvents.slice(0, 5).map(e => ({ e, source: iText, target: iText2 })),
                    ...dragEvents.slice(5).map(e => ({ e, source: iText, target: undefined })),
                ], 'render effects');
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });

            QUnit.test('drag over: canvas', function (assert) {
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 0; index < 10; index++) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                // canvas._onDrop(dragEvent);
                const dragEnd = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                canvas._onDragEnd(dragEnd);
                assertDragEventStream('canvas', eventStream.canvas, [
                    { e, target: iText, type: 'dragstart' },
                    ...dragEvents.map(e => ({
                        e,
                        target: iText,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false
                    })),
                    {
                        e: dragEnd,
                        target: iText,
                        type: 'dragend',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        didDrop: false,
                    }
                ]);
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });

            QUnit.test('drop on drag source', function (assert) {
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 70; index < 80; index = index + 5) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                const drop = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling(), undefined, { dropEffect: 'move' });
                canvas._onDrop(drop);
                canvas._onDragEnd(drop);
                assert.equal(iText.text, ' testestt', 'text after drop');
                assert.equal(iText.selectionStart, 4, 'selection after drop');
                assert.equal(iText.selectionEnd, 8, 'selection after drop');
                assertDragEventStream('drop on drag source', eventStream.source, [
                    { e, target: iText, type: 'dragstart' },
                    {
                        e: dragEvents[0],
                        target: iText,
                        type: 'dragenter',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(100, 15),
                        absolutePointer: new fabric.Point(100, 15),
                        isClick: false,
                        previousTarget: undefined
                    },
                    ...dragEvents.slice(0, 2).map(e => ({
                        e,
                        target: iText,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText,
                        canDrop: true
                    })),
                    {
                        action: 'drop',
                        index: 4,
                        type: 'changed'
                    },
                    {
                        e: drop,
                        target: iText,
                        type: 'drop',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText,
                        didDrop: true,
                        pointer: new fabric.Point(110, 15),
                    },
                    {
                        e: drop,
                        target: iText,
                        type: 'dragend',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText,
                        didDrop: true,
                    }
                ]);
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });

            QUnit.test('drop', function (assert) {
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 200; index < 210; index = index + 5) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                const drop = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling(), undefined, { dropEffect: 'move' });
                canvas._onDrop(drop);
                canvas._onDragEnd(drop);
                assert.equal(iText2.text, 'testestt2 test2', 'text after drop');
                assert.equal(iText2.selectionStart, 3, 'selection after drop');
                assert.equal(iText2.selectionEnd, 7, 'selection after drop');
                assertDragEventStream('drop', eventStream.target, [
                    {
                        e: dragEvents[0],
                        target: iText2,
                        type: 'dragenter',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(230, 15),
                        absolutePointer: new fabric.Point(230, 15),
                        isClick: false,
                        previousTarget: undefined
                    },
                    ...dragEvents.slice(0, 2).map(e => ({
                        e,
                        target: iText2,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText2,
                        canDrop: true
                    })),
                    {
                        action: 'drop',
                        index: 3,
                        type: 'changed'
                    },
                    {
                        e: drop,
                        target: iText2,
                        type: 'drop',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: iText2,
                        didDrop: true,
                        pointer: new fabric.Point(240, 15),
                    },
                ]);
                assert.equal(fabric.getDocument().activeElement, iText2.hiddenTextarea, 'should have focused hiddenTextarea');
            });

            QUnit.test('disable drop', function (assert) {
                iText2.canDrop = () => false;
                const e = startDragging(eventData);
                const dragEvents = [];
                let index;
                for (index = 200; index < 210; index = index + 5) {
                    const dragOverEvent = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling());
                    canvas._onDragOver(dragOverEvent);
                    dragEvents.push(dragOverEvent);
                }
                const drop = createDragEvent(eventData.clientX + index * canvas.getRetinaScaling(), undefined, { dropEffect: 'none' });
                // the window will not invoke a drop event so we call drag end to simulate correctly
                canvas._onDragEnd(drop);
                assert.equal(iText2.text, 'test2 test2', 'text after drop');
                assert.equal(iText2.selectionStart, 0, 'selection after drop');
                assert.equal(iText2.selectionEnd, 0, 'selection after drop');
                assertDragEventStream('drop', eventStream.target, [
                    {
                        e: dragEvents[0],
                        target: iText2,
                        type: 'dragenter',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false,
                        pointer: new fabric.Point(230, 15),
                        absolutePointer: new fabric.Point(230, 15),
                        isClick: false,
                        previousTarget: undefined
                    },
                    ...dragEvents.slice(0, 2).map(e => ({
                        e,
                        target: iText2,
                        type: 'dragover',
                        subTargets: [],
                        dragSource: iText,
                        dropTarget: undefined,
                        canDrop: false
                    })),
                ]);
                assert.equal(fabric.getDocument().activeElement, iText.hiddenTextarea, 'should have focused hiddenTextarea');
            });
        });
    });
});