import { Object } from './object.class';

export class Rect extends Object {
    static type = 'rect';
    rx: number = 0;
    ry: number = 0;


    /**
     * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
     * as well as for history (undo/redo) purposes
     * @type Array
     */
    stateProperties = Object.stateProperties.concat('rx', 'ry');

    cacheProperties = Object.cacheProperties.concat('rx', 'ry');

    constructor(options) {
        super(options);
        this._initRxRy();
    }

    /**
     * Initializes rx/ry attributes
     * @private
     */
    private _initRxRy() {
        if (this.rx && !this.ry) {
            this.ry = this.rx;
        }
        else if (this.ry && !this.rx) {
            this.rx = this.ry;
        }
    }

    /**
     * @private
     * @param {CanvasRenderingContext2D} ctx Context to render on
     */
    protected _render(ctx: CanvasRenderingContext2D) {

        // 1x1 case (used in spray brush) optimization was removed because
        // with caching and higher zoom level this makes more damage than help

        var rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
            ry = this.ry ? Math.min(this.ry, this.height / 2) : 0,
            w = this.width,
            h = this.height,
            x = -this.width / 2,
            y = -this.height / 2,
            isRounded = rx !== 0 || ry !== 0,
            /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
            k = 1 - 0.5522847498;
        ctx.beginPath();

        ctx.moveTo(x + rx, y);

        ctx.lineTo(x + w - rx, y);
        isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry);

        ctx.lineTo(x + w, y + h - ry);
        isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h);

        ctx.lineTo(x + rx, y + h);
        isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry);

        ctx.lineTo(x, y + ry);
        isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y);

        ctx.closePath();

        this._renderPaintInOrder(ctx);
    }

    /**
     * Returns object representation of an instance
     * @param {Array} [propertiesToInclude] Any properties that you might want to additionally include in the output
     * @return {Object} object representation of an instance
     */
    toObject(propertiesToInclude: (keyof Rect)[]) {
        return super.toObject(['rx', 'ry'].concat(propertiesToInclude));
    }

    /* _TO_SVG_START_ */
    /**
     * Returns svg representation of an instance
     * @return {Array} an array of strings with the specific svg representation
     * of the instance
     */
    protected _toSVG() {
        var x = -this.width / 2, y = -this.height / 2;
        return [
            '<rect ', 'COMMON_PARTS',
            'x="', x, '" y="', y,
            '" rx="', this.rx, '" ry="', this.ry,
            '" width="', this.width, '" height="', this.height,
            '" />\n'
        ];
    }
    /* _TO_SVG_END_ */

    static ATTRIBUTE_NAMES = fabric.SHARED_ATTRIBUTES.concat('x y rx ry width height'.split(' '));

    /**
     * Returns {@link fabric.Rect} instance from an SVG element
     * @static
     * @memberOf fabric.Rect
     * @param {SVGElement} element Element to parse
     * @param {Function} callback callback function invoked after parsing
     * @param {Object} [options] Options object
     */
    static fromElement<CB extends (instance: Rect) => void, T extends unknown | CB>(element: SVGElement, callback: T, options?) {
        if (!element) {
            return callback(null);
        }
        options = options || {};

        var parsedAttributes = fabric.parseAttributes(element, fabric.Rect.ATTRIBUTE_NAMES);
        parsedAttributes.left = parsedAttributes.left || 0;
        parsedAttributes.top = parsedAttributes.top || 0;
        parsedAttributes.height = parsedAttributes.height || 0;
        parsedAttributes.width = parsedAttributes.width || 0;
        var rect = new fabric.Rect(fabric.util.object.extend((options ? fabric.util.object.clone(options) : {}), parsedAttributes));
        rect.visible = rect.visible && rect.width > 0 && rect.height > 0;
        callback(rect);
    }

    /**
     * Returns {@link fabric.Rect} instance from an object representation
     * @static
     * @memberOf fabric.Rect
     * @param {Object} object Object to create an instance from
     * @param {Function} [callback] Callback to invoke when an fabric.Rect instance is created
     */
    static fromObject<CB extends (instance: Rect) => void, T extends unknown | CB>(object, callback?: T):
        T extends (instance: Rect) => void ? void : Promise<Rect> {
        if (!callback) {
            //@ts-ignore
            return new Promise<Rect>((resolve, reject) => {
                try {
                    return Object._fromObject('Rect', object, resolve);
                } catch (error) {
                    reject(error);
                }
            });
        }
        return Object._fromObject('Rect', object, callback);
    }
}