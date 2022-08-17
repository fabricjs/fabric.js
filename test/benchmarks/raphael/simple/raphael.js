
function runRaphael(container, testContext) {

    testContext.start();
    var paper = Raphael(container, width, height);

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

    for (let i = numObjects, circle; i--;) {
        circle = paper.circle(getRandomNum(0, width), getRandomNum(0, height), radius);
        circle.attr('fill', 'red');
        circle.attr('stroke', 'blue');
        circle.drag(move, start, up);
    }

    testContext.end();

}