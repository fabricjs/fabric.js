import { terser } from 'rollup-plugin-terser';
import ts from "rollup-plugin-ts";

// rollup.config.js
export default {
  input: ['./index.js'],
  output: [
    {
        file: './dist/fabric.js',
        name: 'fabric',
        format: 'cjs',
    },
    Number(process.env.MINIFY) ?
      {
        file: './dist/fabric.min.js',
        format: 'cjs',
        name: 'fabric',
        plugins: [terser()],
      } : null,
  ],
  plugins: [
		ts({
			/* Plugin options */
		})
	]
};
