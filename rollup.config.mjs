import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import path from 'path';
import chalk from 'chalk';
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
    exclude: ['dist', '**/**.spec.ts', '**/**.test.ts'],
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
    console.error(chalk.redBright(warning));
    if (process.env.CI) {
      throw Object.assign(new Error(), warning);
    }
  }
  warn(warning);
}

// https://rollupjs.org/guide/en/#configuration-files
export default [
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./fabric.ts'],
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
      // umd in bundle
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
];
