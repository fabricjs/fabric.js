#!/usr/bin/env node
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const cp = require('child_process');

export function build(exclude = ['gestures', 'accessors']) {
    cp.execSync(`node build.js modules=ALL requirejs fast exclude=${exclude.join(',')}`, { stdio: 'inherit' });
}

export function startWebsite() {
    build();
    cp.spawn('npm', ['start'], {
        stdio: 'inherit',
        cwd: path.resolve('../fabricjs.com'),
        shell: true,
    });
}

export function watch(path, callback) {
    fs.watch(path, { recursive: true }, _.debounce((type, location) => {
        try {
            callback(type, location);
        } catch (error) {
            console.error(error);
        }
    }, 500, { trailing: true }));
}

function copy(from ,to) {
    try {
        fs.copySync(from, to);
        console.log(`copied ${from} to ${to}`);
    } catch (error) {
        console.error(error);
    }
}

export function exportBuildToWebsite() {
    build();
    copy(path.resolve('./dist/fabric.js'), path.resolve('../fabricjs.com', './lib/fabric.js'));
    copy(path.resolve('./package.json'), path.resolve('../fabricjs.com', './lib/package.json'));
    copy(path.resolve('./src'), path.resolve('../fabricjs.com', './build/files/src'));
    copy(path.resolve('./lib'), path.resolve('../fabricjs.com', './build/files/lib'));
    copy(path.resolve('./HEADER.js'), path.resolve('../fabricjs.com', './build/files/HEADER.js'));
    console.log('exported build to fabricjs.com');
}

export function exportTestsToWebsite() {
    const paths = [
        './test/unit',
        './test/visual',
        './test/fixtures',
        './test/lib',
    ]
    paths.forEach(location => copy(path.resolve(location), path.resolve('../fabricjs.com', location)));
    console.log('exported tests to fabricjs.com');
}