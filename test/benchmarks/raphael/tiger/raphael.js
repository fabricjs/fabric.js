
function runRaphael(container, testContext) {

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

    testContext.start();
    // https://dmitrybaranovskiy.github.io/raphael/reference.html#Raphael
    var shape = Raphael([container, 600, 600, ...TIGER_DATA]).translate(200, 200);
    shape.drag(start, move, up);
    testContext.end();
}