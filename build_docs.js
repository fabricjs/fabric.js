var exec = require('child_process').exec;

var command = 'java -jar lib/jsdoc-toolkit/jsrun.jar \
                         lib/jsdoc-toolkit/app/run.js -a \
                         -t=lib/jsdoc-toolkit/templates/jsdoc \
                         -d=site/docs HEADER.js src/ src/util/';

exec(command, function (error, output) {
  console.log(output);
});