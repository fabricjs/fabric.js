import commonjs from '@rollup/plugin-commonjs';
import ts from 'rollup-plugin-ts';

// https://github.com/artberri/rollup-plugin-istanbul

// https://rollupjs.org/guide/en/#configuration-files
export default {
  external: ['qunit', 'fabric'],
  input: ['test/unit/index.ts', 'test/visual/index.ts'],
  output: [
    {
      dir: 'cli_output/test',
      format: 'cjs',
      exports: 'named',
      preserveModules: true, // Keep directory structure and files
    },
  ],
  plugins: [
    ts({
      /* Plugin options */
    }),
    commonjs(),
  ],
};
