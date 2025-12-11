import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import path from 'path';
import { redBright } from './scripts/colors.mjs';
// import dts from "rollup-plugin-dts";

const splitter = /\n|\s|,/g;

const buildOutput = process.env.BUILD_OUTPUT || './dist/index.js';

const dirname = path.dirname(buildOutput);
const basename = path.basename(buildOutput, '.js');
const plugins = [
  json(),
  ts({
    noForceEmit: true,
    tsconfig: './tsconfig.json',
    exclude: [
      'dist',
      'dist-extensions',
      '**/**.spec.ts',
      '**/**.test.ts',
      '**/**.fixtures.ts',
    ],
  }),
  babel({
    extensions: ['.ts', '.js'],
    babelHelpers: 'bundled',
  }),
];

const pluginsExtensions = [
  json(),
  ts({
    noForceEmit: true,
    tsconfig: './tsconfig-extensions.json',
    exclude: ['dist', 'dist-extensions', '**/**.spec.ts', '**/**.test.ts'],
  }),
  babel({
    extensions: ['.ts', '.js'],
    babelHelpers: 'bundled',
  }),
];

/**
 * disallow circular deps
 * @see https://rollupjs.org/configuration-options/#onwarn
 * @param {*} warning
 * @param {*} warn
 */
function onwarn(warning, warn) {
  // we error at any warning.
  // we allow-list the errors we understand are not harmful
  if (
    (warning.code === 'PLUGIN_WARNING' &&
      !warning.message.includes('sourcemap')) ||
    warning.code === 'CIRCULAR_DEPENDENCY'
  ) {
    console.error(redBright(warning));
    if (process.env.CI) {
      throw Object.assign(new Error(), warning);
    }
  }
  warn(warning);
}

// https://rollupjs.org/guide/en/#configuration-files
export default [
  {
    input: ['./fabric.ts'],
    output: [
      // es modules in files
      {
        dir: path.resolve(dirname),
        format: 'es',
        preserveModules: true,
        entryFileNames: '[name].mjs',
        sourcemap: true,
      },
      Number(process.env.MINIFY)
        ? {
            dir: path.resolve(dirname),
            format: 'es',
            preserveModules: true,
            entryFileNames: '[name].min.mjs',
            sourcemap: true,
            plugins: [terser()],
          }
        : null,
    ],
    plugins,
    onwarn,
  },
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    output: [
      // es module in bundle
      {
        file: path.resolve(dirname, `${basename}.mjs`),
        name: 'fabric',
        format: 'es',
        sourcemap: true,
      },
      Number(process.env.MINIFY)
        ? {
            file: path.resolve(dirname, `${basename}.min.mjs`),
            name: 'fabric',
            format: 'es',
            sourcemap: true,
            plugins: [terser()],
          }
        : null,
      // umd module in bundle, the cdn one for fiddles
      // deprecated, this will be available only minified for cdn.
      {
        file: path.resolve(dirname, `${basename}.js`),
        name: 'fabric',
        format: 'umd',
        sourcemap: true,
      },
      Number(process.env.MINIFY)
        ? {
            file: path.resolve(dirname, `${basename}.min.js`),
            name: 'fabric',
            format: 'umd',
            sourcemap: true,
            plugins: [terser()],
          }
        : null,
    ],
    plugins,
    onwarn,
  },
  {
    input: ['./index.node.ts'],
    output: [
      {
        file: path.resolve(dirname, `${basename}.node.mjs`),
        name: 'fabric',
        format: 'es',
        sourcemap: true,
      },
      // deprecated remove
      {
        file: path.resolve(dirname, `${basename}.node.cjs`),
        name: 'fabric',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins,
    onwarn,
    external: ['jsdom', 'jsdom/lib/jsdom/living/generated/utils.js', 'canvas'],
  },
  // EXTENSIONS

  {
    input: ['./extensions/index.ts'],
    external: ['fabric', 'westures'],
    output: [
      // es modules in files
      {
        dir: path.resolve('./dist-extensions'),
        format: 'es',
        preserveModules: true,
        entryFileNames: '[name].mjs',
        sourcemap: true,
      },
      // umd module, the cdn one for fiddles, minified
      {
        file: path.resolve('./dist-extensions', `fabric-extensions.min.js`),
        name: 'fabricExtensions',
        format: 'umd',
        sourcemap: true,
        globals: {
          fabric: 'fabric',
          westures: 'westures',
        },
        plugins: [terser()],
      },
    ],
    plugins: pluginsExtensions,
    onwarn,
  },
];
