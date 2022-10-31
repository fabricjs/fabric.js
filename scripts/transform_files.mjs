#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wd = path.resolve(__dirname, '..');

function readFile(file) {
  return fs.readFileSync(path.resolve(wd, file)).toString('utf-8');
}

function getVariableNameOfNS(raw, namespace) {
  const regex = new RegExp(
    `\\s*(.+)=\\s*${namespace.replaceAll('.', '\\.')}[^(]+`,
    'm'
  );
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
    } else if (raw[index] === charEnd) {
      counter--;
      if (counter === 0) {
        break;
      }
    }
    index++;
  }
  return start > -1
    ? {
        start,
        end: index,
        raw: raw.slice(start, index + charEnd.length),
      }
    : null;
}

function printASTNode(raw, node, removeTrailingComma = true) {
  if (node.type === 'Literal') return node.value;
  const out = raw.slice(node.start, node.end + 1).trim();
  return removeTrailingComma && out.endsWith(',')
    ? out.slice(0, out.length - 1)
    : out;
}

/**
 *
 * @param {string} raw
 * @param {walk.FindPredicate} find
 * @returns
 */
function parseClassBase(raw, find) {
  const ast = acorn.parse(raw, { ecmaVersion: 2022, sourceType: 'module' });
  // fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));

  const { node: found } = walk.findNodeAt(ast, undefined, undefined, find);
  // console.log(JSON.stringify(found, null, 2));
  const { node: variableNode } = walk.findNodeAt(
    ast,
    undefined,
    undefined,
    (nodeType, node) => {
      return (
        (nodeType === 'VariableDeclaration' ||
          nodeType === 'ExpressionStatement') &&
        node.start < found.start &&
        node.end > found.end &&
        !!walk.findNodeAt(
          node,
          undefined,
          undefined,
          (nodeType, node) => node === found
        )
      );
    }
  );
  const variableName = printASTNode(
    raw,
    variableNode.type === 'ExpressionStatement'
      ? variableNode.expression.left
      : variableNode.declarations[0].id
  );

  const declaration = found.arguments.pop();
  const superClasses = found.arguments.map((node) => printASTNode(raw, node));
  const [methods, properties] = _.partition(
    declaration.properties,
    (node) =>
      node.type === 'Property' && node.value.type === 'FunctionExpression'
  );
  const name = variableName.slice(variableName.lastIndexOf('.') + 1);
  const defaultValues = _.fromPairs(
    properties.map((node) => {
      return [node.key.name, printASTNode(raw, node.value)];
    })
  );

  return {
    ast,
    name,
    namespace: variableName,
    superClasses,
    superClass:
      superClasses.length > 0
        ? superClasses[superClasses.length - 1]
        : undefined,
    requiresSuperClassResolution: superClasses.length > 0,
    match: {
      index: variableNode.start,
    },
    start: declaration.start,
    end: declaration.end,
    declaration,
    methods,
    properties,
    defaultValues,
    raw: raw.slice(declaration.start, declaration.end + 1),
  };
}

function findClass(raw) {
  return parseClassBase(raw, (nodeType, node) => {
    return (
      nodeType === 'CallExpression' &&
      printASTNode(raw, node.callee).replaceAll('(', '').endsWith('createClass')
    );
  });
}

function findMixin(raw) {
  const keyWord = getVariableNameOfNS(raw, 'fabric.util.object.extend');
  const regex = new RegExp(
    `${keyWord.replaceAll('.', '\\.')}\\((.+)\\.prototype,\.*\\{`,
    'gm'
  );
  return parseClassBase(raw, regex);
}

function transformSuperCall(raw) {
  const regex = /this.callSuper\((.+)\)/g;
  const result = regex.exec(raw);
  if (!result) {
    if (raw.indexOf('callSuper') > -1)
      throw new Error(`failed to replace 'callSuper'`);
    return raw;
  }
  const [rawMethodName, ...args] = result[1].split(',');
  const methodName = rawMethodName.replace(/'|"/g, '');
  const firstArgIndex = result[1].indexOf(args[0]);
  const rest =
    firstArgIndex > -1
      ? result[1].slice(firstArgIndex, result[1].length).trim()
      : '';
  const transformedCall = `super${
    methodName === 'initialize' ? '' : `.${methodName}`
  }(${rest})`;
  return (
    raw.slice(0, result.index) +
    transformedCall +
    raw.slice(result.index + result[0].length)
  );
}

function generateClass(rawClass, className, superClass, useExports) {
  return `${useExports ? 'export ' : ''}class ${className}${
    superClass ? ` extends ${superClass}` : ''
  } ${rawClass}`;
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
  const name = path
    .parse(file)
    .name.replace('mixin', '')
    .split('.')
    .map((val) => _.upperFirst(_.camelCase(val)))
    .join('');
  return name.replace('Itext', 'IText') + 'Mixin';
}

function transformFile(raw, { namespace } = {}) {
  if (raw.replace(/\/\*.*\*\\s*/).startsWith('(function')) {
    const wrapper = findObject(raw, '{', '}');
    raw = wrapper.raw.slice(1, wrapper.raw.length - 1);
  }

  const annoyingCheck = new RegExp(
    `if\\s*\\(\\s*(global.)?${namespace.replace(/\./g, '\\.')}\\s*\\)\\s*{`
  );
  const result = annoyingCheck.exec(raw);
  if (result) {
    const found = findObject(raw, '{', '}', result.index);
    raw = raw.slice(0, result.index) + raw.slice(found.end + 1);
  }
  raw.indexOf('//@ts-nocheck') === -1 && (raw = `//@ts-nocheck\n${raw}`);
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
    raw: rawBody,
    start,
    end,
    requiresSuperClassResolution,
    superClasses,
    methods,
    properties,
    defaultValues,
    declaration,
  } = type === 'mixin' ? findMixin(raw) : findClass(raw);
  let body = rawBody;
  let offset = start;
  const staticCandidates = [];

  function replaceNode(node, value) {
    // const diff = node.end - node.start - value.length;
    // body =
    //   body.slice(0, node.start - offset) +
    //   value +
    //   body.slice(node.end + 1 - offset);
    // offset -= diff;
    body = body.replace(printASTNode(raw, node, false), value);
  }

  // safety
  const duplicateMethods = _.differenceWith(
    methods,
    _.uniqBy(methods, 'key.name'),
    (a, b) => a !== b
  );
  if (duplicateMethods.length > 0) {
    throw new Error(`${name}: duplicate methods found: ${duplicateMethods}`);
  }
  const duplicateProps = _.differenceWith(
    properties,
    _.uniqBy(properties, 'key.name'),
    (a, b) => a !== b
  );
  if (duplicateProps.length > 0) {
    throw new Error(`${name}: duplicate properties found: ${duplicateProps}`);
  }

  methods.forEach((node) => {
    const key = node.key.name;
    const value = printASTNode(raw, node.value)
      .replace(/^function/, '')
      .trim();
    replaceNode(node, `${key === 'initialize' ? 'constructor' : key}${value}`);
    value.indexOf('this') === -1 && staticCandidates.push(key);
  });

  properties.forEach((node) => {
    const key = node.key.name;
    const typeable =
      node.value.type === 'Literal' &&
      ['boolean', 'number', 'string'].includes(typeof node.value.value);
    console.log(printASTNode(raw, node));
    replaceNode(node, typeable ? `${key}: ${typeof node.value.value}` : key);
  });

  let transformed = body;
  do {
    body = transformed;
    try {
      transformed = transformSuperCall(body);
    } catch (error) {
      // console.error(error);
    }
  } while (transformed !== body);

  const classDirective =
    type === 'mixin'
      ? generateMixin(
          body,
          `${_.upperFirst(name)}${className.replace(
            new RegExp(
              name.toLowerCase() === 'staticcanvas' ? 'canvas' : name,
              'i'
            ),
            ''
          )}` || name,
          namespace,
          useExports
        )
      : generateClass(body, className || name, superClass, useExports);

  let rawFile = `${raw.slice(0, match.index)}${classDirective}${raw
    .slice(end + 1)
    .replace(/\s*\)\s*;?/, '')}`;

  //  in case of multiple declaration in one file
  try {
    return transformClass('class', rawFile, options);
  } catch (error) {}
  try {
    return transformClass('mixin', rawFile, options);
  } catch (error) {}

  if (_.size(defaultValues) > 0) {
    rawFile +=
      '\n' +
      `Object.assign(${className || name}.prototype, {${_.map(
        defaultValues,
        (value, key) => [key, value].join(':')
      ).join(',\n')}})`;
  }
  if (type === 'class' && !useExports) {
    rawFile += `\n/** @todo TODO_JS_MIGRATION remove next line after refactoring build */\n${namespace} = ${name};\n`;
  }
  rawFile = transformFile(rawFile, { namespace, name });
  return {
    name,
    raw: rawFile,
    staticCandidates,
    requiresSuperClassResolution,
    superClasses,
  };
}

function convertFile(type, source, dest, options) {
  try {
    const {
      name,
      raw,
      staticCandidates,
      requiresSuperClassResolution,
      superClasses,
    } = transformClass(type, readFile(source), {
      className: type === 'mixin' && getMixinName(path.parse(source).name),
      ...options,
    });
    dest = (typeof dest === 'function' ? dest(name) : dest) || source;
    fs.writeFileSync(dest, raw);
    options.verbose &&
      console.log({
        state: 'success',
        type,
        source: path.relative(wd, source),
        destination: path.relative(wd, dest),
        class: name,
        requiresSuperClassResolution: requiresSuperClassResolution
          ? superClasses
          : false,
        staticCandidates:
          staticCandidates.length > 0 ? staticCandidates : 'none',
      });
    return dest;
  } catch (error) {
    const file = path.relative(wd, source);
    options.verbose &&
      console.log({
        state: 'failure',
        type,
        source: path.relative(wd, source),
        error: error.message,
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
  fs.writeFileSync(
    file,
    _.compact(files)
      .map((file) => {
        const name = path.parse(file).name;
        return `export * from './${name}';\n`;
      })
      .join('')
  );
  console.log(chalk.bold(`created ${path.relative(wd, file)}`));
}

function resolveDest(dir, file, { type, overwriteExisitingFiles, ext }) {
  return overwriteExisitingFiles
    ? ext === 'ts'
      ? path.resolve(dir, file.replace('.js', '.ts'))
      : false
    : type === 'mixin'
    ? path.resolve(mixinsDir, `${getMixinName(file)}.${ext}`)
    : (name) => path.resolve(dir, `${name}.${ext}`);
}

export function listFiles() {
  const paths = [];
  classDirs.forEach((klsDir) => {
    const dir = path.resolve(srcDir, klsDir);
    fs.readdirSync(dir).map((file) => {
      paths.push({
        dir,
        file,
        type: 'class',
      });
    });
  });

  fs.readdirSync(mixinsDir).map((file) => {
    paths.push({
      dir: mixinsDir,
      file,
      type: 'mixin',
    });
  });

  const additionalFiles = fs
    .readdirSync(srcDir)
    .filter((file) => !fs.lstatSync(path.resolve(srcDir, file)).isDirectory());
  additionalFiles.map((file) => {
    paths.push({
      dir: srcDir,
      file,
      type: 'class',
    });
  });

  return paths;
}

export function transform(options = {}) {
  options = _.defaults(options, {
    overwriteExisitingFiles: true,
    ext: 'js',
    createIndex: true,
    useExports: true,
  });

  const result = listFiles()
    .filter(({ dir, file }) => {
      return !options.files || options.files.length === 0
        ? true
        : options.files.includes(path.resolve(dir, file));
    })
    .map(({ dir, file, type }) => {
      return Object.assign(
        convertFile(
          type,
          path.resolve(dir, file),
          resolveDest(dir, file, { type, ...options }),
          options
        ),
        { dir, file, type }
      );
    });

  const [errors, files] = _.partition(result, (file) => file instanceof Error);
  const dirs = files.reduce((dirs, { dir, file }) => {
    (dirs[dir] || (dirs[dir] = [])).push(file);
    return dirs;
  }, {});
  options.createIndex &&
    _.map(dirs, (files, dir) => generateIndexFile(dir, files, options.ext));
  options.overwriteExisitingFiles &&
    options.ext === 'ts' &&
    files.forEach(({ dir, file }) =>
      fs.removeSync(path.resolve(dir, file.replace('.ts', '.js')))
    );

  if (!options.verbose) {
    console.error(`failed files:`);
    errors.map(console.error);
  }
}
