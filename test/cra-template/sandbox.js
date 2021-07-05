const fs = require('fs');
const Axios = require('axios');
const chalk = require('chalk');
const path = require('path');
const http = require('http');
const os = require('os');
const cp = require('child_process');
const yargs = require('yargs');

const APP_NAME = 'react-sandbox';

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
function writeDiff(context) {
  const diffFolder = path.resolve(context.appPath, 'src', 'diff');
  const diffPath = path.resolve(diffFolder, 'upstream.diff');
  const stagingDiffPath = path.resolve(diffFolder, 'staging.diff');
  if (!fs.existsSync(path.resolve(diffFolder))) {
    fs.mkdirSync(diffFolder);
  }
  console.log(`> writing diff files`);
  cp.execSync(`git diff upstream/master > ${diffPath}`);
  cp.execSync(`git diff > ${stagingDiffPath}`);
  //cp.execSync(`git apply --include dist/fabric.js ${diffPath}`);
}

function buildDist(context) {
  cp.execSync('node build.js modules=ALL requirejs fast', { cwd: context.fabricPath });
}

function copyBuildToApp(context) {
  const fabricSource = path.resolve(context.fabricPath, 'dist', 'fabric.js');
  const fabricDest = path.resolve(context.appPath, 'src', 'fabric', 'build.js');
  console.log(`> building dist`);
  buildDist(context);
  let content = fs.readFileSync(fabricSource).toString();
  const gitInfo = getGitInfo();
  content += `\n// fabric react sandbox`;
  content += `\n// last git tag ${gitInfo.tag}`;
  content += `\nfabric.version='#${gitInfo.tag}';\n`;
  fs.writeFileSync(fabricDest, content);
  console.log(`> generated ${fabricDest}`);
}

function createReactAppIfNeeded(context) {
  const { template, appPath } = context;
  if (!fs.existsSync(appPath)) {
    const templateDir = process.cwd();
    console.log(chalk.blue(`> creating sandbox using cra-template-${template}`));
    template === 'js' && console.log(chalk.yellow(`> if you want to use typescript re-run with --typescript flag`));
    cp.execSync(`npx create-react-app ${context.appPath} --template file:${path.resolve(templateDir, template)}`, {
      stdio: 'inherit'
    });
  }
}

async function startReactSandbox(context) {
  const { appPath, fabricPath } = context;
  createReactAppIfNeeded(context);
  copyBuildToApp(context);
  writeDiff(context);
  console.log(chalk.yellow('\n> watching for changes in fabric'));
  fs.watch(path.resolve(fabricPath, 'src'), { recursive: true }, () => {
    try {
      copyBuildToApp(context);
      writeDiff(context);
    } catch (error) {
      console.log(chalk.blue('> error listening to/building fabric'));
    }
  });
  const port = await createServer(context, 5000);
  const packagePath = path.resolve(appPath, 'package.json');
  const package = JSON.parse(fs.readFileSync(packagePath).toString());
  package.proxy = `http://localhost:${port}`;
  fs.writeFileSync(packagePath, JSON.stringify(package, null, '\t'));
  try {
    cp.spawn('npm', ['start'], { shell: true, cwd: appPath, stdio: 'inherit' });
  } catch (error) {
    console.log(chalk.yellow('\n> stopped watching for changes in fabric'));
    process.exit(1);
  }
}

function createDeployedEnv(context) {
  let env = fs.readFileSync(path.resolve(context.appPath, '.env')).toString();
  env += '\nREACT_APP_SANDBOX_DEPLOYED=true\n';
  return env;
}

/**
 * https://codesandbox.io/docs/api/#define-api
 */
async function createCodeSandbox(context) {
  const { appPath } = context;
  createReactAppIfNeeded(context);
  copyBuildToApp(context);
  writeDiff(context);
  const files = {
    '.env': { content: createDeployedEnv(context) },
    'src/git.json': { content: getGitInfo() }
  };
  const processFile = (fileName) => {
    const filePath = path.resolve(appPath, fileName);
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
  fs.readdirSync(path.resolve(appPath, diffFolderName))
    .forEach(file => {
      const fileName = path.join('public', 'diff', file).replace(/\\/g, '/');
      const filePath = path.resolve(appPath, diffFolderName, file);
      files[fileName] = { content: fs.readFileSync(filePath).toString() };
    });

  const isTypescript = fs.existsSync(path.resolve(appPath, 'src', 'App.tsx'));
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

async function createAndOpenCodeSandbox(context) {
  const uri = await createCodeSandbox(context);
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
function createServer(context, port = 5000) {
  const { appPath } = context;
  const server = http.createServer(async (req, res) => {
    switch (req.url) {
      case '/codesandbox':
        try {
          const uri = await createCodeSandbox(context);
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
        let appFile = path.resolve(appPath, 'src', 'App.tsx');
        if (!fs.existsSync(appFile)) {
          appFile = path.resolve(appPath, 'src', 'App.js');
        }
        if (fs.existsSync(appFile)) {
          runApplication(appFile);
        }
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
    console.log(chalk.yellow(`> sandbox server is listening on port ${port}`));
    return port;
  });
}

function getCommonCmd(cmd) {
  return `${cmd} <fabricPath> <appPath> [typescript]`;
}

function applyCommonPositionals(yargs) {
  yargs.positional('fabricPath', {
    type: 'string',
    describe: 'the path pointing to the fabric local repository'
  });
  yargs.positional('appPath', {
    type: 'string',
    describe: 'the path where you want the sandbox to be created at',
    default: `./${APP_NAME}`,
  });
  yargs.positional('typescript', {
    type: 'boolean',
    describe: 'build the sandbox with typescript',
    default: false
  });
}

function runInContext(cb, argv) {
  const context = {
    fabricPath: path.resolve(process.cwd(), argv.fabricPath),
    appPath: path.resolve(process.cwd(), argv.appPath),
    template: argv.typescript ? 'ts' : 'js'
  }
  Object.freeze(context);
  cb(context);
}

yargs
  .scriptName('fabric.js react sandbox')
  .usage('$0 <cmd> [args]')
  .command(getCommonCmd('start'), 'start the sandbox', applyCommonPositionals, runInContext.bind(undefined, startReactSandbox))
  .command(getCommonCmd('deploy'), 'deploy to codesandbox.io', applyCommonPositionals, runInContext.bind(undefined, createAndOpenCodeSandbox))
  .command(getCommonCmd('serve'), 'start the server', applyCommonPositionals, runInContext.bind(undefined, async context => {
    const port = await createServer(context);
    runApplication(`http://localhost:${port}`);
  }))
  .help()
  .argv;