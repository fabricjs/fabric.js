import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import ts from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
// import dts from "rollup-plugin-dts";

const splitter = /\n|\s|,/g;

// https://rollupjs.org/guide/en/#configuration-files
export default [
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    output: [
      {
        file: process.env.BUILD_OUTPUT || './dist/fabric.js',
        name: 'fabric',
        format: 'umd',
        sourcemap: true,
      },
      Number(process.env.MINIFY)
        ? {
            file: process.env.BUILD_MIN_OUTPUT || './dist/fabric.min.js',
            name: 'fabric',
            format: 'umd',
            plugins: [terser()],
          }
        : null,
    ],
    // see list of plugins (not comprehensive): https://github.com/rollup/awesome
    plugins: [
      json(),
      ts({
        noForceEmit: true,
        tsconfig: './tsconfig.json',
      }),
      babel({
        extensions: ['.ts', '.js'],
        babelHelpers: 'bundled',
      }),
    ],
  },
  // {
  //   input: "./my-input/index.d.ts",
  //   output: [{ file: "dist/my-library.d.ts", format: "es" }],
  //   plugins: [dts()],
  // },
];
