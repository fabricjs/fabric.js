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

    function prepareGroup(text, options) {
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

    function fitContentLayout(canvas, callback) {
        var g = prepareGroup('fit-content layout', {
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
        var g = prepareGroup('fit-content layout', {
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
        newModule: 'Group Layout',
        percentage: 0.06,
        width: 400,
        height: 300
    });

    function fitContentLayoutAdd(canvas, callback) {
        var g = prepareGroup('fit-content layout', {
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
        var g = prepareGroup('clip path layout', {
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
        var g = prepareGroup('clip path layout', {
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
        var g = prepareGroup('clip path layout', {
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
        var g = prepareGroup('clip path layout', {
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

    tests.forEach(visualTestLoop(QUnit));
})();
