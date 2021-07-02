const fs = require('fs');
const Axios = require('axios');
const chalk = require('chalk');
const path = require('path');
const cp = require('child_process');
const os = require('os');
const templateDir = path.resolve(__dirname, 'cra-template');
const APP_NAME = 'react-sandbox';
const appDir = path.resolve(__dirname, APP_NAME);
const main = path.resolve(__dirname, '..');

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
  if (!fs.existsSync(appDir)) {
    cp.execSync(`npx create-react-app test/${APP_NAME} --template file:${templateDir}`, { cwd: main, stdio: 'inherit' });
  }
  cp.execSync('node build.js modules=ALL requirejs fast', { cwd: main });
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
  cp.execSync(`${os.platform().startsWith('win') ? 'start' : 'open'} ${uri}`);
}

createCodeSandbox();