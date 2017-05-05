import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/lazuli.core.js',
  format: 'iife',
  plugins: [
  	resolve(),
  	babel({
	  exclude: 'node_modules/**'
	}),
	uglify()
  ],
  dest: './dist/lazuli.min.js'
};