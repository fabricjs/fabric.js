QUnit.module('draggable text', function (hooks) {
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

    [true, false].forEach(enableRetinaScaling => {
        QUnit.module(`enableRetinaScaling = ${enableRetinaScaling}`, function (hooks) {
            let canvas, eventData, iText, iText2;
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
                count = 0;
                countCanvas = 0;
                iText = new fabric.IText('test test');
                iText2 = new fabric.IText('test2 test2', { left: 200 });
                canvas.add(iText, iText2);
                canvas.on('text:selection:changed', () => {
                    countCanvas++;
                });
                iText.on('selection:changed', () => {
                    count++;
                });
            });
            hooks.afterEach(() => canvas.dispose());
          
            function startDragging() {
              
            }

            QUnit.test('draggable: click', function (assert) {
                iText.enterEditing();
                iText.selectionStart = 0;
                iText.selectionEnd = 4;
                assert.equal(count, 1, 'selection:changed fired');
                assert.equal(countCanvas, 1, 'text:selection:changed fired');
                let called = 0;
                // sinon spy!!
                // iText.setCursorByClick = () => called++;
                iText.fire('mousedown:before', {
                    e: eventData,
                    pointer: canvas.getPointer(eventData, true)
                });
                assert.ok(iText.__isDragging);
                iText.fire('mousedown', {
                    e: eventData,
                    pointer: canvas.getPointer(eventData, true)
                });
                assert.ok(iText.__isDragging, 'flagged as dragging');
                // assert.equal(called, 0, 'should not set cursor on mouse up');
                iText.fire('mouseup', {
                    e: eventData,
                    pointer: canvas.getPointer(eventData, true),
                    isClick: true
                });
                assert.ok(!iText.__isDragging, 'unflagged as dragging');
                // assert.equal(called, 1, 'should set cursor on mouse up');
                assert.equal(iText.selectionStart, 2, 'Itext set the selectionStart');
                assert.equal(iText.selectionEnd, 2, 'Itext set the selectionend');
                assertCursorAnimation(assert, iText, true);
                assert.equal(count, 2, 'selection:changed fired');
                assert.equal(countCanvas, 2, 'text:selection:changed fired');
            });

            QUnit.test('drag start', function (assert) {
                canvas.setActiveObject(iText);
                const renderEffects = [];
                canvas._renderDragEffects = (e, source, target) => renderEffects.push({ e, source, target });
                iText.enterEditing();
                iText.selectionStart = 0;
                iText.selectionEnd = 4;
                assert.equal(count, 1, 'selection:changed fired');
                assert.equal(countCanvas, 1, 'text:selection:changed fired');
                iText.fire('mousedown:before', {
                    e: eventData,
                    pointer: canvas.getPointer(eventData, true)
                });
                assert.ok(iText.__isDragging);
                iText.fire('mousedown', {
                    e: eventData,
                    pointer: canvas.getPointer(eventData, true)
                });
                const eventStream = {
                    canvas: [],
                    source: [],
                    target: [],
                };
                ['dragstart', 'dragover', 'drag', 'dragenter', 'dragleave', 'drop', 'dragend'].forEach(type => {
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
          
                canvas._onDragStart(eventData);
                const charStyle = { "stroke": null, "strokeWidth": 1, "fill": "rgb(0,0,0)", "fontFamily": "Times New Roman", "fontSize": 40, "fontWeight": "normal", "fontStyle": "normal", "underline": false, "overline": false, "linethrough": false, "deltaY": 0, "textBackgroundColor": "" };
                assert.deepEqual(eventData.dataTransfer.data, {
                    'application/fabric': JSON.stringify({
                        value: 'test',
                        styles: [charStyle, charStyle, charStyle, charStyle]
                    }),
                    'text/plain': "test"
                }, 'should set dataTransfer');
                assert.equal(eventData.dataTransfer.effectAllowed, 'copyMove', 'should set effectAllowed');
                // assert.equal(eventData.defaultPrevented, true, 'drag event default prevented');
                assert.ok(eventData.dataTransfer.dragImageData.img instanceof HTMLCanvasElement, 'drag image was set');
                assert.equal(eventData.dataTransfer.dragImageData.x, 30, 'drag image position');
                assert.equal(eventData.dataTransfer.dragImageData.y, 15, 'drag image position');
                assert.deepEqual(eventStream, {
                    canvas: [{ target: iText, e: eventData }],
                    source: [{ target: iText, e: eventData }],
                    target: [],
                }, 'drag start fired');
                assert.deepEqual(renderEffects, [], 'not rendered effects yet');
                const dragEvent = { ...eventData, defaultPrevented: false };
                for (let index = 0; index < 350; index++) {
                    canvas._onDragOver({
                        ...eventData,
                        defaultPrevented: false,
                        clientX: eventData.clientX + index * (enableRetinaScaling ? canvas._getRetinaScaling() : 1)
                    });
                }
                // canvas._onDrop(dragEvent);
                canvas._onDragEnd(dragEvent);
                console.log(eventStream)
                // assert.deepEqual(renderEffects, [{ e: eventData, source: iText, target: iText }]);
            });
        });
    });
});