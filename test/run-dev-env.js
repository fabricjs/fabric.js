const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const templateDir = path.resolve(__dirname, 'cra-template');
const appDir = path.resolve(__dirname, 'test-fabric');
const main = path.resolve(__dirname, '..');
const src = path.resolve(main, 'src');
const fabricSource = path.resolve(main, 'dist', 'fabric.js');
const fabricDest = path.resolve(appDir, 'src', 'fabric.js');

function copyBuildToApp() {
  execSync('node build.js modules=ALL requirejs', { cwd: main });
  fs.copyFileSync(fabricSource, fabricDest);
  console.log(`built ${fabricDest}`);
}

function startDevEnv() {
  if (!fs.existsSync(appDir)) {
    console.log('dfgsdfgsdfg', templateDir)
    execSync(`npx create-react-app test/test-fabric --template file:${templateDir}`, { cwd: main, stdio: 'inherit' });
  }
  copyBuildToApp();
  fs.watch(src, { recursive: true }, copyBuildToApp);
  execSync('npm start', { cwd: appDir, detached: true });
}

startDevEnv();