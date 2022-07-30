import { terser } from 'rollup-plugin-terser';
import ts from "rollup-plugin-ts";
import json from '@rollup/plugin-json';

// rollup.config.js
export default {
  input: ['./index.js'],
  output: [
    {
      file: './dist/fabric.js',
      name: 'fabric',
      format: 'cjs',
    },
    {
      file: './dist/fabric.min.js',
      format: 'cjs',
      name: 'fabric',
      plugins: [terser()],
    },
  ],
  plugins: [
    json(),
    ts({
      /* Plugin options */
    })
  ]
};
