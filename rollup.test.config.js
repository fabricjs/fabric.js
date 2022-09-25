import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import ts from 'rollup-plugin-ts';

// https://rollupjs.org/guide/en/#configuration-files
export default {
  external: ['qunit', 'fabric'],
  input: ['test/lib/index.js', 'test/visual/index.ts'],
  output: [
    {
      dir: 'cli_output/test',
      format: 'es',
      exports: 'named',
      preserveModules: true, // Keep directory structure and files
      globals: { qunit: 'QUnit' },
      entryFileNames: '[name].js'
    },
  ],
  plugins: [
    json(),
    ts(),
    nodePolyfills({sourceMap:true}),
    nodeResolve({preferBuiltins: false,browser:true}),
    commonjs(),
  ],
};
