const { startReactSandbox, createAndOpenCodeSandbox, createServer } = require('./react_sandbox');

const cmd = process.argv.slice(2)[0];

if (cmd === 'start') {
  startReactSandbox();
} else if (cmd === 'deploy') {
  createAndOpenCodeSandbox();
} else if (cmd === 'serve') {
  createServer();
}