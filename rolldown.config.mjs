import terser from '@rollup/plugin-terser';
import path from 'path';
import { redBright } from './scripts/colors.mjs';

const splitter = /\n|\s|,/g;

const buildOutput = process.env.BUILD_OUTPUT || './dist/index.js';

const dirname = path.dirname(buildOutput);
const basename = path.basename(buildOutput, '.js');

// match .browserslistrc targets for syntax lowering
const transform = {
  target: ['chrome88', 'safari13', 'firefox85', 'edge88'],
};

/**
 * disallow circular deps
 * @see https://rolldown.rs/reference/interface.inputoptions
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

// https://rolldown.rs/guide/getting-started
export default [
  {
    input: ['./fabric.ts'],
    tsconfig: './tsconfig.build.json',
    transform,
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
    onwarn,
  },
  {
    input: process.env.BUILD_INPUT?.split(splitter) || ['./index.ts'],
    tsconfig: './tsconfig.build.json',
    transform,
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
    onwarn,
  },
  {
    input: ['./index.node.ts'],
    tsconfig: './tsconfig.build.json',
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
    onwarn,
    external: ['jsdom', 'jsdom/lib/jsdom/living/generated/utils.js', 'canvas'],
  },
  // EXTENSIONS

  {
    input: ['./extensions/index.ts'],
    external: ['fabric', 'westures'],
    tsconfig: './tsconfig-extensions.json',
    transform,
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
    onwarn,
  },
];
