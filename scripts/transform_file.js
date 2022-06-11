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

const CLI_CACHE = path.resolve(__dirname, 'cli_cache.json');
const wd = path.resolve(__dirname, '..');


function transformFile(file) {
    const raw = fs.readFileSync(path.resolve(wd, file)).toString('utf-8');
    console.log(findMixinNS(raw), findClass(raw))
}

function getVariableNameOfKey(raw, key) {
    const regex = new RegExp(`(.+)=\\s*${key.replaceAll('.', '\\.')}`, 'm');
    const result = regex.exec(raw);
    return result && result[1].trim();
}

function getVariableNameOfNS(raw, namespace) {
    const regex = new RegExp(`(.+)=\\s*${namespace.replaceAll('.', '\\.')}\\.+$`, 'm');
    const result = regex.exec(raw);
    return result ? result[1].trim() : namespace;
}

function findMixinNS(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.object.extend');
    const regex = new RegExp(`${keyWord.replaceAll('.', '\\.')}\\((.+)\\.prototype,\.*\\{`, 'm');
    const result = regex.exec(raw);
    return result && result[1].trim();
}

function findClass(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.createClass');
    const regex = new RegExp(`(.+)=\\s*${keyWord.replaceAll('.', '\\.')}\\((\.*)\\{`, 'm');
    const result = regex.exec(raw);
    if (!result) return;
    const [match, classNSRaw, superClassRaw] = result;
    console.log(...result)
    const superClasses = superClassRaw.trim().split(',').filter(raw => !raw.match(/\/\*+/));
    const classStart = raw.indexOf('{', result.index);
    let index = classStart;
    let counter = 0;
    while (index < raw.length) {
        if (raw[index] === '{') {
            counter++;
        }
        else if (raw[index] === '}') {
            counter--;
            if (counter === 0) {
                break;
            }
        }
        index++;
    }
    
    return {
        namespace: classNSRaw.trim(),
        superClasses,
        start: classStart,
        end: index,
        raw: raw.slice(classStart, index + 1)
    };
}

transformFile('src/parser.js')
transformFile('src/canvas.class.js')
transformFile('src/mixins/canvas_events.mixin.js')

/**
 * 
 * @param {string} text 
 */
function findStartPoint(text) {
    const findMixin = /fabric\.util\.object\.extend\((.+)\.prototype,.+\{/m;
    const what = 'fabric.util.object.extend';
    const findExtend = new RegExp(`(.+)=\s?${what.replaceAll('.', '\\.')}`, 'm');
    const phrases = ['fabric.util.createClass(', 'fabric.util.object.extend('];
text.indexOf()
}