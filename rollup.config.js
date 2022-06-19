import { terser } from 'rollup-plugin-terser';

// rollup.config.js
export default {
  input: ['./index.js'],
  output: [
    {
        file: './dist/fabric.js',
        name: 'fabric',
        format: 'cjs',
    },
    // {
    //     file: './dist/fabric.min.js',
    //     format: 'iife',
    //     name: 'fabric',
    //     plugins: [terser()],
    // },
  ],
};
