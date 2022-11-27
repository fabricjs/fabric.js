#!/usr/bin/env node

/**
 * Dearest fabric maintainer 💗,
 * This file contains the cli logic, which governs most of the available commands fabric has to offer.
 *
 * 📢 **IMPORTANT**
 * CI uses these commands.
 * In order for CI to correctly report the result of the command, the process must receive a correct exit code
 * meaning that if you `spawn` a process, make sure to listen to the `exit` event and terminate the main process with the relevant code.
 * Failing to do so will make CI report a false positive 📉.
 */

import chalk from 'chalk';
import cp from 'child_process';
import * as commander from 'commander';
import fs from 'fs-extra';
import fuzzy from 'fuzzy';
import inquirer from 'inquirer';
import Checkbox from 'inquirer-checkbox-plus-prompt';
import killPort from 'kill-port';
import _ from 'lodash';
import moment from 'moment';
import path from 'node:path';
import process from 'node:process';
import os from 'os';
import { build } from './build.mjs';
import { awaitBuild } from './buildLock.mjs';
import { CLI_CACHE, testResultsPath, wd, __dirname } from './dirname.mjs';
import { listFiles, transform as transformFiles } from './transform_files.mjs';

const program = new commander.Command();

const websiteDir = path.resolve(wd, '../fabricjs.com');

function execGitCommand(cmd) {
  return cp
    .execSync(cmd, { cwd: wd })
    .toString()
    .replace(/\n/g, ',')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function getGitInfo(branchRef) {
  const branch = execGitCommand('git branch --show-current')[0];
  const tag = execGitCommand('git describe --tags')[0];
  const uncommittedChanges = execGitCommand('git status --porcelain').map(
    (value) => {
      const [type, path] = value.split(' ');
      return { type, path };
    }
  );
  const changes = execGitCommand(`git diff ${branchRef} --name-only`);
  const userName = execGitCommand('git config user.name')[0];
  return {
    branch,
    tag,
    uncommittedChanges,
    changes,
    user: userName,
  };
}

class ICheckbox extends Checkbox {
  constructor(questions, rl, answers) {
    super(questions, rl, answers);
    this.opt.source = this.opt.source.bind(this);
  }
  getCurrentValue() {
    const current = super.getCurrentValue();
    return current.concat(this.firstSourceLoading ? this.default : []);
  }
  onSpaceKey() {
    const choice = this.choices.getChoice(this.pointer);
    if (!choice) {
      return;
    }

    this.toggleChoice(choice);
    if (choice.value && !choice.value.file) {
      delete this.lastQuery;
      // Remove the choices from the checked values with the same type
      _.remove(this.value, (v) => v.type === choice.value.type && v.file);
      _.remove(this.checkedChoices, (checkedChoice) => {
        if (!checkedChoice.value.file) {
          return false;
        }
        checkedChoice.checked = false;
        return checkedChoice.value.type === choice.value.type;
      });

      this.executeSource();
    }

    this.render();
  }
}
inquirer.registerPrompt('test-selection', ICheckbox);

function startWebsite() {
  if (
    JSON.parse(fs.readFileSync(path.resolve(websiteDir, 'package.json')))
      .name !== 'fabricjs.com'
  ) {
    console.log(chalk.red('Could not locate fabricjs.com directory'));
  }
  const args = ['run', 'start:dev'];

  //  WSL ubuntu
  // https://github.com/microsoft/WSL/issues/216
  // os.platform() === 'win32' && args.push('--', '--force_polling', '--livereload');
  if (os.platform() === 'win32') {
    console.log(
      chalk.green(
        'Consider using ubuntu on WSL to run jekyll with the following options:'
      )
    );
    console.log(chalk.yellow('-- force_polling --livereload'));
    console.log(chalk.gray('https://github.com/microsoft/WSL/issues/216'));
  }

  cp.spawn('npm', args, {
    stdio: 'inherit',
    cwd: websiteDir,
    shell: true,
  });
}

function watch(path, callback, debounce = 500) {
  fs.watch(
    path,
    { recursive: true },
    _.debounce(
      (type, location) => {
        try {
          callback(type, location);
        } catch (error) {
          console.error(error);
        }
      },
      debounce,
      { trailing: true }
    )
  );
}

function copy(from, to) {
  try {
    fs.copySync(from, to);
    const containingFolder = path.resolve(wd, '..');
    console.log(
      `copied ${path.relative(containingFolder, from)} to ${path.relative(
        containingFolder,
        to
      )}`
    );
  } catch (error) {
    console.error(error);
  }
}

const BUILD_SOURCE = ['src', 'lib', 'HEADER.js'];

function exportBuildToWebsite(options = {}) {
  _.defaultsDeep(options, { gestures: true });
  build({
    output: path.resolve(websiteDir, './lib/fabric.js'),
    fast: true,
    watch: options.watch,
  });
  if (options.gestures) {
    build({
      exclude: ['accessors'],
      output: path.resolve(websiteDir, './lib/fabric_with_gestures.js'),
      fast: true,
      watch: options.watch,
    });
  }
}

function exportAssetsToWebsite(options) {
  copy(
    path.resolve(wd, './package.json'),
    path.resolve(websiteDir, './lib/package.json')
  );
  BUILD_SOURCE.forEach((p) =>
    copy(path.resolve(wd, p), path.resolve(websiteDir, './build/files', p))
  );
  console.log(
    chalk.bold(`[${moment().format('HH:mm')}] exported assets to fabricjs.com`)
  );
  options.watch &&
    BUILD_SOURCE.forEach((p) => {
      watch(path.resolve(wd, p), () => {
        copy(path.resolve(wd, p), path.resolve(websiteDir, './build/files', p));
        console.log(
          chalk.bold(
            `[${moment().format('HH:mm')}] exported ${p} to fabricjs.com`
          )
        );
      });
    });
}

function exportTestsToWebsite(options) {
  const exportTests = () => {
    const paths = [
      './test/unit',
      './test/visual',
      './test/fixtures',
      './test/lib',
    ];
    paths.forEach((location) =>
      copy(path.resolve(wd, location), path.resolve(websiteDir, location))
    );
    console.log(
      chalk.bold(`[${moment().format('HH:mm')}] exported tests to fabricjs.com`)
    );
  };
  exportTests();
  options.watch && watch(path.resolve(wd, './test'), exportTests);
}

function exportToWebsite(options) {
  if (!options.include || options.include.length === 0) {
    options.include = ['build', 'tests'];
  }
  options.include.forEach((x) => {
    if (x === 'build') {
      exportBuildToWebsite(options);
      exportAssetsToWebsite(options);
    } else if (x === 'tests') {
      exportTestsToWebsite(options);
    }
  });
}

function logTestResults(dir, context, suite) {
  console.log(
    `\n\n${chalk.underline(
      chalk.cyan(`${_.upperFirst(context)} ${_.upperFirst(suite)} Test Results`)
    )}\n`
  );
  console.log(
    fs.readFileSync(path.resolve(dir, suite, `${context}.txt`)).toString()
  );
}

/**
 *
 * @returns {Promise<boolean | undefined>} true if some tests failed
 */
async function runTestem({
  suite,
  port,
  launch,
  dev,
  parallel,
  out,
  processOptions,
  context,
} = {}) {
  port = port || suite === 'visual' ? 8081 : 8080;
  try {
    await killPort(port);
  } catch (error) {}

  if (launch) {
    // open localhost
    const url = `http://localhost:${port}/`;
    const start =
      os.platform() === 'darwin'
        ? 'open'
        : os.platform() === 'win32'
        ? 'start'
        : 'xdg-open';
    cp.exec([start, url].join(' '));
  }

  const processCmdOptions = [
    '-p',
    port,
    '-f',
    `test/testem.${suite}.js`,
    '-l',
    context.map(_.upperFirst).join(','),
  ];

  if (dev || launch) {
    cp.spawn(['testem', ...processCmdOptions].join(' '), {
      ...processOptions,
      detached: true,
    });
  } else {
    const cmd = ['testem', 'ci', ...processCmdOptions].join(' ');
    if (parallel) {
      return new Promise((resolve) => {
        cp.spawn(cmd, {
          ...processOptions,
          detached: true,
        }).on('exit', (code) => {
          context.forEach((c) => {
            logTestResults(out, c, suite);
          });
          resolve(code);
        });
      });
    } else {
      try {
        cp.execSync(cmd, processOptions);
      } catch (error) {
        return true;
      }
    }
  }
}

async function awaitIfSync(task, parallel) {
  if (!parallel) await task;
  return task;
}

/**
 *
 * @param {'unit' | 'visual'} suite
 * @param {string[] | null} tests file paths
 * @param {{debug?:boolean,recreate?:boolean,verbose?:boolean,filter?:string}} [options]
 * @returns {Promise<boolean | undefined>} true if some tests failed
 */
async function test(suite, tests, options = {}) {
  fs.removeSync(testResultsPath);
  fs.mkdirSync(testResultsPath, { recursive: true });

  await awaitBuild();

  const qunitEnv = {
    DEBUG_VISUAL_TESTS: Number(options.debug),
    RECREATE_VISUAL_REFS: Number(options.recreate),
    LAUNCH_BROWSER: Number(options.launch || options.dev),
    QUNIT_FILTER: options.filter,
    QUNIT_TIMEOUT: 15000,
  };
  const env = {
    ...process.env,
    TEST_FILES: (tests || []).join(','),
    NODE_CMD: [
      options.coverage ? 'nyc --silent' : '',
      'qunit',
      'test/testSetup.node.js',
      suite === 'visual' ? 'test/lib' : '',
    ]
      .concat(tests || `test/${suite}`)
      .join(' '),
    VERBOSE: Number(options.verbose),
    REPORT_DIR: path.resolve(options.out, suite),
  };
  const browserContexts = options.context.filter((c) => c !== 'node');
  const tasks = [];

  // temporary revert
  // run node tests directly with qunit
  if (options.context.includes('node')) {
    fs.ensureDirSync(path.resolve(options.out, suite));
    const processOptions = {
      shell: true,
      stdio: 'inherit',
      env: {
        ...env,
        // browser takes precedence in golden ref generation
        ...(browserContexts.length === 0 ? qunitEnv : {}),
        REPORT_FILE: path.resolve(options.out, suite, 'node.txt'),
      },
    };
    if (options.parallel) {
      const task = new Promise((resolve) => {
        cp.spawn('node', [path.resolve(__dirname, 'runNodeTest.mjs')], {
          ...processOptions,
          detached: true,
        }).on('exit', (code) => {
          logTestResults(options.out, 'node', suite);
          resolve(code);
        });
      });
      tasks.push(task);
    } else {
      try {
        cp.execSync(env.NODE_CMD, processOptions);
      } catch (error) {
        tasks.push(true);
      }
    }
  }

  if (browserContexts.length > 0) {
    const task = runTestem({
      ...options,
      suite,
      processOptions: {
        cwd: wd,
        env: {
          ...env,
          ...qunitEnv,
        },
        shell: true,
        stdio: 'inherit',
      },
      context: browserContexts,
    });

    tasks.push(awaitIfSync(task, options.parallel));
  }

  return Promise.all(tasks).then((failed) => failed.some((status) => status));
}

/**
 *
 * @param {'unit'|'visual'} type corresponds to the test directories
 * @returns
 */
function listTestFiles(type) {
  return fs.readdirSync(path.resolve(wd, './test', type)).filter((p) => {
    const ext = path.parse(p).ext.slice(1);
    return ext === 'js' || ext === 'ts';
  });
}

function writeCLIFile(tests) {
  fs.writeFileSync(CLI_CACHE, JSON.stringify(tests, null, '\t'));
}

function readCLIFile() {
  return fs.existsSync(CLI_CACHE) ? JSON.parse(fs.readFileSync(CLI_CACHE)) : [];
}

function createChoiceData(type, file) {
  return {
    name: `${type}/${file}`,
    short: `${type}/${file}`,
    value: {
      type,
      file,
    },
  };
}

async function selectFileToTransform() {
  const files = _.map(listFiles(), ({ dir, file }) =>
    createChoiceData(
      path.relative(path.resolve(wd, 'src'), dir).replaceAll('\\', '/'),
      file
    )
  );
  const { tests: filteredTests } = await inquirer.prompt([
    {
      type: 'test-selection',
      name: 'tests',
      message: 'Select files to transform to es6',
      highlight: true,
      searchable: true,
      default: [],
      pageSize: 10,
      source(answersSoFar, input = '') {
        return new Promise((resolve) => {
          const value = _.map(this.getCurrentValue(), (value) =>
            createChoiceData(value.type, value.file)
          );
          const res = fuzzy
            .filter(input, files, {
              extract: (item) => item.name,
            })
            .map((element) => element.original);
          resolve(value.concat(_.differenceBy(res, value, 'name')));
        });
      },
    },
  ]);
  return filteredTests.map(({ type, file }) =>
    path.resolve(wd, 'src', type, file)
  );
}

async function selectTestFile() {
  const selected = readCLIFile();
  const unitTests = listTestFiles('unit').map((file) =>
    createChoiceData('unit', file)
  );
  const visualTests = listTestFiles('visual').map((file) =>
    createChoiceData('visual', file)
  );
  const { tests: filteredTests } = await inquirer.prompt([
    {
      type: 'test-selection',
      name: 'tests',
      message: 'Select test files',
      highlight: true,
      searchable: true,
      default: selected,
      pageSize: Math.max(10, selected.length),
      source(answersSoFar, input = '') {
        return new Promise((resolve) => {
          const tests = _.concat(unitTests, visualTests);
          const value = _.map(this.getCurrentValue(), (value) =>
            createChoiceData(value.type, value.file)
          );
          if (value.length > 0) {
            if (
              value.find(
                (v) => v.value && v.value.type === 'unit' && !v.value.file
              )
            ) {
              _.pullAll(tests, unitTests);
            }
            if (
              value.find(
                (v) => v.value && v.value.type === 'visual' && !v.value.file
              )
            ) {
              _.pullAll(tests, visualTests);
            }
          }
          const unitChoice = createChoiceData('unit', '');
          const visualChoice = createChoiceData('visual', '');
          !value.find((v) => _.isEqual(v, unitChoice)) &&
            value.push(unitChoice);
          !value.find((v) => _.isEqual(v, visualChoice)) &&
            value.push(visualChoice);
          if (value.length > 0) {
            value.unshift(new inquirer.Separator());
            value.push(new inquirer.Separator());
          }
          const res = fuzzy
            .filter(input, tests, {
              extract: (item) => item.name,
            })
            .map((element) => element.original);
          resolve(value.concat(_.differenceBy(res, value, 'name')));
        });
      },
    },
  ]);
  writeCLIFile(filteredTests);
  return filteredTests;
}

async function runInteractiveTestSuite(options) {
  //  some tests fail because of some pollution when run from the same context
  // test(_.map(await selectTestFile(), curr => `test/${curr.type}/${curr.file}`))
  const tests = _.reduce(
    await selectTestFile(),
    (acc, curr) => {
      if (!curr.file) {
        acc[curr.type] = true;
      } else if (Array.isArray(acc[curr.type])) {
        acc[curr.type].push(`test/${curr.type}/${curr.file}`);
      }
      return acc;
    },
    { unit: [], visual: [] }
  );
  return Promise.all(
    _.reduce(
      tests,
      (tasks, files, suite) => {
        if (files === true) {
          tasks.push(awaitIfSync(test(suite, null, options)));
        } else if (Array.isArray(files) && files.length > 0) {
          tasks.push(awaitIfSync(test(suite, files, options)));
        }
        return tasks;
      },
      []
    )
  );
}

function buildVisualTestResultsIndex() {
  const headers = ['actual', 'expected', 'diff'];
  const visualResultsDir = path.resolve(testResultsPath, 'visual');
  if (!fs.existsSync(visualResultsDir)) return;
  fs.readdirSync(visualResultsDir).forEach((context) => {
    const dir = path.resolve(visualResultsDir, context);
    if (!fs.lstatSync(dir).isDirectory()) return;
    const entries = [];
    function recurse(dir) {
      if (!fs.lstatSync(dir).isDirectory()) return;
      else if (fs.existsSync(path.resolve(dir, 'info.json'))) {
        entries.push(dir);
      } else {
        fs.readdirSync(dir).forEach((child) =>
          recurse(path.resolve(dir, child))
        );
      }
    }
    recurse(dir);

    const rows = [
      `<thead style="position:sticky;top: 0;">${[
        'test',
        'file',
        'status',
        ...headers,
      ]
        .map((th) => `<th>${th}</th>`)
        .join('')}</thead>`,
      ...entries.map((testDir) => {
        const { module, test, file, passing } = fs.readJSONSync(
          path.resolve(testDir, 'info.json')
        );
        const content = [
          `${module} / ${test}`,
          file,
          passing ? 'passing' : `<strong style="color:red">FAILING</strong>`,
          ...headers.map(
            (t) =>
              `<img src="${path.relative(
                dir,
                path.resolve(testDir, `${t}.png`)
              )}">`
          ),
        ]
          .map((td) => `<td>${td}</td>`)
          .join('\n');

        return `<tr>${content}</tr>`;
      }),
    ];
    fs.writeFileSync(
      path.resolve(dir, 'index.html'),
      `<html><head><style>
table, td, th {
  border: 1px solid;
}

table {
  width: 100%;
  border-collapse: collapse;
}
</style></head>
<body><table>${rows.join('\n')}</table></body></html>`
    );
  });
}

program
  .name('fabric.js')
  .description('fabric.js DEV CLI tools')
  .version(process.env.npm_package_version)
  .showSuggestionAfterError();

program
  .command('start')
  .description('start fabricjs.com dev server and watch for changes')
  .action((options) => {
    exportToWebsite({
      watch: true,
    });
    startWebsite();
  });

program
  .command('dev')
  .description('watch for changes in `src` and `test` directories')
  .action(() => {
    cp.spawn('npm run build -- -f -w', { stdio: 'inherit', shell: true });
    cp.spawn('npm run build-tests -- -w', { stdio: 'inherit', shell: true });
  });

program
  .command('build')
  .description('build dist')
  .option('-f, --fast', 'skip minifying')
  .option('-w, --watch')
  .option('-i, --input <...path>', 'specify the build input paths')
  .option('-o, --output <path>', 'specify the build output path')
  .option('-x, --exclude <exclude...>')
  .option('-m, --modules <modules...>')
  .option('-s, --stats', 'inspect build statistics', false)
  .action((options) => {
    build(options);
  });

program
  .command('test')
  .description('run test suite')
  .addOption(
    new commander.Option('-s, --suite <suite...>', 'test suite to run').choices(
      ['unit', 'visual']
    )
  )
  .option('-f, --file <file>', 'run a specific test file')
  .option('--filter <filter>', 'filter tests by name')
  .option('-a, --all', 'run all tests', false)
  .option(
    '-d, --debug',
    'debug visual tests by overriding refs (golden images) in case of visual changes',
    false
  )
  .option('-r, --recreate', 'recreate visual refs (golden images)', false)
  .option('-v, --verbose', 'log passing tests', !process.env.CI)
  .option('-nv, --no-verbose', 'disable verbose logging')
  .option('-l, --launch', 'launch tests in the browser', false)
  .option('--dev', 'runs testem in `dev` mode, without a `ci` flag', false)
  .option('-p, --parallel', 'runs tests in parallel', true)
  .option('-np, --no-parallel', 'runs tests one after the other')
  .addOption(
    new commander.Option('-c, --context <context...>', 'context to test in')
      .choices(['node', 'chrome', 'firefox'])
      .default(['node'])
  )
  .option('-p, --port')
  .option(
    '-o, --out <out>',
    'directory path to report test results to',
    testResultsPath
  )
  .option('--clear-cache', 'clear CLI test cache', false)
  .option(
    '-cov, --coverage',
    'inspect coverage, currently supported on node only',
    false
  )
  .action(async (options) => {
    if (options.clearCache) {
      fs.removeSync(CLI_CACHE);
    }
    if (options.all) {
      options.suite = ['unit', 'visual'];
    }
    if ((options.recreate || options.debug) && options.context.length > 1) {
      console.warn(
        chalk.yellow(
          `\n[CAUTION]: Using the recreate/debug option with multiple contexts (${options.context}) is not advised`,
          `since it will recreate visual refs from the last run\n`
        )
      );
    }
    if (options.coverage && !options.context.includes('node')) {
      console.error(chalk.red('Coverage reporting is available on node only.'));
      console.info(
        chalk.redBright(
          'For available solutions see:\n`karma` as a replacement for `testem`\nOR https://github.com/testem/testem/tree/master/examples/coverage_istanbul\n'
        )
      );
      process.exit(1);
    }
    const results = [];
    if (options.suite) {
      results.push(
        ...(await Promise.all(
          _.map(options.suite, (suite) => {
            return test(suite, null, options);
          })
        ))
      );
    } else if (options.file) {
      results.push(
        await test(
          options.file.startsWith('visual') ? 'visual' : 'unit',
          [`test/${options.file}`],
          options
        )
      );
    } else {
      results.push(...(await runInteractiveTestSuite(options)));
    }

    buildVisualTestResultsIndex();

    if (_.some(results)) {
      // inform ci that tests have failed
      process.exit(1);
    }
  });

const website = program.command('website').description('fabricjs.com commands');

website
  .command('start')
  .description('start fabricjs.com dev server')
  .allowExcessArguments()
  .allowUnknownOption()
  .action(startWebsite);

website
  .command('export')
  .description('export files to fabricjs.com directory')
  .addOption(
    new commander.Option('-i, --include <what...>')
      .choices(['build', 'tests'])
      .default(['build', 'tests'], 'export all')
  )
  .option('-w, --watch')
  .action(exportToWebsite);

program
  .command('transform')
  .description('transforms files into es6')
  .option('-o, --overwrite', 'overwrite exisitng files', false)
  .option('-x, --no-exports', 'do not use exports')
  .option('-i, --index', 'create index files', false)
  .option('-ts, --typescript', 'transform into typescript', false)
  .option('-v, --verbose', 'verbose logging', true)
  .option('-a, --all', 'transform all files', false)
  .option(
    '-d, --diff <branch>',
    'compare against given branch (default: master) and transform all files with diff'
  )
  .action(
    async ({
      overwrite,
      exports,
      index,
      typescript,
      verbose,
      all,
      diff: gitRef,
    } = {}) => {
      let files = [];
      if (gitRef) {
        gitRef = gitRef === true ? 'master' : gitRef;
        const { changes } = getGitInfo(gitRef);
        files = changes.map((change) => path.resolve(wd, change));
      } else if (!all) {
        files = await selectFileToTransform();
      }
      transformFiles({
        overwriteExisitingFiles: overwrite,
        useExports: exports,
        createIndex: index,
        ext: typescript ? 'ts' : 'js',
        verbose,
        files,
      });
    }
  );

program.parse(process.argv);
