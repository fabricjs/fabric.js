
const baseUrl = '/benchmarks/raphael-images';
const url = `${baseUrl}/pug.jpg`;
const numObjects = 20,
    width = 500,
    height = 500,
    opacity = 0.75;

function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
}

async function run(runner) {
    const startTime = new Date();
    await runner();
    return new Date() - startTime;
}

function runRaphael(container) {
    const paper = Raphael(container, width, height);
    for (let i = numObjects, img; i--;) {
        img = paper.image(url, getRandomNum(-25, width), getRandomNum(-25, height), 100, 100);
        img.rotate(getRandomNum(0, 90));
        img.attr('opacity', opacity);
    }
}

function runFabric(canvasEl) {
    var canvas = this.__canvas = new fabric.Canvas(canvasEl, {
        renderOnAddRemove: false,
        stateful: false
    });
    const tasks = [];
    for (var i = numObjects; i--;) {
        tasks.push(fabric.Image.fromURL(url)
            .then((img) => {
                // var startTime = new Date();
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
                // totalTime += (new Date() - startTime);
            }));
    }

    return Promise.all(tasks)
        .then(() => {
            canvas.calcOffset();
            canvas.renderAll();
        });
}


async function test(raphaelContainer, canvasEl) {
    const raphaelResult = await run(() => runRaphael(raphaelContainer));
    const fabricResult = await run(() => runFabric(canvasEl));

    document.getElementById('raphael_result').innerHTML = raphaelResult;
    document.getElementById('fabric_result').innerHTML = fabricResult;

    QUnit.test('mip', assert => {
        assert.ok(fabricResult < raphaelResult, 'dkdkd')
    })
    // window.parent.postMessage({
    //     type: 'test',
    //     name: 'raphael-images',
    //     fabric: fabricResult,
    //     raphael: raphaelResult
    // }, '*');

}
