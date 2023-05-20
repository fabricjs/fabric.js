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

/**
 * disallow circular deps
 * @see https://rollupjs.org/configuration-options/#onwarn
 * @param {*} warning
 * @param {*} warn
 */
function onwarn(warning, warn) {
  if (warning.code === 'CIRCULAR_DEPENDENCY') {
    console.error(chalk.redBright(warning.message));
    throw Object.assign(new Error(), warning);
  }
  warn(warning);
}

function createPlugins(outDir = 'dist') {
  return [
    json(),
    ts({
      noForceEmit: true,
      tsconfig: './tsconfig.json',
      outDir: path.resolve(dirname, outDir),
    }),
    babel({
      extensions: ['.ts', '.js'],
      babelHelpers: 'bundled',
    }),
  ];
}

// https://rollupjs.org/guide/en/#configuration-files
export default [
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    output: [
      {
        dir: path.resolve(dirname, 'es'),
        name: 'fabric',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: createPlugins('es'),
    onwarn,
  },
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    output: [
      {
        file: path.resolve(dirname, `${basename}.js`),
        name: 'fabric',
        format: 'umd',
        sourcemap: true,
        inlineDynamicImports: true,
      },
      Number(process.env.MINIFY)
        ? {
            file: path.resolve(dirname, `${basename}.min.js`),
            name: 'fabric',
            format: 'umd',
            inlineDynamicImports: true,
            plugins: [terser()],
          }
        : null,
    ],
    plugins: createPlugins(),
    onwarn,
  },
  {
    input: ['./index.node.ts'],
    output: [
      {
        dir: path.resolve(dirname, 'node/es'),
        name: 'fabric',
        format: 'es',
        sourcemap: true,
      },
    ],
    onwarn,
    plugins: createPlugins('node/es'),
    external: ['jsdom', 'jsdom/lib/jsdom/living/generated/utils.js', 'canvas'],
  },
  {
    input: ['./index.node.ts'],
    output: [
      {
        dir: path.resolve(dirname, 'node/cjs'),
        name: 'fabric',
        format: 'cjs',
        sourcemap: true,
      },
    ],
    onwarn,
    plugins: createPlugins('node/cjs'),
    external: ['jsdom', 'jsdom/lib/jsdom/living/generated/utils.js', 'canvas'],
  },
];
