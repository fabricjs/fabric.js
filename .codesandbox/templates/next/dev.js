const { spawnSync } = require("child_process");

spawnSync('nodemon --config nodemon.config.json server.js 3000', { env: { ...process.env, NODE_ENV: 'development' }, stdio: 'inherit' });