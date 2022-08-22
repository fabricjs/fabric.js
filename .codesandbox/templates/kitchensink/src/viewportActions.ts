

function renderVieportBorders(canvas) {
    var ctx = canvas.getContext();

    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,0.1)';

    ctx.fillRect(
        canvas.viewportTransform[4],
        canvas.viewportTransform[5],
        canvas.getWidth() * canvas.getZoom(),
        canvas.getHeight() * canvas.getZoom());

    ctx.setLineDash([5, 5]);

    ctx.strokeRect(
        canvas.viewportTransform[4],
        canvas.viewportTransform[5],
        canvas.getWidth() * canvas.getZoom(),
        canvas.getHeight() * canvas.getZoom());

    ctx.restore();
}

export function attach(canvas) {

    canvas.on('object:selected', function (opt) {
        var target = opt.target;
        if (target._cacheCanvas) {

        }
    })


    canvas.on('mouse:wheel', function (opt) {
        var e = opt.e;
        if (!e.ctrlKey) {
            return;
        }
        var newZoom = canvas.getZoom() + e.deltaY / 300;
        canvas.zoomToPoint({ x: e.offsetX, y: e.offsetY }, newZoom);

        renderVieportBorders();
        e.preventDefault();
        return false;
    });

    var viewportLeft = 0,
        viewportTop = 0,
        mouseLeft,
        mouseTop,
        _drawSelection = canvas._drawSelection,
        isDown = false;

    canvas.on('mouse:down', function (options) {
        if (options.e.altKey) {
            isDown = true;

            viewportLeft = canvas.viewportTransform[4];
            viewportTop = canvas.viewportTransform[5];

            mouseLeft = options.e.x;
            mouseTop = options.e.y;
            _drawSelection = canvas._drawSelection;
            canvas._drawSelection = function () { };
            renderVieportBorders();
        }
    });

    canvas.on('mouse:move', function (options) {
        if (options.e.altKey && isDown) {
            var currentMouseLeft = options.e.x;
            var currentMouseTop = options.e.y;

            var deltaLeft = currentMouseLeft - mouseLeft,
                deltaTop = currentMouseTop - mouseTop;

            canvas.viewportTransform[4] = viewportLeft + deltaLeft;
            canvas.viewportTransform[5] = viewportTop + deltaTop;

            canvas.renderAll();
            renderVieportBorders();
        }
    });

    canvas.on('mouse:up', function () {
        canvas._drawSelection = _drawSelection;
        isDown = false;
    });
}