const util = {};

function resolveUtil() {
    return fabric.isLikelyNode ? import('./util.node.mjs') : import('./util.browser.mjs');
}

QUnit.begin(async () => {
    Object.assign(util, await resolveUtil());
});

export default util;