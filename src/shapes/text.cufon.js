/**
 * @private
 * @param {CanvasRenderingContext2D} ctx Context to render on
 */
fabric.util.object.extend(fabric.Text.prototype, {
  _renderViaCufon: function(ctx) {

    var o = Cufon.textOptions || (Cufon.textOptions = { });

    // export options to be used by cufon.js
    o.left = this.left;
    o.top = this.top;
    o.context = ctx;
    o.color = this.fill;

    var el = this._initDummyElementForCufon();

    // set "cursor" to top/left corner
    this.transform(ctx);

    // draw text
    Cufon.replaceElement(el, {
      engine: 'canvas',
      separate: 'none',
      fontFamily: this.fontFamily,
      fontWeight: this.fontWeight,
      textDecoration: this.textDecoration,
      textShadow: this.shadow && this.shadow.toString(),
      textAlign: this.textAlign,
      fontStyle: this.fontStyle,
      lineHeight: this.lineHeight,
      stroke: this.stroke,
      strokeWidth: this.strokeWidth,
      backgroundColor: this.backgroundColor,
      textBackgroundColor: this.textBackgroundColor
    });

    // update width, height
    this.width = o.width;
    this.height = o.height;

    this._totalLineHeight = o.totalLineHeight;
    this._fontAscent = o.fontAscent;
    this._boundaries = o.boundaries;

    el = null;

    // need to set coords _after_ the width/height was retreived from Cufon
    this.setCoords();
  },

  /**
   * @private
   */
  _initDummyElementForCufon: function() {
    var el = fabric.document.createElement('pre'),
        container = fabric.document.createElement('div');

    // Cufon doesn't play nice with textDecoration=underline if element doesn't have a parent
    container.appendChild(el);

    if (typeof G_vmlCanvasManager === 'undefined') {
      el.innerHTML = this.text;
    }
    else {
      // IE 7 & 8 drop newlines and white space on text nodes
      // see: http://web.student.tuwien.ac.at/~e0226430/innerHtmlQuirk.html
      // see: http://www.w3schools.com/dom/dom_mozilla_vs_ie.asp
      el.innerText =  this.text.replace(/\r?\n/gi, '\r');
    }

    el.style.fontSize = this.fontSize + 'px';
    el.style.letterSpacing = 'normal';

    return el;
  }
});
