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
const fabricDest = path.resolve(appDir, 'src', 'fabric.js');

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
  return {
    branch,
    tag,
    changes
  }
}

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

async function startReactSandbox() {
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
  const port = await createServer(5000);
  const packagePath = path.resolve(appDir, 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath).toString());
  console.log(package)
  package.proxy = `http://localhost:${port}`;
  fs.writeFileSync(packagePath, JSON.stringify(package, null, '\t'));
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
  'src/hooks.tsx',
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

/**
 * 
 * @param {number} [port]
 * @returns {Promise<number>} port
 */
function createServer(port = 5000) {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/codesandbox') {
      const uri = await createCodeSandbox();
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ uri }));
    } else if (req.url === '/git') {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(getGitInfo(), null, '\t'));
    } else {
      res.writeHead(400, {
        'Content-Type': 'application/json'
      });
      res.end();
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
    console.log(chalk.yellow.bold(`> codesandbox server is listening on port ${port}`));
    return port;
  });
}

//  cli 

const cmd = process.argv.slice(2)[0];

if (cmd === 'start') {
  startReactSandbox();
} else if (cmd === 'deploy') {
  createAndOpenCodeSandbox();
} else if (cmd === 'serve') {
  createServer();
}