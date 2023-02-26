// next major karma migrates to esm so this file will be redundant
module.exports = function (config) {
    return import('./karma.config.mjs').then(mod => mod.default(config));
}