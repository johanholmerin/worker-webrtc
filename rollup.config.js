import browsersync from 'rollup-plugin-browsersync';

export default [{
  input: 'test/worker.js',
  output: {
    file: 'build/worker.js',
    format: 'iife',
    sourcemap: true
  }
}, {
  input: 'test/test.js',
  output: {
    file: 'build/test.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    browsersync({
      files: '.',
      server: '.',
      open: false,
      notify: false
    })
  ]
}];
