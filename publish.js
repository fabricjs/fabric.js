var cp = require('child_process');

var args = process.argv.slice(2).join(' '); // args will be passed to npm publish (like --dry-run)
var preRelease = process.env.PRE_RELEASE;

// allow publishing of pre-releases with beta tag
if (preRelease === 'true') {
  console.log('Adding beta tag to NPM publish');
  args = '--tag beta ' + args;
}

console.log('npm publish ' + args);

// publish the main version (the package is published "above" the -browser version)
cp.execSync('npm publish ' + args);

console.log('Main package is published');
