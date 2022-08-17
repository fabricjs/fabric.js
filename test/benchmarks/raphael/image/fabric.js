
async function runFabric(canvasEl, testContext) {
    testContext.start('initialization');
    const canvas = new fabric.Canvas(canvasEl, {
        renderOnAddRemove: false,
        stateful: false
    });
    testContext.end('initialization');
    testContext.start('rendering');
    const tasks = [];
    for (let i = numObjects; i--;) {
        tasks.push(fabric.Image.fromURL('/asset')
            .then((img) => {
                img.set({
                    left: getRandomNum(-25, width),
                    top: getRandomNum(-25, height),
                    opacity,
                    transparentCorners: true
                });
                img.scale(0.2);
                img.rotate(getRandomNum(0, 90));
                img.setCoords();
                canvas.add(img);
            }));
    }

    await Promise.all(tasks);
    canvas.calcOffset();
    canvas.renderAll();
    testContext.end('rendering');
    testContext.end();
}
