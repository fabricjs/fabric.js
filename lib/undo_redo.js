(function (global) {
    'use strict';
    const fabric = global.fabric || (global.fabric = {});

    const _saveObjectTransform = fabric.util.saveObjectTransform;
    fabric.util.saveObjectTransform = function (target) {
        const v = _saveObjectTransform(target);
        v['width'] = target.width * target.scaleX;
        v['height'] = target.height * target.scaleY;
        ['rx', 'ry', 'radius', 'fill', 'stroke'].forEach(prop => prop in target && target[prop] != null && (v[prop] = target[prop]));
        return v;
    };

    const _initialize = fabric.Canvas.prototype.initialize;
    fabric.Canvas.prototype.initialize = function () {
        const inited = _initialize.call(this);
        this.clearUndoRedo();
        this.on('object:added', e => {
            if (this.undoredo.escape || !e.target || e.target.excludeFromExport) {
                return;
            }
            this.undoredo.stack[++this.undoredo.index] = { kind: 'added', target: e.target };
            this.undoredo.stack.length = this.undoredo.index + 1;
        });
        this.on('object:removed', e => {
            if (this.undoredo.escape || !e.target || e.target.excludeFromExport) {
                return;
            }
            this.undoredo.stack[++this.undoredo.index] = { kind: 'removed', target: e.target };
            this.undoredo.stack.length = this.undoredo.index + 1;
        });
        this.on('object:modified', e => {
            if (this.undoredo.escape || !e.target || e.target.excludeFromExport) {
                return;
            }
            const destination = Object.create(null);
            Object.keys(e.transform.original).forEach(k => destination[k] = e.target[k], this);
            this.undoredo.stack[++this.undoredo.index] = { kind: 'modified', action: e.action, target: e.target, original: e.transform.original, destination };
            this.undoredo.stack.length = this.undoredo.index + 1;
        });
        this.on('canvas:cleared', _ => this.clearUndoRedo());
        return inited;
    }

    const ___setupCanvas = fabric.Canvas.prototype.__setupCanvas;
    fabric.Canvas.prototype.__setupCanvas = function (serialized, enlivenedObjects, renderOnAddRemove, callback) {
        // after loadFromJson, clear undo-redo cache
        this.clearUndoRedo();
        return ___setupCanvas.call(this, serialized, enlivenedObjects, renderOnAddRemove, callback);
    }

    fabric.Canvas.prototype.undo = function () {
        if (this.undoredo.escape) {
            return;
        }

        this.undoredo.escape = true;
        const h = this.undoredo.stack[this.undoredo.index];
        switch (h?.kind) {
            case 'added':
                if (h.target.canvas) {
                    this.remove(h.target);
                }
                break;
            case 'removed':
                if (!h.target.canvas) {
                    this.add(h.target);
                }
                break;
            case 'modified':
                h.target.set(h.original);
                const options = { action: h.action, target: h.target, transform: { original: h.original } };
                this.fire('object:modified', options);
                h.target.fire('modified', options);
                this.requestRenderAll();
                break;
        }
        if (h) {
            this.undoredo.index = Math.max(-1, this.undoredo.index - 1);
        }
        this.undoredo.escape = false;
    }

    fabric.Canvas.prototype.redo = function () {
        if (this.undoredo.escape) {
            return;
        }

        this.undoredo.escape = true;
        const h = this.undoredo.stack[this.undoredo.index + 1];
        switch (h?.kind) {
            case 'added':
                if (!h.target.canvas) {
                    this.add(h.target);
                }
                break;
            case 'removed':
                if (h.target.canvas) {
                    this.remove(h.target);
                }
                break;
            case 'modified':
                h.target.set(h.destination);
                const options = { action: h.action, target: h.target, transform: { original: h.destination } };
                this.fire('object:modified', options);
                h.target.fire('modified', options);
                this.requestRenderAll();
                break;
        }
        if (h) {
            this.undoredo.index = Math.min(this.undoredo.stack.length - 1, this.undoredo.index + 1);
        }
        this.undoredo.escape = false;
    }

    fabric.Canvas.prototype.clearUndoRedo = function () {
        this.undoredo = { stack: [], index: -1, escape: false };
    }

})(typeof exports !== 'undefined' ? exports : this);