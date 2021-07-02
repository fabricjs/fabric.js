const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const appDir = path.resolve(__dirname, 'test-fabric');

function startDevEnv() {
  if (!fs.existsSync(appDir)) {
    execSync(`npx create-react-app test/test-fabric --template file:${appDir}`, { stdio: 'inherit' });
  }
  execSync('npm start', { cwd: appDir, stdio: 'inherit' });
}

startDevEnv();