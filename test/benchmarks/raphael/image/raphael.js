
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
