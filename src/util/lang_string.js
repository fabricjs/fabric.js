if (!String.prototype.trim) {
  String.prototype.trim = function () {
    // this trim is not fully ES3 or ES5 compliant, but it should cover most cases for now
    return this.replace(/^[\s\xA0]+/, '').replace(/[\s\xA0]+$/, '');
  };
}

function camelize(string) {
  return string.replace(/-+(.)?/g, function(match, character) {
    return character ? character.toUpperCase() : '';
  });
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

fabric.util.string = {
  camelize: camelize,
  capitalize: capitalize
};