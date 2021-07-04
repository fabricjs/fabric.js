const fs = require('fs');
const Axios = require('axios');
const chalk = require('chalk');
const path = require('path');
const http = require('http');
const os = require('os');
const cp = require('child_process');

const templateDir = path.resolve(__dirname, 'cra-template');
const APP_NAME = 'react-sandbox';
const appDir = path.resolve(__dirname, APP_NAME);
const main = path.resolve(__dirname, '..');
const src = path.resolve(main, 'src');
const fabricSource = path.resolve(main, 'dist', 'fabric.js');
const fabricDest = path.resolve(appDir, 'src', 'fabric', 'build.js');
const diffFolder = path.resolve(appDir, 'src', 'diff');
const diffPath = path.resolve(diffFolder, 'upstream.diff');
const stagingDiffPath = path.resolve(diffFolder, 'staging.diff');

const FILES = [
  'package.json',
  '.eslintignore',
  'public/index.html',
  'src',
];

const BINARY_EXT = [
  'png',
  'jpg',
  'jpeg'
];

function bufferToBase64DataUrl(buffer, mimeType) {
  return 'data:' + mimeType + ';base64,' + buffer.toString('base64');
}

function execGitCommand(cmd) {
  return cp.execSync(cmd).toString()
    .replace(/\n/g, ',')
    .split(',')
    .map(value => value.trim())
    .filter(value => value.length > 0);
}

function getGitInfo() {
  const branch = execGitCommand('git branch --show-current')[0];
  const tag = execGitCommand('git describe --tags')[0];
  const changes = execGitCommand('git status --porcelain').map(value => {
    const [type, path] = value.split(' ');
    return { type, path };
  });
  const userName = execGitCommand('git config user.name')[0];
  return {
    branch,
    tag,
    changes,
    user: userName
  }
}

/**
 * writes the diff files to the app for version control
 */
function writeDiff() {
  if (!fs.existsSync(path.resolve(diffFolder))) {
    fs.mkdirSync(diffFolder);
  }
  cp.execSync(`git diff upstream/master > ${diffPath}`);
  cp.execSync(`git diff > ${stagingDiffPath}`);
  //cp.execSync(`git apply --include dist/fabric.js ${diffPath}`);
}

function buildDist() {
  cp.execSync('node build.js modules=ALL requirejs fast', { cwd: main });
}

function copyBuildToApp() {
  console.log(`> building dist`);
  buildDist();
  let content = fs.readFileSync(fabricSource).toString();
  const gitInfo = getGitInfo();
  content += `\n// fabric react sandbox`;
  content += `\n// last git tag ${gitInfo.tag}`;
  content += `\nfabric.version='#${gitInfo.tag}';\n`;
  fs.writeFileSync(fabricDest, content);
  console.log(`> generated ${fabricDest}`);
}

/**
 * 
 * @param {'ts'|'js'} [template='js']
 */
function createReactAppIfNeeded(template = 'js') {
  if (!fs.existsSync(appDir)) {
    cp.execSync(`npx create-react-app test/${APP_NAME} --template file:${path.resolve(templateDir, template)}`, { cwd: main, stdio: 'inherit' });
  }
}

/**
 *
 * @param {'ts'|'js'} [template='js']
 */
async function startReactSandbox(template = 'js') {
  createReactAppIfNeeded(template);
  copyBuildToApp();
  writeDiff();
  console.log(chalk.yellow.bold('\n> watching for changes in fabric'));
  fs.watch(src, { recursive: true }, () => {
    try {
      copyBuildToApp();
      writeDiff();
    } catch (error) {
      console.log(chalk.blue.bold('> error listening to/building fabric'));
    }
  });
  const port = await createServer(5000);
  const packagePath = path.resolve(appDir, 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath).toString());
  package.proxy = `http://localhost:${port}`;
  fs.writeFileSync(packagePath, JSON.stringify(package, null, '\t'));
  try {
    cp.spawn('npm', ['start'], { shell: true, cwd: appDir, stdio: 'inherit' });
  } catch (error) {
    console.log(chalk.yellow.bold('\n> stopped watching for changes in fabric'));
    process.exit(1);
  }
}

function createDeployedEnv() {
  let env = fs.readFileSync(path.resolve(appDir, '.env')).toString();
  env += '\nREACT_APP_SANDBOX_DEPLOYED=true\n';
  return env;
}

/**
 * https://codesandbox.io/docs/api/#define-api
 */
async function createCodeSandbox() {
  createReactAppIfNeeded();
  copyBuildToApp();
  writeDiff();
  const files = {
    '.env': { content: createDeployedEnv() },
    'src/git.json': { content: getGitInfo() }
  };
  const processFile = (fileName) => {
    const filePath = path.resolve(appDir, fileName);
    const ext = path.extname(fileName).slice(1);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath)
        .forEach(file => {
          processFile(path.join(fileName, file).replace(/\\/g, '/'));
        });
    } else if (BINARY_EXT.some(x => x === ext)) {
      files[fileName] = {
        content: bufferToBase64DataUrl(fs.readFileSync(filePath), `image/${ext}`),
        isBinary: true
      };
    } else {
      files[fileName] = { content: fs.readFileSync(filePath).toString() };
    }
  }
  FILES.forEach(processFile);
  // add diff files to public diretory so we can download them drom the app
  const diffFolderName = 'src/diff';
  fs.readdirSync(path.resolve(appDir, diffFolderName))
    .forEach(file => {
      const fileName = path.join('public', 'diff', file).replace(/\\/g, '/');
      const filePath = path.resolve(appDir, diffFolderName, file);
      files[fileName] = { content: fs.readFileSync(filePath).toString() };
    });

  const isTypescript = fs.existsSync(path.resolve(appDir, 'src', 'App.tsx'));
  try {
    const { data: { sandbox_id } } = await Axios.post("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
      template: isTypescript ? 'create-react-app-typescript' : 'create-react-app',
      files
    });
    const uri = `https://codesandbox.io/s/${sandbox_id}`;
    console.log(chalk.yellow(`created code sandbox ${uri}`));
    return uri;
  } catch (error) {
    throw error.toJSON();
  }
}

async function createAndOpenCodeSandbox() {
  const uri = await createCodeSandbox();
  runApplication(uri);
}

function runApplication(cmd) {
  cp.execSync(`${os.platform().startsWith('win') ? 'start' : 'open'} ${cmd}`);
}

/**
 * 
 * @param {number} [port]
 * @returns {Promise<number>} port
 */
function createServer(port = 5000) {
  const server = http.createServer(async (req, res) => {
    switch (req.url) {
      case '/codesandbox':
        try {
          const uri = await createCodeSandbox();
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ uri }, null, '\t'));
        } catch (error) {
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ error }, null, '\t'));
        }
        break;
      case '/git':
        res.writeHead(200, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify(getGitInfo(), null, '\t'));
        break;
      case '/open-ide':
        runApplication(path.resolve(appDir, 'src', 'App.tsx'));
        res.writeHead(200);
        res.end();
        break;
      default:
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.end(`unknown endpoint ${req.url}`);
        break;
    }
  });

  return new Promise((resolve, reject) => {
    const initialPort = port;
    const listen = () => {
      server.listen(port)
        .on('listening', () => {
          resolve(port);
        })
        .on('error', (error) => {
          server.close();
          if (error.code === 'EADDRINUSE' && port - initialPort < 100) {
            port++;
            listen();
          } else {
            console.error(error);
            reject(error);
            process.exit(1);
          }
        });
    };
    listen();
  }).then(port => {
    console.log(chalk.yellow.bold(`> sandbox server is listening on port ${port}`));
    return port;
  });
}

//  cli 

const cmd = process.argv.slice(2)[0];
const typescript = process.argv.slice(2).indexOf('--typescript') > -1;
const template = typescript ? 'ts' : 'js';

if (cmd === 'start') {
  startReactSandbox(template);
} else if (cmd === 'deploy') {
  createAndOpenCodeSandbox();
} else if (cmd === 'serve') {
  createServer();
}