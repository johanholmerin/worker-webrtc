import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import browsersync from 'rollup-plugin-browsersync';

export default {
  input: 'test/worker.js',
  output: {
    file: 'build/worker.js',
    format: 'es'
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    browsersync({
      server: '.',
      open: false,
      notify: false
    })
  ]
};
