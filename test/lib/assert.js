const SVG_RE = /(SVGID|CLIPPATH|imageCrop)_[0-9]+/gm;
const SVG_XLINK_HREF_RE = /xlink:href="([^"]*)"/gm;

function basename(link) {
    return link.split(/\\|\//).pop().replace(/"/gm, '');
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
    QUnit.assert.deepEqual(
        {
            ...actual,
            src: basename(actual.src)
        },
        {
            ...expected,
            src: basename(expected.src)
        },
        message
    );
}
