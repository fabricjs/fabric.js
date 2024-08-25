const { cwd } = require('process');

module.exports = (path, options) => {
  if (path === 'fabric') {
    return `${cwd()}/fabric.ts`;
  }
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, options);
};
