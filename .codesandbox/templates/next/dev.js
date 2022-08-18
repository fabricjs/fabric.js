const { execSync } = require("child_process");

execSync('npx nodemon --config nodemon.config.json server.js 3000', {
    env: { ...process.env, NODE_ENV: 'development' },
    stdio: 'inherit',
});