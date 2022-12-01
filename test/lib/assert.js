const SVG_RE = /(SVGID|CLIPPATH|imageCrop)_[0-9]+/gm;
const SVG_XLINK_HREF_RE = /xlink:href="([^"]*)"/gm;


function replaceLinks(value) {
    return (value.match(SVG_XLINK_HREF_RE) || []).reduce((final, curr) => {
        return final.replace(curr, `xlink:href="assets/${curr.split(/\\|\//).pop().replaceAll('"', '')}"`);
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

