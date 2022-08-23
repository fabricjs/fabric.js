#!/usr/bin/env node
const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const chalk = require('chalk');

const wd = path.resolve(__dirname, '..');

function readFile(file) {
    return fs.readFileSync(path.resolve(wd, file)).toString('utf-8');
}

function getVariableNameOfNS(raw, namespace) {
    const regex = new RegExp(`\\s*(.+)=\\s*${namespace.replaceAll('.', '\\.')}[^(]+`, 'm');
    const result = regex.exec(raw);
    return result ? result[1].trim() : namespace;
}

function getNSFromVariableName(raw, varname) {
    if (varname === 'fabric') return 'fabric';
    const regex = new RegExp(`\\s*${varname}\\s*=\\s*(.*)\\s*?,\\s*`, 'gm');
    const result = regex.exec(raw);
    return result ? result[1].trim() : null;
}

function findObject(raw, charStart, charEnd, startFrom = 0) {
    const start = raw.indexOf(charStart, startFrom);
    let index = start;
    let counter = 0;
    while (index < raw.length) {
        if (raw[index] === charStart) {
            counter++;
        }
        else if (raw[index] === charEnd) {
            counter--;
            if (counter === 0) {
                break;
            }
        }
        index++;
    }
    return start > -1 ?
        {
            start,
            end: index,
            raw: raw.slice(start, index + charEnd.length)
        } :
        null;
}


function parseRawClass(raw) {
    let index = 0;
    const pairs = [
        { opening: '{', closing: '}', test(key, index, input) { return input[index] === this[key] } },
        { opening: '[', closing: ']', test(key, index, input) { return input[index] === this[key] } },
        { opening: '(', closing: ')', test(key, index, input) { return input[index] === this[key] } },
        {
            blocking: true, opening: '/*',
            closing: '*/',
            test(key, index, input) {
                return key === 'closing' ?
                    input[index - 1] === this[key][0] && input[index] === this[key][1] :
                    input[index] === this[key][0] && input[index + 1] === this[key][1];
            }
        },
    ];
    const stack = [];
    const commas = [];
    const fields = [];
    while (index < raw.length) {
        const top = stack[stack.length - 1];
        //console.log(raw[index],top)
        if (top && top.test('closing', index, raw)) {
            stack.pop();
        }
        else if (!top || !top.blocking) {
            const found = pairs.find(t => t.test('opening', index, raw));
            if (found) {
                stack.push(found);
            }
            else if (pairs.some(t => t.test('closing', index, raw))) {
                stack.pop();
            }
            else if (raw[index] === ',' && stack.length === 1) {
                commas.push(index);
            }
            else if (raw[index] === ':' && stack.length === 1) {
                const trim = raw.slice(0, index).trim();
                const result = /\s*(.+)$/.exec(trim);
                result && fields.push(result[1])
            }
        }

        index++;
    }
    commas.reverse().forEach(pos => {
        raw = raw.slice(0, pos) + raw.slice(pos + 1);
    })
    return { raw, fields };
}

/**
 * 
 * @param {RegExpExecArray | null} regex 
 * @returns 
 */
function findClassBase(raw, regex) {
    const result = regex.exec(raw);
    if (!result) throw new Error('FAILED TO PARSE');
    const [match, classNSRaw, superClassRaw] = result;
    const [first, ...rest] = classNSRaw.trim().split('.');
    const namespace = [getNSFromVariableName(raw, first), ...rest].join('.');
    const name = namespace.slice(namespace.lastIndexOf('.') + 1);
    const superClasses = superClassRaw?.trim().split(',')
        .filter(raw => !raw.match(/\/\*+/) && raw).map(key => key.trim())
        .map(val => {
            const [first, ...rest] = val.split('.');
            return [getNSFromVariableName(raw, first), ...rest].join('.');
        }) || [];
    const rawObject = findObject(raw, '{', '}', result.index);
    const NS = namespace.slice(0, namespace.lastIndexOf('.'));
    const { fabric } = require(wd);
    const klass = fabric.util.resolveNamespace(NS === 'fabric' ? null : NS)[name];
    return {
        name,
        namespace,
        superClasses,
        superClass: superClasses.length > 0 ? superClasses[superClasses.length - 1] : undefined,
        requiresSuperClassResolution: superClasses.length > 0,
        match: {
            index: result.index,
            value: match
        },
        ...rawObject,
        klass
    };
}

function findClass(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.createClass');
    const regex = new RegExp(`(.+)=\\s*${keyWord.replaceAll('.', '\\.')}\\((\.*)\\{`, 'm');
    return findClassBase(raw, regex);
}

function findMixin(raw) {
    const keyWord = getVariableNameOfNS(raw, 'fabric.util.object.extend');
    const regex = new RegExp(`${keyWord.replaceAll('.', '\\.')}\\((.+)\\.prototype,\.*\\{`, 'm');
    return findClassBase(raw, regex);
}

function transformSuperCall(raw) {
    const regex = /this.callSuper\((.+)\)/g;
    const result = regex.exec(raw);
    if (!result) {
        if (raw.indexOf('callSuper') > -1) throw new Error(`failed to replace 'callSuper'`);
        return raw;
    }
    const [rawMethodName, ...args] = result[1].split(',');
    const methodName = rawMethodName.replace(/'|"/g, '');
    const firstArgIndex = result[1].indexOf(args[0]);
    const rest = firstArgIndex > -1 ? result[1].slice(firstArgIndex, result[1].length).trim() : '';
    const transformedCall = `super${methodName === 'initialize' ? '' : `.${methodName}`}(${rest})`;
    return raw.slice(0, result.index) + transformedCall + raw.slice(result.index + result[0].length);
}

function generateClass(rawClass, className, superClass, useExports) {
    return `${useExports ? 'export ' : ''}class ${className}${superClass ? ` extends ${superClass}` : ''} ${rawClass}`;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins
 */
function generateMixin(rawClass, mixinName, baseClassNS, useExports) {
    const funcName = `${mixinName}Generator`;
    return `
${useExports ? 'export ' : ''}function ${funcName}(Klass) {
  return class ${mixinName || ''} extends Klass ${rawClass}
}

${baseClassNS ? `${baseClassNS} = ${funcName}(${baseClassNS});` : ''}
`;
}

function getMixinName(file) {
    const name = path.parse(file).name.replace('mixin', '').split('.').map(val => _.upperFirst(_.camelCase(val))).join('');
    return name.replace('Itext', 'IText') + 'Mixin';
}

function transformFile(raw, { namespace, name } = {}) {
    if (raw.replace(/\/\*.*\*\\s*/).startsWith('(function')) {
        const wrapper = findObject(raw, '{', '}');
        raw = wrapper.raw.slice(1, wrapper.raw.length - 1);
    }

    const annoyingCheck = new RegExp(`if\\s*\\(\\s*(global.)?${namespace.replace(/\./g, '\\.')}\\s*\\)\\s*{`);
    const result = annoyingCheck.exec(raw);
    if (result) {
        const found = findObject(raw, '{', '}', result.index);
        raw = raw.slice(0, result.index) + raw.slice(found.end + 1);
    }
    raw = `//@ts-nocheck\n${raw}`;
    return raw;
}

/**
 * 
 * @param {string} file 
 * @param {'class'|'mixin'} type 
 * @returns 
 */
function transformClass(type, raw, options = {}) {
    const { className, useExports } = options;
    if (!type) throw new Error(`INVALID_ARGUMENT type`);
    const {
        match,
        name,
        namespace,
        superClass,
        raw: _rawClass,
        end,
        requiresSuperClassResolution,
        superClasses
    } = type === 'mixin' ? findMixin(raw) : findClass(raw);
    let { raw: rawClass, fields } = parseRawClass(_rawClass);
    const getPropStart = (key, raw) => {
        const searchPhrase = `^(\\s*)${key}\\s*:\\s*`;
        const regex = new RegExp(searchPhrase, 'm');
        const result = regex.exec(raw);
        const whitespace = result[1];
        return {
            start: result?.index + whitespace.length || -1,
            regex,
            value: `${whitespace}${key} = `
        };
    }
    const staticCandidantes = [];
    fields.forEach((key) => {
        const searchPhrase = `^(\\s*)${key}\\s*:\\s*function\\s*\\(`;
        const regex = new RegExp(searchPhrase, 'm');
        const result = regex.exec(rawClass);
        if (result) {
            const whitespace = result[1];
            const start = result.index + whitespace.length;
            const func = findObject(rawClass, '{', '}', start);
            start && func.raw.indexOf('this') === -1 && staticCandidantes.push(key);
            rawClass = rawClass.replace(regex, `${whitespace}${key === 'initialize' ? 'constructor' : key}(`);
            if (regex.exec(rawClass)) {
                throw new Error(`dupliate method found ${name}#${key}`);
            }
        }
        else {
            const start = getPropStart(key, rawClass);
            rawClass = rawClass.replace(start.regex, start.value);
        }
    });
    let transformed = rawClass;
    do {
        rawClass = transformed;
        try {
            transformed = transformSuperCall(rawClass);
        } catch (error) {
            console.error(error);
        }
    } while (transformed !== rawClass);
    const classDirective = type === 'mixin' ?
        generateMixin(rawClass, `${_.upperFirst(name)}${className.replace(new RegExp(name.toLowerCase() === 'staticcanvas' ? 'canvas' : name, 'i'), '')}` || name, namespace, useExports) :
        generateClass(rawClass, className || name, superClass, useExports);
    raw = `${raw.slice(0, match.index)}${classDirective}${raw.slice(end + 1).replace(/\s*\)\s*;?/, '')}`;
    if (type === 'mixin') {
        //  in case of multiple mixins in one file
        try {
            return transformClass(type, raw, options);
        } catch (error) {

        }
    }
    if (type === 'class' && !useExports) {
        raw = `${raw}\n/** @todo TODO_JS_MIGRATION remove next line after refactoring build */\n${namespace} = ${name};\n`;
    }
    raw = transformFile(raw, { namespace, name });
    return { name, raw, staticCandidantes, requiresSuperClassResolution, superClasses };
}

function convertFile(type, source, dest, options) {
    try {
        const {
            name,
            raw,
            staticCandidantes,
            requiresSuperClassResolution,
            superClasses
        } = transformClass(type, readFile(source), {
            className: type === 'mixin' && getMixinName(path.parse(source).name),
            ...options
        });
        dest = (typeof dest === 'function' ? dest(name) : dest) || source;
        fs.writeFileSync(dest, raw);
        options.verbose && console.log({
            state: 'success',
            type,
            source: path.relative(wd, source),
            destination: path.relative(wd, dest),
            class: name,
            requiresSuperClassResolution: requiresSuperClassResolution ? superClasses : false,
            staticCandidantes: staticCandidantes.length > 0 ? staticCandidantes : 'none'
        });
        return dest;
    } catch (error) {
        const file = path.relative(wd, source);
        options.verbose && console.log({
            state: 'failure',
            type,
            source: path.relative(wd, source),
            error: error.message
        });
        error.file = file;
        return error;
    }
}

const classDirs = ['shapes', 'brushes', 'filters'];
const mixinsDir = path.resolve(wd, './src/mixins');
const srcDir = path.resolve(wd, './src');

function generateIndexFile(dir, files, ext) {
    const file = path.resolve(dir, `index.${ext}`);
    fs.writeFileSync(file, _.compact(files).map(file => {
        const name = path.parse(file).name;
        return `export * from './${name}';\n`;
    }).join(''));
    console.log(chalk.bold(`created ${path.relative(wd, file)}`));
}

function resolveDest(dir, file, { type, overwriteExisitingFiles, ext }) {
    return overwriteExisitingFiles ?
        ext === 'ts' ?
            path.resolve(dir, file.replace('.js', '.ts')) :
            false :
        type === 'mixin' ?
            path.resolve(mixinsDir, `${getMixinName(file)}.${ext}`) :
            name => path.resolve(dir, `${name}.${ext}`);
}

function listFiles() {
    const paths = [];
    classDirs.forEach(klsDir => {
        const dir = path.resolve(srcDir, klsDir);
        fs.readdirSync(dir).map(file => {
            paths.push({
                dir,
                file,
                type: 'class'
            });
        });
    });

    fs.readdirSync(mixinsDir).map(file => {
        paths.push({
            dir: mixinsDir,
            file,
            type: 'mixin'
        });
    });

    const additionalFiles = fs.readdirSync(srcDir).filter(file => !fs.lstatSync(path.resolve(srcDir, file)).isDirectory());
    additionalFiles.map(file => {
        paths.push({
            dir: srcDir,
            file,
            type: 'class'
        });
    });

    return paths;
}

function transform(options = {}) {
    options = _.defaults(options, { overwriteExisitingFiles: true, ext: 'js', createIndex: true, useExports: true });

    const result = listFiles()
        .filter(({ dir, file }) => {
            return !options.files || options.files.length === 0 ?
                true :
                options.files.includes(path.resolve(dir, file));
        }).map(({ dir, file, type }) => {
            return Object.assign(
                convertFile(type, path.resolve(dir, file), resolveDest(dir, file, { type, ...options }), options),
                { dir, file, type }
            );
        });

    const [errors, files] = _.partition(result, file => file instanceof Error);
    const dirs = files.reduce((dirs, { dir, file }) => {
        (dirs[dir] || (dirs[dir] = [])).push(file);
        return dirs;
    }, {});
    options.createIndex && _.map(dirs, (files, dir) => generateIndexFile(dir, files, options.ext));
    options.overwriteExisitingFiles && options.ext === 'ts' &&
        files.forEach(({ dir, file }) => fs.removeSync(path.resolve(dir, file.replace('.ts', '.js'))));

    if (!options.verbose) {
        console.error(`failed files:`);
        errors.map(console.error);
    }
}

module.exports = { transform, listFiles };