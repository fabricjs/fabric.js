#!/usr/bin/env node
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const cp = require('child_process');
const inquirer = require('inquirer');
const ansiEscapes = require('ansi-escapes');
const fuzzy = require('fuzzy');
const chalk = require('chalk');
const moment = require('moment');
const Checkbox = require('inquirer-checkbox-plus-prompt');
const commander = require('commander');
const program = new commander.Command();

const { transform: transformFiles, listFiles } = require('./transform_files');

const CLI_CACHE = path.resolve(__dirname, 'cli_cache.json');
const wd = path.resolve(__dirname, '..');
const websiteDir = path.resolve(wd, '../fabricjs.com');

function execGitCommand(cmd) {
    return cp.execSync(cmd, { cwd: wd }).toString()
        .replace(/\n/g, ',')
        .split(',')
        .map(value => value.trim())
        .filter(value => value.length > 0);
}

function getGitInfo(branchRef) {
    const branch = execGitCommand('git branch --show-current')[0];
    const tag = execGitCommand('git describe --tags')[0];
    const uncommittedChanges = execGitCommand('git status --porcelain').map(value => {
        const [type, path] = value.split(' ');
        return { type, path };
    });
    const changes = execGitCommand(`git diff ${branchRef} --name-only`);
    const userName = execGitCommand('git config user.name')[0];
    return {
        branch,
        tag,
        uncommittedChanges,
        changes,
        user: userName
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
            _.remove(this.value, v => v.type === choice.value.type && v.file);
            _.remove(this.checkedChoices, checkedChoice => {
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

function build(options = {}) {
    //  _.defaults(options, { exclude: ['gestures', 'accessors', 'erasing'] });
    // const args = [
    //     `npm run`,
    //     `build.js`,
    //     `modules=${options.modules && options.modules.length > 0 ? options.modules.join(',') : 'ALL'}`,
    //     `requirejs`,
    //     `${options.fast ? 'fast' : ''}`,
    //     `exclude=${options.exclude.join(',')}`
    // ]
    const args = ['npm run', 'build-rollup'];
    cp.execSync(args.join(' '), { stdio: 'inherit', cwd: wd, env: { ...process.env, MINIFY: Number(!options.fast) } });
}

function startWebsite() {
    if (require(path.resolve(websiteDir, 'package.json')).name !== 'fabricjs.com') {
        console.log(chalk.red('Could not locate fabricjs.com directory'));
    }
    cp.spawn('npm', ['run', 'start:dev'], {
        stdio: 'inherit',
        cwd: websiteDir,
        shell: true,
    });
}

function watch(path, callback, debounce = 500) {
    fs.watch(path, { recursive: true }, _.debounce((type, location) => {
        try {
            callback(type, location);
        } catch (error) {
            console.error(error);
        }
    }, debounce, { trailing: true }));
}

function copy(from ,to) {
    try {
        fs.copySync(from, to);
        const containingFolder = path.resolve(wd, '..');
        console.log(`copied ${path.relative(containingFolder, from)} to ${path.relative(containingFolder, to)}`);
    } catch (error) {
        console.error(error);
    }
}

const BUILD_SOURCE = ['src', 'lib', 'HEADER.js'];

function exportBuildToWebsite(options = {}) {
    _.defaultsDeep(options, { gestures: true });
    if (options.gestures) {
        build({ exclude: ['accessors'] });
        copy(path.resolve(wd, './dist/fabric.js'), path.resolve(websiteDir, './lib/fabric_with_gestures.js'));
    }
    build();
    copy(path.resolve(wd, './dist/fabric.js'), path.resolve(websiteDir, './lib/fabric.js'));
    copy(path.resolve(wd, './package.json'), path.resolve(websiteDir, './lib/package.json'));
    BUILD_SOURCE.forEach(p => copy(path.resolve(wd, p), path.resolve(websiteDir, './build/files', p)));
    console.log(chalk.bold(`[${moment().format('HH:MM')}] exported build to fabricjs.com`));
}

function exportTestsToWebsite() {
    const paths = [
        './test/unit',
        './test/visual',
        './test/fixtures',
        './test/lib',
    ]
    paths.forEach(location => copy(path.resolve(wd, location), path.resolve(websiteDir, location)));
    console.log(chalk.bold(`[${moment().format('HH:MM')}] exported tests to fabricjs.com`));
}

function exportToWebsite(options) {
    if (!options.include  || options.include.length === 0) {
        options.include  = ['build', 'tests'];
    }
    options.include .forEach(x => {
        if (x === 'build') {
            exportBuildToWebsite();
            options.watch && BUILD_SOURCE.forEach(p => {
                watch(path.resolve(wd, p), exportBuildToWebsite);
            });
        }
        else if (x === 'tests') {
            exportTestsToWebsite();
            options.watch && watch(path.resolve(wd, './test'), exportTestsToWebsite);
        }
    })
}

/**
 *
 * @param {string[]} tests file paths
 * @param {{debug?:boolean,recreate?:boolean,verbose?:boolean,filter?:boolean}} [options]
 */
function test(tests, options) {
    options = options || {};
    const args = ['qunit', 'test/node_test_setup.js', 'test/lib'].concat(tests);
    process.env.QUNIT_DEBUG_VISUAL_TESTS = options.debug;
    process.env.QUNIT_RECREATE_VISUAL_REFS = options.recreate;
    if (options.filter) {
        process.env.QUNIT_FILTER = options.filter;
    }
    return new Promise((resolve, reject) => {
        try {
            var p = cp.spawn(args.join(' '), { cwd: wd, env: process.env, shell: true, stdio: 'pipe' });
            let clearLines = 0;
            process.stdout.write(ansiEscapes.cursorHide);
            p.stdout.on('data', function (data) {
                data = _.compact(data.toString().trim().split(/\n/));
                data.forEach(line => {
                    if (clearLines > 0 && !options.verbose) {
                        process.stdout.write(ansiEscapes.cursorUp(1));
                        process.stdout.write(ansiEscapes.eraseDown);
                    }
                    if (line.startsWith('ok')) {
                        clearLines = 1;
                        console.log(chalk.green(line));
                    }
                    else if (line.startsWith('not ok')) {
                        clearLines = 0;
                        console.log(chalk.bold(chalk.red('not ok') + line.slice(6)));
                    }
                    else {
                        clearLines = 0;
                        console.log(line);
                    }
                });
            });
            p.stdout.once('end', () => {
                process.stdout.write(ansiEscapes.cursorDown());
                process.stdout.write(ansiEscapes.cursorShow);
                resolve();
            });
        } catch (error) {
            process.stdout.write(ansiEscapes.cursorDown());
            process.stdout.write(ansiEscapes.cursorShow);
            reject(error);
        }
    });
}

/**
 *
 * @param {'unit'|'visual'} type correspondes to the test directories
 * @returns
 */
function listTestFiles(type) {
    return fs.readdirSync(path.resolve(wd, './test', type)).filter(p => {
        const ext = path.parse(p).ext.slice(1);
        return ext === 'js' || ext === 'ts';
    });
}

function writeCLIFile(tests) {
    fs.writeFileSync(CLI_CACHE, JSON.stringify(tests, null, '\t'));
}

function readCLIFile() {
    return fs.existsSync(CLI_CACHE) ? require(CLI_CACHE) : [];
}

function createChoiceData(type, file) {
    return {
        name: `${type}/${file}`,
        short: `${type}/${file}`,
        value: {
            type,
            file
        }
    }
}

async function selectFileToTransform() {
    const files = _.map(listFiles(), ({ dir, file }) => createChoiceData(path.relative(path.resolve(wd,'src'), dir).replaceAll('\\','/'), file));
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
                return new Promise(resolve => {
                    const value = _.map(this.getCurrentValue(), value => createChoiceData(value.type, value.file));
                    const res = fuzzy.filter(input, files, {
                        extract: (item) => item.name
                    }).map((element) => element.original);
                    resolve(value.concat(_.differenceBy(res, value, 'name')));
                });
            }
        }
    ]);
    return filteredTests.map(({ type, file }) => path.resolve(wd, 'src', type, file));
}

async function selectTestFile() {
    const selected = readCLIFile();
    const unitTests = listTestFiles('unit').map(file => createChoiceData('unit', file));
    const visualTests = listTestFiles('visual').map(file => createChoiceData('visual', file));
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
                return new Promise(resolve => {
                    const tests = _.concat(unitTests, visualTests);
                    const value = _.map(this.getCurrentValue(), value => createChoiceData(value.type, value.file));
                    if (value.length > 0) {
                        if (value.find(v => v.value && v.value.type === 'unit' && !v.value.file)) {
                            _.pullAll(tests, unitTests);
                        }
                        if (value.find(v => v.value && v.value.type === 'visual' && !v.value.file)) {
                            _.pullAll(tests, visualTests);
                        }
                    }
                    const unitChoice = createChoiceData('unit', '');
                    const visualChoice = createChoiceData('visual', '');
                    !value.find(v => _.isEqual(v, unitChoice)) && value.push(unitChoice);
                    !value.find(v => _.isEqual(v, visualChoice)) && value.push(visualChoice);
                    if (value.length > 0) {
                        value.unshift(new inquirer.Separator());
                        value.push(new inquirer.Separator());
                    }
                    const res = fuzzy.filter(input, tests, {
                        extract: (item) => item.name
                    }).map((element) => element.original);
                    resolve(value.concat(_.differenceBy(res, value, 'name')));
                });
            }
        }
    ]);
    writeCLIFile(filteredTests);
    return filteredTests;
}

async function runIntreactiveTestSuite(options) {
    //  some tests fail because of some pollution when run from the same context
    // test(_.map(await selectTestFile(), curr => `test/${curr.type}/${curr.file}`))
    const tests = _.reduce(await selectTestFile(), (acc, curr) => {
        acc[curr.type].push(`test/${curr.type}/${curr.file}`);
        return acc;
    }, { unit: [], visual: [] });
    _.reduce(tests, async (queue, files, suite) => {
        await queue;
        if (files.length > 0) {
            console.log(chalk.bold(chalk.blue(`running ${suite} test suite`)));
            return test(files, options);
        }
    }, Promise.resolve());
}

program
    .name('fabric.js')
    .description('fabric.js DEV CLI tools')
    .showSuggestionAfterError();

program
    .command('start')
    .description('start fabricjs.com dev server and watch for changes')
    .action((options) => {
        exportToWebsite({
            watch: true
        });
        startWebsite();
    });

program
    .command('build')
    .description('build dist')
    .option('-f, --fast')
    .option('-w, --watch')
    .option('-x, --exclude [exclude...]')
    .option('-m, --modules [modules...]')
    .action((options) => {
        const { watch: w, ...rest } = options || {};
        build(rest);
        w && watch(path.resolve(wd, 'src'), () => build(rest));
    });

program
    .command('test')
    .description('run test suite')
    .addOption(new commander.Option('-s, --suite [suite...]', 'test suite to run').choices(['unit', 'visual']))
    .option('-f, --file [file]', 'run a specific test file')
    .option('--filter [filter]', 'filter tests by name')
    .option('-a, --all', 'run all tests', false)
    .option('-d, --debug', 'debug visual tests by overriding refs (golden images) in case of visual changes', false)
    .option('-r, --recreate', 'recreate visual refs (golden images)', false)
    .option('-v, --verbose', 'log passing tests', false)
    .option('-cc, --clear-cache', 'clear CLI test cache', false)
    .action((options) => {
        if (options.clearCache) {
            fs.removeSync(CLI_CACHE);
        }
        if (options.all) {
            options.suite = ['unit', 'visual'];
        }
        if (options.suite) {
            _.reduce(options.suite, async (queue, suite) => {
                await queue;
                console.log(chalk.bold(chalk.blue(`running ${suite} test suite`)));
                return test(`test/${suite}`, options);
            }, Promise.resolve());
        }
        else if (options.file) {
            test(`test/${options.file}`, options);
        }
        else {
            runIntreactiveTestSuite(options);
        }
    });

const website = program
    .command('website')
    .description('fabricjs.com commands');

website
    .command('start')
    .description('start fabricjs.com dev server')
    .allowExcessArguments()
    .allowUnknownOption()
    .action(startWebsite);

website
    .command('export')
    .description('export files to fabricjs.com directory')
    .addOption(new commander.Option('-i, --include [what...]').choices(['build', 'tests']).default(['build', 'tests'], 'export all'))
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
    .option('-d, --diff [branch]', 'compare against given branch (default: master) and transform all files with diff')
    .action(async ({ overwrite, exports, index, typescript, verbose, all, diff: gitRef } = {}) => {
        let files = [];
        if (gitRef) {
            gitRef = gitRef === true ? 'master' : gitRef;
            const { changes } = getGitInfo(gitRef);
            files = changes.map(change => path.resolve(wd, change));
        }
        else if (!all) {
            files = await selectFileToTransform();
        }
        transformFiles({
            overwriteExisitingFiles: overwrite,
            useExports: exports,
            createIndex: index,
            ext: typescript ? 'ts' : 'js',
            verbose,
            files
        });
    });

program.parse(process.argv);