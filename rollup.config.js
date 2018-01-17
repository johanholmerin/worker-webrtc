import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import browsersync from 'rollup-plugin-browsersync';

export default [{
  input: 'test/worker.js',
  output: {
    file: 'build/worker.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs()
  ]
}, {
  input: 'test/test.js',
  output: {
    file: 'build/test.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    browsersync({
      files: '.',
      server: '.',
      open: false,
      notify: false
    })
  ]
}];
