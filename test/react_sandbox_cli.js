const { startReactSandbox, createAndOpenCodeSandbox } = require('./react_sandbox');

const cmd = process.argv.slice(2)[0];

if (cmd === 'start') {
  startReactSandbox();
} else if (cmd === 'deploy') {
  createAndOpenCodeSandbox();
}