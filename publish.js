var cp = require('child_process');
var path = require('path');
var fs = require('fs');

// eslint-disable-next-line no-undef
var pkgPath = path.resolve(__dirname, './package.json');
var pkgText = fs.readFileSync(pkgPath); // get original pkg text to restore it later
var pkgObject = JSON.parse(pkgText); // parsed pkg to override its fields
var args = process.argv.slice(2).join(' '); // args will be passed to npm publish (like --dry-run)

// override package.json with updated fields
fs.writeFileSync(
  pkgPath,
  JSON.stringify(Object.assign(pkgObject, {
    optionalDependencies: {},
    version: pkgObject.version + '-browser',
  }), null, '\t')
);

// publish -browser version
cp.execSync('npm publish ' + args);

console.log('Browser package is published');

// restore the original package.json contents
fs.writeFileSync(pkgPath, pkgText);

// publish the main version (the package is published "above" the -browser version)
cp.execSync('npm publish ' + args);

console.log('Main package is published');
