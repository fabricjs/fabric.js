/**
 * Created by Dmitri Russu <dmitri.russu@gmail.com> on 01.08.2014.
 */
(function(global) {
	'use strict';

	var fabric = global.fabric || (global.fabric = { }),
		extend = fabric.util.object.extend,
		invoke = fabric.util.array.invoke,
		parentToObject = fabric.Object.prototype.toObject;

	if (fabric.SvgAnimation) {
		fabric.warn('fabric.PathGroup is already defined');
		return;
	}

	/**
	 * Svg Animator Class
	 * @class fabric.SvgAnimation
	 * @extends fabric.Path
	 * @see {@link fabric.SvgAnimation#initialize} for constructor definition */
	fabric.SvgAnimation = fabric.util.createClass(fabric.Path, {

		/**
		 * Type of an object
		 * @type String
		 * @default
		 */
		type: 'svg-animation',

		/**
		 * Fill value
		 * @type String
		 * @default
		 */
		fill: '',

		/**
		 * Svg Animation XML Header
		 */
		header: '<?xml version="1.0" encoding="UTF-8" standalone="no"?>',

		/**
		 * Object Options
		 */
		options: {},

		/**
		 * Default Animation Path
		 */
		paths: [],

		/**
		 * All Svg Group paths
		 */
		groupPaths: [],

		/**
		 * current Animation Layer in zero
		 */
		idLayer: 0,

		/**
		 * Animation play on false by default
		 */
		playAnimation: false,

		/**
		 * Animation Frame delay
		 */
		delay: 1000,

		/**
		 * Do Animation in loop by default is on false
		 */
		loop: false,

		/**
		 * Canvas container
		 */
		ctx: null,

		/**
		 *
		 * @param url
		 * @param callBack
		 */
		initialize: function(url, callBack) {
			var _this = this;
				callBack = callBack !== "undefined" && callBack !== undefined ? callBack : function(){};
			this.groupPaths = [];
			this.paths = [];
			this.options = {};

			this.loadSvgFromUrl(url, function(){
				_this.options.sourcePath = url;

				if ( !_this.groupPaths.length ) {
					throw new Error('Missing SVG Animation group');
				}

				if ( !_this.paths.length ) {
					throw new Error('Missing group paths');
				}

				_this.setOptions(_this.options);

				if (_this.options.widthAttr) {
					_this.scaleX = _this.options.widthAttr / _this.options.width;
				}

				if (_this.options.heightAttr) {
					_this.scaleY = _this.options.heightAttr / _this.options.height;
				}

				if (_this.options.sourcePath) {
					_this.setSourcePath(_this.options.sourcePath);
				}

				_this.setCoords();

				callBack(_this);
			});
		},

		/**
		 *
		 * @param url
		 * @param callback
		 */
		loadSvgFromUrl: function(url, callback) {
			var _this = this;
			fabric.util.request(url, {
				method: 'get',
				onComplete: onComplete
			});

			function onComplete(r) {

				var xml = _this.loadXmlDomParser(r.responseText);

				if (!xml || !xml.documentElement) return;

				//create Header
				_this.getXmlHeader(xml);

				var svgGroups = xml.documentElement.children,
					svgGroupLength = svgGroups.length;

				for (var idLayer = svgGroupLength; idLayer--;) {
					// skeep none group element
					if ( svgGroups[idLayer].nodeName !== 'g' ) {
						continue;
					}

					fabric.parseSVGDocument(_this.loadXmlDomParser(_this.header + _this.xmlToString(svgGroups[idLayer]) + '</svg>').documentElement, function(groupPaths, options) {
						_this.groupPaths.push(groupPaths);

						if ( !_this.paths.length ) {
							_this.options = options;
							_this.paths = groupPaths;

							for (var s = _this.paths.length; s--; ) {
								_this.paths[s].group = _this;
							}

							callback();
						}
					});
				}
			}
		},

		/**
		 *
		 * @param xmlData
		 * @returns {*}
		 */
		xmlToString: function (xmlData) {
			var xmlString;
			//IE
			if (window.ActiveXObject){
				xmlString = xmlData.xml;
			}
			// code for Mozilla, Firefox, Opera, etc.
			else if ( xmlData ) {
				xmlString = (new XMLSerializer()).serializeToString(xmlData);
			}
			return xmlString;
		},

		/**
		 *
		 * @param xmlDomParser
		 * @returns {string}
		 */
		getXmlHeader: function(xmlDomParser) {
			var svgAttributes = xmlDomParser.documentElement.attributes,
				svgAttributesLength = svgAttributes.length;

			this.header = '<svg';
			for(var iAttribute = 0; iAttribute < svgAttributesLength; iAttribute++) {
				this.header += " " + svgAttributes[iAttribute].name +'="'+ svgAttributes[iAttribute].value +'"';
			}
			this.header += ">";

			return this.header;
		},

		/**
		 *
		 * @param xmlString
		 * @returns {String|*|string}
		 */
		loadXmlDomParser: function(xmlString){
			var xml = xmlString.toString();

			if (xml && !xml.documentElement && fabric.window.ActiveXObject && r.responseText) {
				xml = new ActiveXObject('Microsoft.XMLDOM');
				xml.async = 'false';
				//IE chokes on DOCTYPE
				xml.loadXML(xmlString.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,''));
			}
			else {
				xml = new DOMParser().parseFromString(xmlString.replace(/<!DOCTYPE[\s\S]*?(\[[\s\S]*\])*?>/i,''), "application/xml");
			}

			return xml;
		},

		/**
		 * Renders this group on a specified context
		 * @param {CanvasRenderingContext2D} ctx Context to render this instance on
		 */
		render: function(ctx) {
			this.ctx = ctx;
			// do not render if object is not visible
			if (!this.visible) return;

			//draw svg layer
			this.drawLayer(this.ctx, this.groupPaths[this.idLayer]);
		},

		/**
		 * Set Animation Delay
		 * @param delay
		 * @returns {fabric.SvgAnimation}
		 */
		setDelay: function(delay) {
			this.delay = delay;

			return this;
		},

		/**
		 * One play animation
		 *
		 * @returns {fabric.SvgAnimation}
		 */
		onePlay: function() {
			var _this = this;
			this.playAnimation = true;

			(function render() {
				if ( _this.playAnimation ) {

					setTimeout(function(){
						if ( _this.idLayer < _this.groupPaths.length - 1 ) {

							_this.drawLayer(_this.ctx, _this.groupPaths[_this.idLayer]);
							_this.idLayer += 1;

							_this.canvas.renderAll();
							fabric.util.requestAnimFrame(render);
						}
						else if ( _this.loop ) {
							_this.idLayer = 0;

							_this.canvas.renderAll();
							fabric.util.requestAnimFrame(render);
						}
					}, _this.delay);
				}
			})();

			// reset idLayer after one play execution
			_this.idLayer = 0;

			return this;
		},

		/**
		 * Play animation in Loop
		 * @returns {fabric.SvgAnimation}
		 */
		play : function() {
			this.playAnimation = true;
			this.loop = true;

			this.onePlay();

			return this;
		},

		/**
		 * Stop animation runing
		 * @returns {fabric.SvgAnimation}
		 */
		stop: function() {
			this.playAnimation = false;
			this.loop = false;

			return this;
		},

		/**
		 *
		 * @param ctx
		 * @param groupPaths
		 */
		drawLayer: function(ctx, groupPaths) {
			if ( groupPaths === undefined || groupPaths === "undefined" ){
				throw new Error('SvgAnimation.drawLayer is undefined param');
			}

			this.paths = groupPaths;

			for (var s = this.paths.length; s--; ) {
				this.paths[s].group = this;
			}

			ctx.save();

			var m = this.transformMatrix;

			if (m) {
				ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
			}
			this.transform(ctx);

			this._setShadow(ctx);
			this.clipTo && fabric.util.clipContext(this, ctx);
			for (var i = 0, l = this.paths.length; i < l; ++i) {
				this.paths[i].render(ctx, true);
			}
			this.clipTo && ctx.restore();
			this._removeShadow(ctx);

			ctx.restore();
		},

		/**
		 * Sets certain property to a certain value
		 * @param {String} prop
		 * @param {Any} value
		 * @return {fabric.PathGroup} thisArg
		 */
		_set: function(prop, value) {

			if (prop === 'fill' && value && this.isSameColor()) {
				var i = this.paths.length;
				while (i--) {
					this.paths[i]._set(prop, value);
				}
			}

			return this.callSuper('_set', prop, value);
		},

		/**
		 * Returns object representation of this path group
		 * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
		 * @return {Object} object representation of an instance
		 */
		toObject: function(propertiesToInclude) {
			var o = extend(parentToObject.call(this, propertiesToInclude), {
				paths: invoke(this.getObjects(), 'toObject', propertiesToInclude)
			});
			if (this.sourcePath) {
				o.sourcePath = this.sourcePath;
			}
			return o;
		},

		/**
		 * Returns dataless object representation of this path group
		 * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
		 * @return {Object} dataless object representation of an instance
		 */
		toDatalessObject: function(propertiesToInclude) {
			var o = this.toObject(propertiesToInclude);
			if (this.sourcePath) {
				o.paths = this.sourcePath;
			}
			return o;
		},

		/* _TO_SVG_START_ */
		/**
		 * Returns svg representation of an instance
		 * @param {Function} [reviver] Method for further parsing of svg representation.
		 * @return {String} svg representation of an instance
		 */
		toSVG: function(reviver) {
			var objects = this.getObjects(),
				markup = [
					'<g ',
					'style="', this.getSvgStyles(), '" ',
					'transform="', this.getSvgTransform(), '" ',
					'>'
				];

			for (var i = 0, len = objects.length; i < len; i++) {
				markup.push(objects[i].toSVG(reviver));
			}
			markup.push('</g>');

			return reviver ? reviver(markup.join('')) : markup.join('');
		},
		/* _TO_SVG_END_ */

		/**
		 * Returns a string representation of this path group
		 * @return {String} string representation of an object
		 */
		toString: function() {
			return '#<fabric.PathGroup (' + this.complexity() +
				'): { top: ' + this.top + ', left: ' + this.left + ' }>';
		},

		/**
		 * Returns true if all paths in this group are of same color
		 * @return {Boolean} true if all paths are of the same color (`fill`)
		 */
		isSameColor: function() {
			var firstPathFill = (this.getObjects()[0].get('fill') || '').toLowerCase();
			return this.getObjects().every(function(path) {
				return (path.get('fill') || '').toLowerCase() === firstPathFill;
			});
		},

		/**
		 * Returns number representation of object's complexity
		 * @return {Number} complexity
		 */
		complexity: function() {
			return this.paths.reduce(function(total, path) {
				return total + ((path && path.complexity) ? path.complexity() : 0);
			}, 0);
		},

		/**
		 * Returns all paths in this path group
		 * @return {Array} array of path objects included in this path group
		 */
		getObjects: function() {
			return this.paths;
		}
	});

	/**
	 * Indicates that instances of this type are async
	 * @static
	 * @memberOf fabric.SvgAnimation
	 * @type Boolean
	 * @default
	 */
	fabric.SvgAnimation.async = true;

})(typeof exports !== 'undefined' ? exports : this);
