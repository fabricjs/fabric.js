(function () {

    const baseUrl = '/benchmarks/raphael-images';
    const url = `${baseUrl}/pug.jpg`;

    fabric.Object.prototype.transparentCorners = false;

    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    var numObjects = 20,
        loadedObjects = 0,
        width = 500,
        height = 500,
        opacity = 0.75;

    window.onload = function () {

        var logEl = document.getElementById('log');

        (function testRaphael() {

            var paper = Raphael("raphael", width, height),
                startTime = new Date();

            for (var i = numObjects; i--;) {
                img = paper.image(url, getRandomNum(-25, width), getRandomNum(-25, height), 100, 100);
                img.rotate(getRandomNum(0, 90));
                img.attr('opacity', opacity);
            }

            logEl.innerHTML = 'Raphael: <b class="bench">' + (new Date() - startTime) + '</b> ms<br>';

        })();

        (function testFabric() {

            var canvas = this.__canvas = new fabric.Canvas('canvas', {
                renderOnAddRemove: false,
                stateful: false
            }), totalTime = 0;

            function loaded() {
                if (++loadedObjects === numObjects) {
                    canvas.renderAll();
                    logEl.innerHTML += 'fabric: <b class="bench">' + totalTime + '</b> ms';
                }
            }

            for (var i = numObjects; i--;) {
                fabric.Image.fromURL(url)
                    .then((o) => {
                        var startTime = new Date();

                        o.set('left', getRandomNum(-25, width))
                            .set('top', getRandomNum(-25, height))
                            .scale(0.2)
                            .setCoords();
                        o.rotate(getRandomNum(0, 90));
                        o.set('opacity', opacity);
                        canvas.add(o);
                        totalTime += (new Date() - startTime);

                        loaded();
                    });
            }

            canvas.calcOffset();
        })();
    };
})();
