/**
 * Monitors parent's resizing
 * @private
 */
fabric.ParentResizeObserver = fabric.util.createClass({
    initialize: function (object, callback) {
        this.object = object;
        this.callback = callback;
        this.__canvasMonitor = this.__canvasMonitor.bind(this);
        this.__groupMonitor = this.__groupMonitor.bind(this);
        this.__onAdded = this._watchParent.bind(this, true);
        this.__onRemoved = this._watchParent.bind(this, false);
        //  listen to parent add/remove
        object.on('added:initialized', this.__onAdded);
        object.on('added', this.__onAdded);
        object.on('removed', this.__onRemoved);
        //  trigger in case parent is passed in options
        var parent = object.group || object.canvas;
        parent && this.__onAdded({ target: parent });
    },

    invokeCallback: function (context) {
        this.callback && this.callback(context);
    },

    /**
     * @private
     * @param {boolean} watch
     * @param {{target:fabric.Group|fabric.Canvas}} [opt]
     */
    _watchParent: function (watch, opt) {
        var target = opt && opt.target;
        var object = this.object;
        //  make sure we listen only once
        object.canvas && object.canvas.off('resize', this.__canvasMonitor);
        object.group && object.group.off('layout', this.__groupMonitor);
        if (!watch) {
            return;
        }
        else if (target instanceof fabric.Group) {
            this.invokeCallback({ type: 'group' });
            object.group.on('layout', this.__groupMonitor);
        }
        else if (target instanceof fabric.StaticCanvas) {
            this.invokeCallback({ type: 'canvas' });
            object.canvas.on('resize', this.__canvasMonitor);
        }
    },

    /**
     * @private
     */
    __canvasMonitor: function (opt) {
        this.invokeCallback(Object.assign({}, opt, { type: 'canvas_resize' }));
    },

    /**
     * @private
     */
    __groupMonitor: function (context) {
        this.invokeCallback(Object.assign({}, context, { type: 'group_layout' }));
    },

    dispose: function () {
        var object = this.object;
        object.off('added:initialized', this.__onAdded);
        object.off('added', this.__onAdded);
        object.off('removed', this.__onRemoved);
        this._watchParent(false);
        delete this.object;
    }
});