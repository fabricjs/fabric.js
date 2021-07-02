const fs = require('fs');
const chalk = require('chalk');
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
    execSync(`npx create-react-app test/test-fabric --template file:${templateDir}`, { cwd: main, stdio: 'inherit' });
  }
  copyBuildToApp();
  console.log(chalk.yellow.bold('\n> watching for changes in fabric'));
  fs.watch(src, { recursive: true }, copyBuildToApp);
  try {
    execSync('npm start', { cwd: appDir, detached: true });
  } catch (error) {
    console.log(chalk.yellow.bold('\n> stopped watching for changes in fabric'));
    process.exit(1);
  }
}

startDevEnv();