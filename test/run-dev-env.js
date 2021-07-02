const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const appDir = path.resolve(__dirname, 'test-fabric');
const main = path.resolve(__dirname, '..');
const src = path.resolve(main, 'src');
const fabricSource = path.resolve(main, 'dist', 'fabric.js');
const fabricDest = path.resolve(appDir, 'src', 'fabric.js');

function startDevEnv() {
  if (!fs.existsSync(appDir)) {
    execSync(`npx create-react-app test/test-fabric --template file:${appDir}`, { stdio: 'inherit' });
  }
  fs.watch(src, { recursive: true }, () => {
    execSync('node build.js modules=ALL requirejs fast', { cwd: main });
    fs.copyFileSync(fabricSource, fabricDest);
    console.log(`built ${fabricDest}`);
  });
  execSync('npm start', { cwd: appDir, detached: true });
}

startDevEnv();