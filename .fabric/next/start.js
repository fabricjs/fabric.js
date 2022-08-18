const { execSync } = require("child_process");

execSync('next', { env: { ...process.env, NODE_ENV: 'development' }, stdio: 'inherit' });