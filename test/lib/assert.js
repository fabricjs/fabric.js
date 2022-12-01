const SVG_RE = /#SVGID_[0-9]+/gm;

QUnit.assert.equalSVG = function (actual, expected, message) {
    console.log(actual.match(SVG_RE))
    require('child_process').execSync(`"${actual}" > out.html && git add out.html && git commit && "${expected}" > out.html`)
    QUnit.assert.equal(actual.replace(SVG_RE, '#SVGID'), expected.replace(SVG_RE, '#SVGID'), message);   
}