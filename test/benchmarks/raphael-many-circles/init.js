
var search = new URLSearchParams(document.location.search);
var numObjects = parseInt(search.get('n'), 10) || 200,
    radius = 20,
    width = 500,
    height = 500,
    optimizeCaching = parseInt(search.get('optimize_caching'));

(function () {
    function getRandomNum(min, max) {
        return Math.random() * (max - min) + min;
    }

    window.onload = function () {

        var logEl = document.getElementById('log');

        document.getElementById('numshapes').innerHTML = numObjects;
        var objectStackingCheckbox = document.getElementById('object_stacking');
        var optimizeCachingCheckbox = document.getElementById('optimize_caching');
        optimizeCachingCheckbox.onchange = function () {
            if (optimizeCaching !== optimizeCachingCheckbox.checked) {
                document.location.search = createSearchQuery(numObjects, optimizeCachingCheckbox.checked);
            }
        }
        optimizeCachingCheckbox.checked = optimizeCaching;

        (function testRaphael() {

            var paper = Raphael("raphael", width, height),
                startTime = new Date(),
                circle;

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

            for (var i = numObjects; i--;) {
                circle = paper.circle(getRandomNum(0, width), getRandomNum(0, height), radius);
                circle.attr('fill', 'red');
                circle.attr('stroke', 'blue');
                circle.drag(move, start, up);
            }

            logEl.innerHTML = 'Raphael: <b class="bench">' + (new Date() - startTime) + '</b> ms<br>';

        })();

        (function testFabric() {

            var canvas = this.__canvas = new fabric.Canvas('canvas', {
                renderOnAddRemove: false,
                stateful: false,
                HOVER_CURSOR: 'default'
            }), startTime = new Date(), klass;

            canvas.on('mouse:down', function (e) {
                e.target && e.target.set('opacity', 0.5);
            });
            canvas.on('mouse:up', function (e) {
                if (e.target) {
                    e.target.set('opacity', 1);
                    canvas.requestRenderAll();
                }
            });

            if (optimizeCaching) {
                klass = fabric.util.createClass(fabric.Circle, {
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
                })
            }
            else {
                klass = fabric.Circle;
            }

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

            logEl.innerHTML += 'fabric: <b class="bench">' + (new Date() - startTime) + '</b> ms';

            canvas.preserveObjectStacking = objectStackingCheckbox.checked;
            objectStackingCheckbox.onchange = function () {
                canvas.preserveObjectStacking = objectStackingCheckbox.checked;
            }

        })();
    };
})();

function createSearchQuery(num, optimize) {
    var params = new URLSearchParams();
    params.set('n', num);
    params.set('optimize_caching', typeof optimize !== 'undefined' ? optimize ? 1 : 0 : (optimizeCaching || 0));
    return params.toString();
}

function reload(num) {
    document.location.search = createSearchQuery(num);
    return false;
}
