#!/usr/bin/env node
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const cp = require('child_process');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const chalk = require('chalk');
const Checkbox = require('inquirer-checkbox-plus-prompt');

class ICheckbox extends Checkbox {
    constructor(questions, rl, answers) {
        super(questions, rl, answers);
        this.opt.source = this.opt.source.bind(this);
    }
    getCurrentValue() {
        const current = super.getCurrentValue();
        return current.concat(this.firstSourceLoading ? this.default : []);
    }
}
inquirer.registerPrompt('checkbox-plus', ICheckbox);

function build(exclude = ['gestures', 'accessors']) {
    cp.execSync(`node build.js modules=ALL requirejs fast exclude=${exclude.join(',')}`, { stdio: 'inherit' });
}

function startWebsite() {
    build();
    const expectedPath = path.resolve('../fabricjs.com');
    if (require(path.resolve(expectedPath, 'package.json')).name !== 'fabricjs.com') {
        console.log(chalk.red('Could not locate fabricjs.com directory'));
    }
    cp.spawn('npm', ['start'], {
        stdio: 'inherit',
        cwd: expectedPath,
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
        console.log(`copied ${from} to ${to}`);
    } catch (error) {
        console.error(error);
    }
}

function exportBuildToWebsite() {
    build();
    copy(path.resolve('./dist/fabric.js'), path.resolve('../fabricjs.com', './lib/fabric.js'));
    copy(path.resolve('./package.json'), path.resolve('../fabricjs.com', './lib/package.json'));
    copy(path.resolve('./src'), path.resolve('../fabricjs.com', './build/files/src'));
    copy(path.resolve('./lib'), path.resolve('../fabricjs.com', './build/files/lib'));
    copy(path.resolve('./HEADER.js'), path.resolve('../fabricjs.com', './build/files/HEADER.js'));
    console.log('exported build to fabricjs.com');
}

function exportTestsToWebsite() {
    const paths = [
        './test/unit',
        './test/visual',
        './test/fixtures',
        './test/lib',
    ]
    paths.forEach(location => copy(path.resolve(location), path.resolve('../fabricjs.com', location)));
    console.log('exported tests to fabricjs.com');
}

function test(tests) {
    const args = ['npx', 'qunit', 'test/node_test_setup.js', 'test/lib'].concat(tests);
    /*{ visual, unit }
    if (typeof visual === 'string') {
        args.push(path.resolve('./test/visual', visual));
    }
    else if (visual === true) {
        args.push('./test/visual');
    }
    if (typeof unit === 'string') {
        args.push(path.resolve('./test/unit', unit));
    }
    else if (unit === true) {
        args.push('./test/unit');
    }
    */
    cp.execSync(args.join(' '), { stdio: 'inherit' });
}

/**
 * 
 * @param {'unit'|'visual'} type correspondes to the test directories
 * @returns 
 */
function listTestFiles(type) {
    return fs.readdirSync(path.resolve('./test', type)).filter(p => {
        const ext = path.parse(p).ext.slice(1);
        return ext === 'js' || ext === 'ts';
    });
}

function writeCLIFile(tests) {
    fs.writeFileSync(path.resolve(__dirname, 'cli_history.json'), JSON.stringify(tests, null, '\t'));
}

function readCLIFile() {
    return fs.existsSync(path.resolve(__dirname, 'cli_history.json')) ? require('./cli_history.json') : [];
}

async function selectTestFile() {
    const selected = readCLIFile();
    const unitTests = listTestFiles('unit').map(p => ({ type: 'unit', path: `unit/${p}` }));
    const visualTests = listTestFiles('visual').map(p => ({ type: 'visual', path: `visual/${p}` }));
    const tests = unitTests.concat(visualTests);
    const { tests: filteredTests } = await inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'tests',
            message: 'Select test files',
            highlight: true,
            searchable: true,
            default: selected,
            pageSize: Math.max(10, selected.length),
            source(answersSoFar, input = '') {
                return new Promise(resolve => {
                    const res = fuzzy.filter(input, tests, {
                        extract: (item) => item.path
                    }).map((element) => element.original.path);
                    const value = this.getCurrentValue();
                    value.unshift(new inquirer.Separator());
                    value.push(new inquirer.Separator());
                    resolve(_.uniq(value.concat(res)));
                });
            }
        }
    ]);
    writeCLIFile(filteredTests);
    return filteredTests;
}

async function run() {
    const tests = (await selectTestFile()).map(p => `test/${p}`);
    test(tests);
}

run()