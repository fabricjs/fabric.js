#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as cp from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wd = path.resolve(__dirname, '..');

function readFile(file) {
  return fs.readFileSync(path.resolve(wd, file)).toString('utf-8');
}

function printASTNode(raw, node, removeTrailingComma = true) {
  if (node.type === 'Literal')
    return typeof node.value === 'string' ? `'${node.value}'` : `${node.value}`;
  if (Array.isArray(node) && node.length === 0) return '';
  const out = (
    Array.isArray(node)
      ? raw.slice(node[0].start, node[node.length - 1].end + 1)
      : raw.slice(node.start, node.end + 1)
  ).trim();
  return removeTrailingComma && out.endsWith(',')
    ? out.slice(0, out.length - 1)
    : out;
}

/**
 *
 * @param {string} raw
 * @param {(tree: acorn.Node) => {found:acorn.Node, parent:acorn.Node,variableName:string}} find
 * @returns
 */
function parseClassBase(raw, find) {
  const comments = [];
  const ast = acorn.parse(raw, {
    ecmaVersion: 2022,
    sourceType: 'module',
    locations: true,
    onComment(block, value, start, end, locStart, locEnd) {
      comments.push({
        block,
        value,
        start,
        end,
        loc: {
          start: locStart,
          end: locEnd,
        },
      });
    },
  });
  fs.writeFileSync('./ast.json', JSON.stringify(ast, null, 2));

  function printNode(node, removeTrailingComma) {
    return printASTNode(raw, node, removeTrailingComma);
  }

  function findNodeComment(node) {
    return comments.find(
      (comment) => comment.loc.end.line === node.loc.start.line - 1
    );
  }

  const { found, parent, variableName } = find(ast);

  const declaration = found.arguments.pop();
  const superClasses = found.arguments.map((node) => printNode(node, true));
  const [methods, properties] = _.partition(
    declaration.properties.map((node) => ({
      node,
      comment: findNodeComment(node),
    })),
    ({ node }) =>
      node.type === 'Property' && node.value.type === 'FunctionExpression'
  );
  const name = variableName.slice(variableName.lastIndexOf('.') + 1);
  const defaultValues = _.fromPairs(
    properties.map(({ node }) => {
      return [node.key.name, printNode(node.value)];
    })
  );

  const statics = [];
  walk.simple(ast, {
    ExpressionStatement(node) {
      const {
        expression: { left, right },
      } = node;
      if (
        left?.type === 'MemberExpression' &&
        printNode(left.object).slice(0, -1) === variableName
      ) {
        statics.push({
          type: right.type === 'FunctionExpression' ? 'method' : 'property',
          key: printNode(left.property),
          value: right,
          node,
          comment: findNodeComment(left),
        });
      }
    },
  });

  const [staticMethods, staticProperties] = _.partition(
    statics,
    ({ type }) => type === 'method'
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
    start: declaration.start,
    end: declaration.end,
    variableNode: parent,
    declaration,
    methods,
    properties,
    defaultValues,
    staticMethods,
    staticProperties,
    comments,
    body: raw.slice(declaration.start, declaration.end + 1),
    printNode,
  };
}

function parseClass(raw) {
  return parseClassBase(raw, (ast) => {
    const { node: found } = walk.findNodeAt(
      ast,
      undefined,
      undefined,
      (nodeType, node) => {
        return (
          nodeType === 'CallExpression' &&
          printASTNode(raw, node.callee).endsWith('createClass(')
        );
      }
    );
    const { node: parent } = walk.findNodeAt(
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

    const variableNode =
      parent.type === 'ExpressionStatement'
        ? parent.expression.left
        : parent.declarations[0].id;

    return {
      found,
      parent,
      variableName: printASTNode(raw, variableNode),
    };
  });
}

function parseMixin(raw) {
  return parseClassBase(raw, (ast) => {
    const { node: found } = walk.findNodeAt(
      ast,
      undefined,
      undefined,
      (nodeType, node) => {
        return (
          nodeType === 'CallExpression' &&
          printASTNode(raw, node.callee).endsWith('extend(')
        );
      }
    );
    return {
      found,
      parent: found,
      variableName: printASTNode(raw, found.arguments[0]).replace(
        '.prototype',
        ''
      ),
    };
  });
}

function generateClass(rawClass, className, superClass, useExports) {
  return `${useExports ? 'export ' : ''}class ${className}${
    superClass ? ` extends ${superClass}` : ''
  } {\n${rawClass}\n}`;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#mix-ins
 */
function generateMixin(rawClass, mixinName, baseClassNS, useExports) {
  const funcName = `${mixinName}Generator`;
  return `
${useExports ? 'export ' : ''}function ${funcName}(Klass) {
  return class ${mixinName || ''} extends Klass {\n${rawClass}\n}\n
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
    ast,
    name,
    namespace,
    superClass,
    end,
    requiresSuperClassResolution,
    superClasses,
    methods,
    properties,
    defaultValues,
    staticMethods,
    staticProperties,
    declaration,
    variableNode,
    printNode,
  } = type === 'mixin' ? parseMixin(raw) : parseClass(raw);

  // safety
  const duplicateMethods = _.differenceWith(
    methods,
    _.uniqBy(methods, 'node.key.name'),
    (a, b) => a !== b
  );
  if (duplicateMethods.length > 0) {
    throw new Error(
      `${name}: duplicate methods found: ${_.map(
        duplicateProps,
        'node.key.name'
      )}`
    );
  }
  const duplicateProps = _.differenceWith(
    properties,
    _.uniqBy(properties, 'node.key.name'),
    (a, b) => a === b
  );

  if (duplicateProps.length > 0) {
    throw new Error(
      `${name}: duplicate properties found: ${_.map(
        duplicateProps,
        'node.key.name'
      )}`
    );
  }

  const classBody = [];

  properties.forEach(({ node, comment }) => {
    const key = node.key.name;
    const typeable =
      node.value.type === 'Literal' &&
      ['boolean', 'number', 'string'].includes(typeof node.value.value);
    const typed = typeable ? `${key}: ${typeof node.value.value}` : key;
    classBody.push((comment ? printNode(comment) : '') + '\n' + typed);
    // replaceNode(node, typeable ? `${key}: ${typeof node.value.value}` : key);
  });

  const staticCandidates = [];

  methods.forEach(({ node, comment }) => {
    const key = node.key.name;
    const value = printNode(node.value.body.body);
    const methodAST = acorn.parse(value, {
      ecmaVersion: 2022,
      allowReturnOutsideFunction: true,
    });
    const superTransforms = [];
    walk.simple(methodAST, {
      CallExpression(node) {
        if (
          node.callee.object?.type === 'ThisExpression' &&
          node.callee.property?.name === 'callSuper'
        ) {
          const [methodNameArg, ...args] = node.arguments;
          const lastArg = args[args.length - 1];
          const removeParen =
            lastArg?.type === 'Identifier' || lastArg?.type === 'Literal';
          const out = `${
            methodNameArg.value === 'initialize'
              ? 'super'
              : `super.${methodNameArg.value}`
          }(${printASTNode(value, args)})`;
          superTransforms.push({
            node,
            methodName: methodNameArg.value,
            value:
              removeParen && out[out.length - 1] === ')'
                ? out.slice(0, -1)
                : out,
          });
        }
      },
    });

    value.indexOf('this') === -1 && staticCandidates.push(key);
    classBody.push(
      (comment ? printNode(comment) : '') +
        '\n' +
        (node.value.async ? 'async ' : '') +
        (key === 'initialize' ? 'constructor' : key) +
        `(${printNode(node.value.params).slice(0, -1)}) {\n` +
        superTransforms.reduceRight((value, { node, value: out }) => {
          return value.slice(0, node.start) + out + value.slice(node.end + 1);
        }, value) +
        '\n}'
    );
  });

  staticProperties.forEach(({ key, value, comment }) => {
    const out =
      (comment ? printNode(comment) : '') +
      '\r\n' +
      'static ' +
      key +
      '=' +
      printNode(value);
    classBody.push(out);
  });

  staticMethods.forEach(({ key, value, comment }) => {
    classBody.push(
      (comment ? printNode(comment) : '') +
        '\n' +
        'static ' +
        (value.async ? 'async ' : '') +
        key +
        `(${printNode(value.params).slice(0, -1)}) {\n` +
        printNode(value.body.body) +
        '\n}'
    );
  });

  const body = classBody.join('\r\n\r\n');

  const finalName =
    type === 'mixin'
      ? `${_.upperFirst(name)}${className.replace(
          new RegExp(
            name.toLowerCase() === 'staticcanvas' ? 'canvas' : name,
            'i'
          ),
          ''
        )}` || name
      : className || name;

  let classDirective =
    type === 'mixin'
      ? generateMixin(body, finalName, namespace, useExports)
      : generateClass(body, finalName, superClass, useExports);

  if (_.size(defaultValues) > 0) {
    const defaultsKey = `${_.lowerFirst(finalName)}DefaultValues`;
    classDirective +=
      '\n\n' +
      `export const ${defaultsKey}: Partial<TClassProperties<${finalName}>> = {\n${_.map(
        defaultValues,
        (value, key) => [key, value].join(':')
      ).join(',\n')}\n};` +
      '\n\n' +
      `Object.assign(${finalName}.prototype, ${defaultsKey})`;
  }

  if (type === 'class' && !useExports) {
    classDirective += `\n/** @todo TODO_JS_MIGRATION remove next line after refactoring build */\n${namespace} = ${name};\n`;
  }

  let rawFile;

  const lastNode = ast.body[ast.body.length - 1];
  if (
    lastNode.type === 'ExpressionStatement' &&
    lastNode.expression.callee.params[0].name === 'global'
  ) {
    const bodyNodes = lastNode.expression.callee.body.body;
    rawFile =
      raw.slice(0, lastNode.start) +
      printNode(bodyNodes).replace(
        printNode(variableNode, false),
        classDirective
      ) +
      raw.slice(lastNode.end + 1);
  } else {
    rawFile = `${raw.slice(0, variableNode.start)}${classDirective}${raw
      .slice(end + 1)
      .replace(/\s*\)\s*;?/, '')}`;
  }

  [...staticMethods, ...staticProperties].forEach(({ node, comment }) => {
    if (comment) {
      rawFile = rawFile.replace(
        printNode({
          start: comment.start,
          end: node.end,
        }),
        ''
      );
    }
  });

  rawFile = rawFile
    .replace(new RegExp(namespace.replace(/\./g, '\\.'), 'g'), name)
    .replace(/fabric\.Object/g, 'FabricObject')
    .replace(/fabric\.util\./g, '');

  rawFile.indexOf('//@ts-nocheck') === -1 &&
    (rawFile = `//@ts-nocheck\n${rawFile}`);

  //  in case of multiple declaration in one file
  try {
    return transformClass('class', rawFile, options);
  } catch (error) {}
  try {
    return transformClass('mixin', rawFile, options);
  } catch (error) {}

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
    cp.execSync(`prettier --write ${source}`);
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

  if (!options.verbose && errors.length > 0) {
    console.error(`failed files:`);
    errors.map(console.error);
  }
}
