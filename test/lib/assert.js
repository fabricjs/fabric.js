const SVG_RE = /(SVGID|CLIPPATH|imageCrop)_[0-9]+/gm;
const SVG_XLINK_HREF_RE = /xlink:href="([^"]*)"/gm;

function basename(link) {
    return link.split(/\\|\//).pop().replaceAll('"', '');
}

function replaceLinks(value) {
    return (value.match(SVG_XLINK_HREF_RE) || []).reduce((final, curr) => {
        return final.replace(curr, `xlink:href="assets/${basename(curr)}"`);
    }, value)
}

function sanitizeSVG(value) {
    return replaceLinks(value).replace(SVG_RE, 'SVGID');
}

/**
 * 
 * @param {string} actual 
 * @param {string} expected 
 * @param {string} message 
 */
QUnit.assert.equalSVG = function (actual, expected, message) {
    QUnit.assert.equal(sanitizeSVG(actual), sanitizeSVG(expected), message);   
}

QUnit.assert.sameImageObject = function (actual, expected, message = 'image object should equal to ref') {
    var a = {}, b = {};
    Object.assign(a, actual, { src: basename(actual.src) });
    Object.assign(b, expected, { src: basename(expected.src) });
    this.pushResult({
        result: QUnit.equiv(a, b),
        actual,
        expected,
        message
    });
}
