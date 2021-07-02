const fs = require('fs');
const Axios = require('axios');
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

function buildDist() {
  cp.execSync('node build.js modules=ALL requirejs fast', { cwd: main });
}

function copyBuildToApp() {
  console.log(`> building dist`);
  buildDist();
  fs.copyFileSync(fabricSource, fabricDest);
  console.log(`> generated ${fabricDest}`);
}

function createReactAppIfNeeded() {
  if (!fs.existsSync(appDir)) {
    cp.execSync(`npx create-react-app test/${APP_NAME} --template file:${templateDir}`, { cwd: main, stdio: 'inherit' });
  }
}

function startReactSandbox() {
  createReactAppIfNeeded();
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

const FILES = [
  'package.json',
  '.env',
  '.eslintignore',
  'src/App.tsx',
  'src/index.tsx',
  'src/App.css',
  'src/index.css',
  'src/fabric.d.ts',
  'src/fabric.js',
  'public/index.html',
  'src/reportWebVitals.ts',
]

async function createCodeSandbox() {
  createReactAppIfNeeded();
  buildDist();
  const files = FILES.reduce((files, fileName) => {
    const filePath = path.resolve(appDir, fileName)
    files[fileName] = { content: fs.readFileSync(filePath).toString() };
    return files;
  }, {});
  const { data: { sandbox_id } } = await Axios.post("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
    template: 'create-react-app-typescript',
    files
  });
  const uri = `https://codesandbox.io/s/${sandbox_id}`;
  console.log(chalk.yellow(`Created code sandbox ${uri}`));
  return uri;
}

async function createAndOpenCodeSandbox() {
  const uri = await createCodeSandbox();
  cp.execSync(`${os.platform().startsWith('win') ? 'start' : 'open'} ${uri}`);
}


module.exports = {
  startReactSandbox,
  createCodeSandbox,
  createAndOpenCodeSandbox
}