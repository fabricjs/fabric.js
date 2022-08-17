function runFabric(canvasEl, testContext) {

    var objectStackingCheckbox = document.getElementById('object_stacking');

    const OptimizedCircle = fabric.util.createClass(fabric.Circle, {
        sharedCacheData: {},
        shouldCache: function () {
            return true;
        },
        isCacheDirty: function () {
            return this.dirty;
        },
        _createCacheCanvas: function () {
            this._cacheProperties = {};
            if ('_cacheCanvas' in this.sharedCacheData) {
                Object.assign(this, this.sharedCacheData, { dirty: false });
            }
            else {
                this._cacheCanvas = fabric.util.createCanvasElement();
                this._cacheContext = this._cacheCanvas.getContext('2d');
                this._updateCacheCanvas();
                Object.assign(this.sharedCacheData, {
                    _cacheCanvas: this._cacheCanvas,
                    _cacheContext: this._cacheContext,
                    cacheHeight: this.cacheHeight,
                    cacheTranslationX: this.cacheTranslationX,
                    cacheTranslationY: this.cacheTranslationY,
                    cacheWidth: this.cacheWidth,
                    zoomX: this.zoomX,
                    zoomY: this.zoomY,
                });
                this.dirty = true;
            }
        },
    });

    testContext.start();

    const canvas = new fabric.Canvas(canvasEl, {
        renderOnAddRemove: false,
        stateful: false,
        HOVER_CURSOR: 'default'
    });

    canvas.on('mouse:down', function (e) {
        e.target && e.target.set('opacity', 0.5);
    });
    canvas.on('mouse:up', function (e) {
        if (e.target) {
            e.target.set('opacity', 1);
            canvas.requestRenderAll();
        }
    });

    const klass = optimizeCaching ? OptimizedCircle : fabric.Circle;

    for (var i = numObjects; i--;) {
        var c = new klass({
            radius: radius,
            left: getRandomNum(0, width),
            top: getRandomNum(0, height),
            originX: 'center',
            originY: 'center',
            fill: 'red',
            stroke: 'blue',
            objectCaching: false,
        });
        c.hasControls = c.hasBorders = false;
        canvas.add(c);
    }
    canvas.renderAll();
    canvas.calcOffset();

    testContext.end();

    canvas.preserveObjectStacking = objectStackingCheckbox.checked;
    objectStackingCheckbox.onchange = function () {
        canvas.preserveObjectStacking = objectStackingCheckbox.checked;
    };

}
