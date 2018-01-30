import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default [{
  input: 'test/worker/worker.js',
  output: {
    file: 'build/worker.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    builtins(),
    nodeResolve(),
    commonjs(),
    globals()
  ]
}, {
  input: 'test/index.js',
  output: {
    file: 'build/index.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}];
