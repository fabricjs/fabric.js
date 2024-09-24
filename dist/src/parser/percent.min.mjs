import{ifNaN as t}from"../util/internals/ifNaN.min.mjs";import{capValue as n}from"../util/misc/capValue.min.mjs";const r=/^(\d+\.\d+)%|(\d+)%$/;function i(t){return t&&r.test(t)}function o(r,o){const e="number"==typeof r?r:"string"==typeof r?parseFloat(r)/(i(r)?100:1):NaN;return n(0,t(e,o),1)}export{i as isPercent,o as parsePercent};
//# sourceMappingURL=percent.min.mjs.map
