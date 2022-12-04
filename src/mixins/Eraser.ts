import { fabric } from '../../HEADER';

/**
 * An object's Eraser
 * @private
 * @class fabric.Eraser
 * @extends fabric.Group
 * @memberof fabric
 */
fabric.Eraser = fabric.util.createClass(fabric.Group, {
  /**
   * @readonly
   * @static
   */
  type: 'eraser',

  /**
   * @default
   */
  originX: 'center',

  /**
   * @default
   */
  originY: 'center',

  /**
   * eraser should retain size
   * dimensions should not change when paths are added or removed
   * handled by {@link FabricObject#_drawClipPath}
   * @override
   * @private
   */
  layout: 'fixed',

  drawObject: function (ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
    this.callSuper('drawObject', ctx);
  },

  /* _TO_SVG_START_ */
  /**
   * Returns svg representation of an instance
   * use <mask> to achieve erasing for svg, credit: https://travishorn.com/removing-parts-of-shapes-in-svg-b539a89e5649
   * for masking we need to add a white rect before all paths
   *
   * @param {Function} [reviver] Method for further parsing of svg representation.
   * @return {String} svg representation of an instance
   */
  _toSVG: function (reviver) {
    var svgString = ['<g ', 'COMMON_PARTS', ' >\n'];
    var x = -this.width / 2,
      y = -this.height / 2;
    var rectSvg = [
      '<rect ',
      'fill="white" ',
      'x="',
      x,
      '" y="',
      y,
      '" width="',
      this.width,
      '" height="',
      this.height,
      '" />\n',
    ].join('');
    svgString.push('\t\t', rectSvg);
    for (var i = 0, len = this._objects.length; i < len; i++) {
      svgString.push('\t\t', this._objects[i].toSVG(reviver));
    }
    svgString.push('</g>\n');
    return svgString;
  },
  /* _TO_SVG_END_ */
});

/**
 * Returns instance from an object representation
 * @static
 * @memberOf fabric.Eraser
 * @param {Object} object Object to create an Eraser from
 * @returns {Promise<fabric.Eraser>}
 */
fabric.Eraser.fromObject = function (object) {
  var objects = object.objects || [],
    options = fabric.util.object.clone(object, true);
  delete options.objects;
  return Promise.all([
    fabric.util.enlivenObjects(objects),
    fabric.util.enlivenObjectEnlivables(options),
  ]).then(function (enlivedProps) {
    return new fabric.Eraser(
      enlivedProps[0],
      Object.assign(options, enlivedProps[1]),
      true
    );
  });
};
