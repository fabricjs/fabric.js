(function () {
    fabric.Object.prototype.objectCaching = true;
    var visualTestLoop;
    if (fabric.isLikelyNode) {
        visualTestLoop = global.visualTestLoop;
    }
    else {
        visualTestLoop = window.visualTestLoop;
    }

    var tests = [];

    function createGroupForLayoutTests(text, options) {
        var circle = new fabric.Circle({
            left: 100,
            top: 50,
            radius: 50
        });
        var itext = new fabric.IText(text, {
            left: 100,
            top: 150
        });
        var rect = new fabric.Rect({
            top: 200,
            width: 50,
            height: 50,
            fill: 'red',
            opacity: 0.3
        })
        return new fabric.Group([
            rect,
            circle,
            itext
        ], options);
    }

    function fixedLayout(canvas, callback) {
        var g = createGroupForLayoutTests('fixed layout', {
            backgroundColor: 'azure',
            layout: 'fixed',
            width: 50,
            height: 50,
            angle: 30
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }
/*
    tests.push({
        test: 'fixed layout with width, height, angle values',
        code: fixedLayout,
        golden: 'group-fixed-layout.png',
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });
*/
    function fitContentLayout(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout',
        code: fitContentLayout,
        golden: 'group-fit-content-layout.png',
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutChange(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        g.item(0).setX(50);
        g.item(1).set({ skewX: -45 });
        g.item(2).rotate(45);
        g.triggerLayout();
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout after change',
        code: fitContentLayoutChange,
        golden: 'group-fit-content-layout2.png',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutAdd(canvas, callback) {
        var g = createGroupForLayoutTests('fit-content layout', {
            backgroundColor: 'blue'
        });
        var rect = new fabric.Rect({
            top: 200,
            left: 50,
            width: 50,
            height: 50,
            fill: 'red',
            angle: 15,
            skewY: 30
        })
        g.add(rect);
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'fit-content layout add object',
        code: fitContentLayoutAdd,
        golden: 'group-fit-content-layout3.png',
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function clipPathLayout(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout',
        code: clipPathLayout,
        golden: 'group-clip-path-layout.png',
        percentage: 0.06,
        width: 300,
        height: 300
    });

    function clipPathLayoutWithScale(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
                scaleX: 0.6
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout scaleX value',
        code: clipPathLayoutWithScale,
        golden: 'group-clip-path-layout1.png',
        percentage: 0.06,
        width: 300,
        height: 300
    });

    function clipPathLayout2(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: 'magenta',
            clipPath: new fabric.Circle({
                radius: 110,
                left: -150,
                top: -100,
                scaleX: 1.5,
            }),
            layout: 'clip-path'
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'clip-path layout left, top, originX, originY, scaleX values - WRONG',
        code: clipPathLayout2,
        golden: 'group-clip-path-layout2.png',
        percentage: 0.06,
        width: 330,
        height: 330
    });

    function absClipPathLayout(canvas, callback) {
        var g = createGroupForLayoutTests('clip path layout', {
            backgroundColor: '#0dcaf0',
            clipPath: new fabric.Circle({
                radius: 110,
                originX: 'center',
                originY: 'center',
                absolutePositioned: true,
                left: 50,
                top: 150,
                skewX: 20
            }),
            layout: 'clip-path',
        });
        canvas.add(g);
        canvas.renderAll();
        callback(canvas.lowerCanvasEl);
    }

    tests.push({
        test: 'absolute clip-path layout',
        code: absClipPathLayout,
        golden: 'group-clip-path-layout3.png',
        percentage: 0.06,
        width: 250,
        height: 250
    });

    function createObjectsForOriginTests(originX, originY, options) {
        var rect1 = new fabric.Rect({ top: 100, left: 150, width: 30, height: 10, strokeWidth: 0 }),
            rect2 = new fabric.Rect({ top: 120, left: 200, width: 10, height: 40, strokeWidth: 0 }),
            controlPoint = new fabric.Circle({ radius: 5, fill: 'blue', left: 150, top: 100, originX: 'center', originY: 'center' });
        
        var g = new fabric.Group([rect1, rect2], Object.assign({}, options, {
            originX, originY, strokeWidth: 1, stroke: 'blue'
        }));
        return [controlPoint, g];
    }

    var originX = ['left', 'center', 'right'];
    var originY = ['top', 'center', 'bottom'];

    originX.forEach(ox => {
        originY.forEach(oy => {
            tests.push({
                test: 'absolute clip-path layout',
                code: function (canvas, callback) {
                    canvas.add(...createObjectsForOriginTests(ox, oy));
                    canvas.renderAll();
                    callback(canvas.lowerCanvasEl);
                },
                golden: `group-origin-layout-${ox}-${oy}.png`,
                percentage: 0.06,
                width: 300,
                height: 300
            });
        })
    })

    tests.forEach(visualTestLoop(QUnit));
})();
