
const runner = visualTestLoop(QUnit);

QUnit.module('Pattern', hooks => {
    let patternSource;

    const patternMatrices = [
        [0, 0, 0, 0, 0, 0],
        [1, 0, 0, 1, -50, -50],
        [2, 0, 0, 2, -150, -50],
        [0.5, 0, 0, 0.25, -50, 0],
        [2, 0, 0, 0.5, -150, -50],
        [0.5, 0, 0, 2, -50, -100],
        [1, 0.25, 0, 1, 0, 0],
        [1, -0.25, 0, 1, 0, 0],
        [1, 0, 0.25, 1, 100, 0],
        [1, 0, -0.25, 1, 0, 0],
        [1, 0.25, 0.25, 1, 0, 0],
        [1, 0.25, -0.25, 1, 0, 0],
        [1, -0.25, -0.25, 1, 0, 0],
        [1, -0.25, 0.25, 2, -100, 0],
    ];
    
    hooks.before(() => {
        return new Promise(resolve => {
            getFixture('diet.jpeg', false, resolve);
        }).then(img => {
            patternSource = img;
        });
    });

    function createPattern([a, b, c, d, e, f], fakeOffset = new fabric.Point()) {
        return new fabric.Pattern({
            source: patternSource,
            repeat: 'repeat',
            offsetX: fakeOffset.x,
            offsetY: fakeOffset.y,
            patternTransform: [a, b * Math.PI, c * Math.PI, d, e - fakeOffset.x, f - fakeOffset.y]
        });
    }

    patternMatrices.forEach((m) => {
        [new fabric.Point(), new fabric.Point(-120, 50)]
            .forEach(offset => {
                runner({
                    test: `pattern transform matrix(${m}), fake offset(${offset})`,
                    code: (canvas, callback) => {
                        const rect = new fabric.Rect({
                            width: canvas.width,
                            height: canvas.height,
                            fill: createPattern(m, offset),
                            strokeWidth: 0
                        });
                        canvas.add(rect);
                        canvas.renderAll();
                        callback(canvas.lowerCanvasEl);
                    },
                    golden: `pattern/matrix(${m}).png`,
                    percentage: 0.09,
                    width: 200,
                    height: 200,
                });
                runner({
                    test: `canvas bg pattern transform matrix(${m}), fake offset(${offset})`,
                    code: (canvas, callback) => {
                        canvas.backgroundColor = createPattern(m, offset);
                        canvas.renderAll();
                        callback(canvas.lowerCanvasEl);
                    },
                    golden: `pattern/transform(${m}).png`,
                    percentage: 0.09,
                    width: 200,
                    height: 200,
                });
            });
    });

});

