
function start() {

    const baseUrl = '/benchmarks/raphael-images';
    const url = `${baseUrl}/pug.jpg`;
    const testResult = {
        fabric: 0,
        raphael: 0
    }

    fabric.Object.prototype.transparentCorners = false;

    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    var numObjects = 20,
        width = 500,
        height = 500,
        opacity = 0.75;
    var logEl = document.getElementById('log');

    (function testRaphael() {
        var startTime = new Date();
        var paper = Raphael("raphael", width, height)


        for (var i = numObjects; i--;) {
            img = paper.image(url, getRandomNum(-25, width), getRandomNum(-25, height), 100, 100);
            img.rotate(getRandomNum(0, 90));
            img.attr('opacity', opacity);
        }

        testResult.raphael = new Date() - startTime;

        logEl.innerHTML = `Raphael: <b class="bench">${testResult.raphael}</b> ms<br>`;
    })();

    (function testFabric() {
        var startTime = new Date();
        var canvas = this.__canvas = new fabric.Canvas('canvas', {
            renderOnAddRemove: false,
            stateful: false
        });
        var tasks = [];

        for (var i = numObjects; i--;) {
            tasks.push(fabric.Image.fromURL(url)
                .then((img) => {
                    // var startTime = new Date();
                    img.set({
                        left: getRandomNum(-25, width),
                        top: getRandomNum(-25, height),
                        opacity
                    });
                    img.scale(0.2);
                    img.rotate(getRandomNum(0, 90));
                    img.setCoords();
                    canvas.add(img);
                    // totalTime += (new Date() - startTime);
                }));
        }

        Promise.all(tasks)
            .then(() => {
                canvas.calcOffset();
                canvas.renderAll();
                testResult.fabric = new Date() - startTime;
                logEl.innerHTML += 'fabric: <b class="bench">' + testResult.fabric + '</b> ms';
            });
    })();
}
