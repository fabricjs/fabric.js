
function runFabric(canvasEl, testContext) {

    fabric.Object.prototype.transparentCorners = true;

    testContext.start('initialization');

    var canvas = new fabric.Canvas(canvasEl, {
        renderOnAddRemove: false,
        stateful: false,
        preserveObjectStacking: true
    });

    testContext.end('initialization');
    testContext.start('parsing');

    return new Promise(resolve => {
        fabric.loadSVGFromURL('/asset', function (objects) {
            testContext.end('parsing');
            testContext.start('rendering');

            var group = new fabric.Group(objects, {
                left: 300,
                top: 300,
                originX: 'center',
                originY: 'center',
                subTargetCheck: true,
                interactive: true,
                transparentCorners: false
            });

            canvas.add(group);
            canvas.calcOffset();
            canvas.renderAll();
            canvas.on('selection:created', opt => {
                opt.selected.forEach(obj => obj !== group && obj.set({ opacity: 0.5 }));
            });
            canvas.on('selection:updated', opt => {
                opt.selected.forEach(obj => obj !== group && obj.set({ opacity: 0.5 }));
                opt.deselected.forEach(obj => obj !== group && obj.set({ opacity: 1 }));
            });
            canvas.on('selection:cleared', opt => {
                opt.deselected.forEach(obj => obj !== group && obj.set({ opacity: 1 }));
            });

            testContext.end();
            resolve();
        });
    })

}
