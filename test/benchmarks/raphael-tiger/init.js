(function () {

    const baseUrl = '/benchmarks/raphael-tiger';
    const url = `${baseUrl}/tiger.svg`;

    fabric.Object.prototype.transparentCorners = true;
    window.onload = function () {

        var logEl = document.getElementById('log');

        (function testFabric() {

            var canvas = this.__canvas = new fabric.Canvas('canvas', {
                renderOnAddRemove: false,
                stateful: false,
                preserveObjectStacking: true
            });

            //console.profile('parsing');
            var startTime2 = new Date();
            fabric.loadSVGFromURL(url, function (objects) {

                //console.profileEnd('parsing');

                var startTime = new Date();

                var group = new fabric.Group(objects, {
                    left: 65,
                    top: 100,
                    width: 495,
                    height: 511,
                    subTargetCheck: true,
                    interactive: true,
                    transparentCorners: false
                });
                var loadTime = new Date() - startTime2;
                canvas.add(group);
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

                var renderingTime = new Date() - startTime;
                logEl.innerHTML += `fabric: <b class="bench">${loadTime + renderingTime}</b> ms (parsing: ${loadTime}, first rendering: ${renderingTime}, complexity: ${group.complexity()} paths)`;
            });

            canvas.calcOffset();

        })();

        (function testRaphael() {

            var start = function () {
                // storing original coordinates
                this.ox = this.attr("cx");
                this.oy = this.attr("cy");
                this.attr({ opacity: .5 });
            },
                move = function (dx, dy) {
                    // move will be called with dx and dy
                    this.attr({ cx: this.ox + dx, cy: this.oy + dy });
                },
                up = function () {
                    // restoring state
                    this.attr({ opacity: 1 });
                };

            var startTime = new Date();
            var shape = Raphael(["raphael", 600, 600, ...tiger]).translate(200,200);
            shape.drag(start, move, up);

            logEl.innerHTML = 'Raphael: <b class="bench">' + (new Date() - startTime) + '</b> ms<br>';

        })();
    };
})();
