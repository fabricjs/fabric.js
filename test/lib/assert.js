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

/**
   * Checks that the first two arguments are equal, or are numbers close enough to be considered equal
   * based on a specified maximum allowable difference.
   * Credits: https://github.com/JamesMGreene/qunit-assert-close/blob/master/qunit-assert-close.js
   *
   * @example assert.close(3.141, Math.PI, 0.001);
   *
   * @param Number actual
   * @param Number expected
   * @param Number maxDifference (the maximum inclusive difference allowed between the actual and expected numbers)
   * @param String message (optional)
   */
QUnit.assert.close = function(actual, expected, maxDifference, message) {
  const actualDiff = (actual === expected) ? 0 : Math.abs(actual - expected),
      result = actualDiff <= maxDifference;

  message = message || (actual + " should be within " + maxDifference + " (inclusive) of " + expected + (result ? "" : ". Actual: " + actualDiff));

  this.pushResult({
    result,
    actual: actualDiff,
    expected: maxDifference,
    message
  })
};
