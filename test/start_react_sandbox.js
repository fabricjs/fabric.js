const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const cp = require('child_process');
const templateDir = path.resolve(__dirname, 'cra-template');
const APP_NAME = 'react-sandbox';
const appDir = path.resolve(__dirname, APP_NAME);
const main = path.resolve(__dirname, '..');
const src = path.resolve(main, 'src');
const fabricSource = path.resolve(main, 'dist', 'fabric.js');
const fabricDest = path.resolve(appDir, 'src', 'fabric.js');

function copyBuildToApp() {
  console.log(`> building dist`);
  cp.execSync('node build.js modules=ALL requirejs fast', { cwd: main });
  fs.copyFileSync(fabricSource, fabricDest);
  console.log(`> generated ${fabricDest}`);
}

function startDevEnv() {
  if (!fs.existsSync(appDir)) {
    cp.execSync(`npx create-react-app test/${APP_NAME} --template file:${templateDir}`, { cwd: main, stdio: 'inherit' });
  }
  copyBuildToApp();
  console.log(chalk.yellow.bold('\n> watching for changes in fabric'));
  fs.watch(src, { recursive: true }, () => {
    try {
      copyBuildToApp();
    } catch (error) {
      console.log(chalk.blue.bold('> error listening to/building fabric'));
    }
  });
  try {
    cp.spawn('npm', ['start'], { shell: true, cwd: appDir, stdio: 'inherit' });
  } catch (error) {
    console.log(chalk.yellow.bold('\n> stopped watching for changes in fabric'));
    process.exit(1);
  }
}

startDevEnv();