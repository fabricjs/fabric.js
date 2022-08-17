
const url = '/asset';
const numObjects = 20,
    width = 500,
    height = 500,
    opacity = 0.75;

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function runRaphael(container, testContext) {
    testContext.start('initialization');
    const paper = Raphael(container, width, height);
    testContext.end('initialization');
    testContext.start('rendering');
    for (let i = numObjects, img; i--;) {
        img = paper.image(url, getRandomNum(-25, width), getRandomNum(-25, height), 100, 100);
        img.rotate(getRandomNum(0, 90));
        img.attr('opacity', opacity);
    }
    testContext.end();
}

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
        tasks.push(fabric.Image.fromURL(url)
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
