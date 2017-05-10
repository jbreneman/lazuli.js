import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/lazuli.core.js',
  format: 'umd',
  plugins: [
  	resolve(),
    commonjs(),
  	babel({
  	  exclude: 'node_modules/**'
  	}),
  	uglify()
  ],
  dest: './dist/lazuli.min.js'
};
