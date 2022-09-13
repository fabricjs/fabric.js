const runner = visualTestLoop(QUnit);

QUnit.module('Gradient', hooks => {
    const options = [
        {
            transform: [0, 0, 0, 0, 0, 0],
            coords: { x1: 0, y1: 0, x2: 1, y2: 1 },
        },
        {
            transform: [1, 0, 0, 1, 0, 0],
            coords: { x1: 0.5, y1: 1, x2: 0.5, y2: 1 },
        }
    ];
    const gradientMatrices = [
        // [1, 0, 0, 1, 0, 0],
        // [2, 0, 0, 2, 0, 0],
        // [1, 0, 0, 2, 0, 0],
        // [2, 0, 0, 1, 0, 0],
        // [0.5, 0, 0, 0.5, 0, 0],
        // [2, 0, 0, 0.5, 0, 0],
        // [0.5, 0, 0, 2, 0, 0],
        // [1, 0.25, 0, 1, 0, 0],
        // [1, -0.25, 0, 1, 0, 0],
        // [1, 0, 0.25, 1, 0, 0],
        // // [1, 0, -0.25, 1, 0, 0],
        // [1, 0.25, 0.25, 1, 0, 0],
        // [1, 0.25, -0.25, 1, 0, 0],
        // [1, -0.25, -0.25, 1, 0, 0],
        [1, -0.25, 0.25,1, 0, 0],
    ];
    const start = 0;
    const end = 0.75;
    [start, end].forEach(x1 => {
        [start, end].forEach(y1 => {
            [start, end].forEach(x2 => {
                [start, end].forEach(y2 => {
                    gradientMatrices.forEach(transform => {
                        if (x1 === x2 && y1 === y2) return;
                        options.push({
                            coords: { x1, y1, x2, y2 },
                             percentage:true,
                            // fakeOffset,
                            transform
                        });
                    });

                    // [true, false].forEach(percentage => {
                    //     [new fabric.Point(), new fabric.Point(-120, 50)].forEach(fakeOffset => {
                    //        
                    //     });
                    // });
                });
            });
        });
    });

    function buildMatrix([a, b, c, d, e, f], additionalOffset = new fabric.Point()) {
        return [a, b * Math.PI, c * Math.PI, d, e + additionalOffset.x, f + additionalOffset.y];
    }

    function createGradient({
        transform = fabric.iMatrix,
        offsetX = 0,
        offsetY = 0,
        fakeOffset = new fabric.Point(),
        ...options
    }) {
        return new fabric.Gradient({
            colorStops: [{
                offset: 0,
                color: 'green'
            },
            {
                offset: 0.5,
                color: 'white'
            },
            {
                offset: 1,
                color: 'blue'
            }],
            ...options,
            type: 'linear',
            offsetX: offsetX + fakeOffset.x,
            offsetY: offsetY + fakeOffset.y,
            gradientTransform: buildMatrix(transform, fakeOffset.scalarMultiply(-1)),
        });
    }

    options.forEach(({
        coords: { x1, y1, x2, y2 }, percentage, fakeOffset, transform
    }) => {
        const size = {
            width: 200,
            height: 200
        };
        const coords = {
            x1: x1 * size.width,
            y1: y1 * size.height,
            x2: x2 * size.width,
            y2: y2 * size.height
        };
        const units = percentage ? 'percentage' : 'pixels';
        const makeGradient = () => createGradient({
            coords: percentage ?
                { x1, y1, x2, y2 } :
                coords,
            transform,
            fakeOffset,
            gradientUnits: units
        });
        const goldenName = `gradient/coords(${Object.values(coords)})-(${transform}).png`;
        const iGoldenName = `gradient/coords(${Object.values(coords)})-(${fabric.iMatrix}).png`;
        const testName = `gradient coords(${Object.values(coords)}), transform(${transform}), units(${units}), fake offset(${fakeOffset})`;
        runner({
            test: testName,
            code: (canvas, callback) => {
                const rect = new fabric.Rect({
                    width: canvas.width,
                    height: canvas.height,
                    fill: makeGradient(),
                    strokeWidth: 0
                });
                canvas.add(rect);
                canvas.renderAll();
                callback(canvas.lowerCanvasEl);
            },
            golden: goldenName,
            percentage: 0.09,
            ...size
        });

        // runner({
        //     test: `canvas bg: ${testName}`,
        //     code: (canvas, callback) => {
        //         canvas.backgroundColor = makeGradient();
        //         canvas.renderAll();
        //         callback(canvas.lowerCanvasEl);
        //     },
        //     golden: goldenName,
        //     percentage: 0.09,
        //     ...size
        // });

        runner({
            test: `transform check: ${testName}`,
            code: (canvas, callback) => {
                const gradient = makeGradient();
                gradient.gradientTransform = null;
                canvas.backgroundColor = gradient;
                canvas.setViewportTransform(buildMatrix(transform));
                canvas.renderAll();
                callback(canvas.lowerCanvasEl);
            },
            golden: goldenName,
            percentage: 0.09,
            ...size,
            testOnly: true
        });

        // transform[0] && transform[3] && runner({
        //     test: `inverted transform check: ${testName}`,
        //     code: (canvas, callback) => {
        //         canvas.backgroundColor = makeGradient();
        //         canvas.setViewportTransform(fabric.util.invertTransform(buildMatrix(transform)));
        //         canvas.renderAll();
        //         callback(canvas.lowerCanvasEl);
        //     },
        //     golden: iGoldenName,
        //     percentage: 0.09,
        //     ...size,
        // });
    });
});
