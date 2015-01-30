function accentedTextCreator() {
    return fabric.util.createClass(fabric.IText, {
        initHiddenTextarea: function() {
            this.hiddenTextarea = fabric.document.createElement('textarea');

            this.hiddenTextarea.setAttribute('autocapitalize', 'off');
            this.hiddenTextarea.setAttribute('wrap', 'off');
            this.hiddenTextarea.setAttribute('rows', '6');
            this.hiddenTextarea.style.cssText = 'position: absolute; top: 0; left: -9999px';

            fabric.document.body.appendChild(this.hiddenTextarea);

            fabric.util.addListener(this.hiddenTextarea, 'keydown', this.onKeyDown.bind(this));
            fabric.util.addListener(this.hiddenTextarea, 'input', this.onInput.bind(this));

            if (!this._clickHandlerInitialized && this.canvas) {
                fabric.util.addListener(this.canvas.upperCanvasEl, 'click', this.onClick.bind(
                    this));
                this._clickHandlerInitialized = true;
            }
        },

        onInput: function(e) {
            var cp = this.hiddenTextarea.selectionStart || 0;
            this.text = '';
            this.insertChars(e.srcElement.value);
            this.selectionStart = this.selectionEnd = cp;
        },

        onKeyDown: function(e) {
            if (!this.isEditing) return;

            var me = this;
            setTimeout(function() {
                me.selectionStart = me.hiddenTextarea.selectionStart;
                me.selectionEnd = me.hiddenTextarea.selectionEnd;
            }, 0);

            //Ctrl + a
            if ((e.keyCode == 65) && (e.ctrlKey || e.metaKey)) {
                this.hiddenTextarea.selectionStart = 0;
                this.hiddenTextarea.selectionEnd = this.text.length;
            }

            e.stopPropagation();

            this.canvas && this.canvas.renderAll();
        },
    });
}
