
function run(testContext) {
    fabric.Object.prototype.transparentCorners = false;

    var getRandomInt = fabric.util.getRandomInt;
    function getRandomColor() {
        return getRandomInt(0, 255).toString(16)
            + getRandomInt(0, 255).toString(16)
            + getRandomInt(0, 255).toString(16);
    }
    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    function addResult(title, result) {
        var el = fabric.util.getById('results');
        el.innerHTML += ('<h3 style="display:inline-block;">' + title + '</h3><p style="margin-left:1em;margin-right:1em;display:inline-block">' + result + '</p>');
    }

    var canvas = new fabric.Canvas('test');

    var t1, t2,
        lim = 50,
        offset = 50,
        width = canvas.getWidth(),
        height = canvas.getHeight();

    testContext.start('initialization');
    for (var i = lim; i--;) {
        canvas.add(new fabric.Rect({
            width: getRandomInt(10, 50),
            height: getRandomInt(10, 50),
            fill: '#' + getRandomColor(),
            opacity: getRandomNum(0.5, 1),
            angle: getRandomInt(0, 180),
            top: getRandomInt(0 + offset, height - offset),
            left: getRandomInt(0 + offset, width - offset)
        }));

        canvas.add(new fabric.Circle({
            radius: getRandomInt(10, 50),
            fill: '#' + getRandomColor(),
            opacity: getRandomNum(0.5, 1),
            top: getRandomInt(0 + offset, height - offset),
            left: getRandomInt(0 + offset, width - offset)
        }));

        canvas.add(new fabric.Triangle({
            width: getRandomInt(10, 50),
            height: getRandomInt(10, 50),
            fill: '#' + getRandomColor(),
            opacity: getRandomNum(0.5, 1),
            angle: getRandomInt(0, 180),
            top: getRandomInt(0 + offset, height - offset),
            left: getRandomInt(0 + offset, width - offset)
        }));
    }

    testContext.end('initialization');
    testContext.start('rendering');
    canvas.renderAll();
    testContext.end();
}

async function test() {
    const testContext = new TestContext();
    run(testContext);
    const results = testContext.finish();

    function parseResults(res) {
        return Object.keys(res).map(key => `${key}: ${res[key]} ms`).join('<br>');
    }

    document.getElementById('results').innerHTML = parseResults(results);

    window.parent.postMessage({
        type: 'test',
        results
    }, '*');
}

window.addEventListener('load', () => test());