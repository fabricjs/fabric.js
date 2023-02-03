import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import path from 'path';
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
  }),
  babel({
    extensions: ['.ts', '.js'],
    babelHelpers: 'bundled',
  }),
];

// https://rollupjs.org/guide/en/#configuration-files
export default [
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    output: [
      {
        file: path.resolve(dirname, `${basename}.mjs`),
        name: 'fabric',
        format: 'es',
        sourcemap: true,
      },
      {
        file: path.resolve(dirname, `${basename}.cjs`),
        name: 'fabric',
        format: 'umd',
        sourcemap: true,
      },
      Number(process.env.MINIFY)
        ? {
            file: path.resolve(dirname, `${basename}.min.js`),
            name: 'fabric',
            format: 'umd',
            plugins: [terser()],
          }
        : null,
    ],
    plugins,
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
    external: ['jsdom', 'jsdom/lib/jsdom/living/generated/utils.js', 'canvas'],
  },
];
