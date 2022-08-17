
function test() {
    fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';
    fabric.Object.prototype.transparentCorners = false;

    var canvas = new fabric.Canvas('test');

    var fpsEl = document.getElementById('fps'),
        complexityEl = document.getElementById('complexity'),
        changeShapeEl = document.forms[0],
        shapePathEl = document.getElementById('shape-path'),
        scaleObjectEl = document.getElementById('scale-object'),
        scaleObjectOutputEl = document.getElementById('scale-object-output'),
        scaleCanvasEl = document.getElementById('scale-canvas'),
        scaleCanvasOutputEl = document.getElementById('scale-canvas-output'),
        canvasObjects,
        shapePath = '1.svg',
        coords = [{ x: 150, y: 150 }, { x: 450, y: 150 }, { x: 150, y: 450 }, { x: 450, y: 450 }],
        interval,
        prevTime,
        fps,
        lastUpdate = new Date(),
        shouldAbort = false;

    canvas.onFpsUpdate = function (value) {
        fpsEl.innerHTML = value;
        window.postMessage({
            type: 'test',
            name: 'fps',
            value
        });
    };

    shapePathEl.onchange = function () {
        if (shapePathEl.value) {
            shapePath = shapePathEl.value;
        }
        shouldAbort = true;
        canvas.clear();

        setTimeout(function () {
            loadShape();
            shouldAbort = false;
        }, 100);

        return false;
    };

    function scaleObjects() {
        scaleObjectOutputEl.firstChild.nodeValue = fabric.util.toFixed(scaleObjectEl.value, 2);
        for (var canvasObjects = canvas.getObjects(), i = canvasObjects.length; i--;) {
            canvasObjects[i].scaleX = scaleObjectEl.value;
            canvasObjects[i].scaleY = scaleObjectEl.value;
        }
    }

    scaleObjectEl.onchange = scaleObjects;

    scaleCanvasEl.onchange = function () {
        var scaleValue = fabric.util.toFixed(scaleCanvasEl.value, 2);
        scaleCanvasOutputEl.firstChild.nodeValue = scaleValue;

        canvas.setWidth(scaleValue).setHeight(scaleValue);
        canvas.renderAll();
    };

    var angle = 0;
    function animate() {
        var time = new Date(),
            currentFps = Math.round(1000 / (time - prevTime)),
            fpsUpdateInterval = time - lastUpdate;

        if (currentFps !== fps && fpsUpdateInterval > 500) {
            canvas.onFpsUpdate(currentFps);
            lastUpdate = new Date();
        }
        fps = currentFps;

        angle += 2;
        if (angle === 360) {
            angle = 0;
        }
        canvas.item(0) && canvas.item(0).set('angle', angle);
        canvas.item(1) && canvas.item(1).set('angle', angle);
        canvas.item(2) && canvas.item(2).set('angle', angle);
        canvas.item(3) && canvas.item(3).set('angle', angle);

        canvas.renderAll();

        prevTime = time;

        if (!shouldAbort) {
            fabric.util.requestAnimFrame(animate, canvas.upperCanvasEl);
        }
    }

    function loadShape() {
        for (var i = coords.length; i--;) {
            (function (i) {
                fabric.loadSVGFromURL('/assets/' + shapePath, function (objects, options) {
                    var pathGroup = new fabric.Group(objects, options);

                    pathGroup.set({
                        left: coords[i].x,
                        top: coords[i].y,
                        angle: 30,
                        fill: '#ff5555',
                        originX: 'center',
                        originY: 'center',
                    });
                    pathGroup.scale(scaleObjectEl.value);
                    pathGroup.setCoords();

                    canvas.add(pathGroup);

                    canvasObjects = canvas.getObjects();
                    if (canvasObjects.length === 4) {
                        animate();
                    }
                    setTimeout(function () {
                        complexityEl.innerHTML = canvas.complexity();
                    }, 50);
                });
            })(i);
        }
    }

    loadShape();

}

window.addEventListener('load', () => test());
