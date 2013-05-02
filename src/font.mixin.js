fabric.util.object.extend(fabric.StaticCanvas.prototype, /** @lends fabric.StaticCanvas.prototype */ {
  
  /**
   * @private
   */
  _fonts: [],
  
  /**
   * Load a new font to be used on a text in the canvas.
   * @param {String} name
   * @param {Object} srcFormats format - src url map; like { truetype : 'file.ttf', ... }
   * @param {String} weight
   * @param {String} style
   * @todo weight and style are actualy not used
   */
  addFont: function (name, srcFormats, weight, style) {
    if (!name) {
      return;
    }
    
    var font = {
      name: name,
      srcFormats: srcFormats,
      weight: weight,
      style: style
    };
    
    this._registerFont(font);
    this._fonts.push(font);
  },
  
  /**
   * @private
   * @param {String} name
   * @returns {Object}
   */
  _getFontByName: function (name) {
    var fontFound = null;
    
    this._fonts.forEach(function(font) {
      if (font.name == name) {
        fontFound = font;
        return;
      }
    });
    
    return fontFound;
  },
  
  /**
   * @private
   * @param font
   * @returns {Boolean}
   */
  _registerFont: function (font) {
    var markup = '@font-face { font-family: "' + font.name + '"; ';
    
    for (var format in font.srcFormats) {
        markup += 'src: local("' + font.name + '"), url("' + font.srcFormats[format] + '");'; // @todo add support for IE and format
    }
    
    markup += ' }';
    
    var tag = document.createElement('style');
    tag.type = 'text/css';
    if (tag.styleSheet){
      tag.styleSheet.cssText = markup;
    } else {
      tag.appendChild(document.createTextNode(markup));
    }
    
    document.getElementsByTagName('head')[0].appendChild(tag);
    
    //var css = '<style type="text/css"><![CDATA[' + markup + ']]></style>';
    //document.getElementsByTagName('head')[0].innerHTML += css;
    
    return true;
  },
  
  /**
   * Return the font map loaded, like {name: 'Font Family', srcFormats: {truetype: 'http://example.com/fontfile.ttf', ...}, ...}
   * @return {object}
   * @todo return a clone ?
   */
  getFonts: function () {
      return this._fonts;
  },

  /**
   * Set the font map.
   * @see fabric.getFonts
   * @param {Object} fontMap 
   */
  addFonts: function (fontMap) {
    var that = this;
    fontMap.forEach(function (font) {
      that.addFont(font.name, font.srcFormats, font.weight, font.style);
    });
  }
  
});

if (fabric.isLikelyNode) {
  fabric.StaticCanvas.prototype._registerFont = function (font) {
    if (!font.srcFormats.truetype) {
      throw 'A truetype font is required for rendering on Node';
    }
    this.contextContainer.addFont(new this.Font(font.name, font.srcFormats.truetype));
  };
}