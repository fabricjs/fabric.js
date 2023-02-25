module.exports = function(config) {
    return import('./karma.config.mjs').then(mod => mod.default(config));
}