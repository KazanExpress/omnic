const css = require('rollup-plugin-css-only');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const config = require('./config');

module.exports = exports = function(
  compress = false,
  polyfills = {
    arrow: true,
    assign: true,
    async: true,
    promise: true,
    spread: true
  },
  defineInWindow = false
) {
  const babelPlugins = [];

  if (polyfills.assign) {
    babelPlugins.push('transform-object-assign')
  }

  if (polyfills.async) {
    babelPlugins.push('transform-async-to-promises')
  }

  if (polyfills.promise) {
    babelPlugins.push('es6-promise')
  }

  if (polyfills.spread) {
    babelPlugins.push('transform-object-rest-spread')
  }

  if (polyfills.arrow) {
    babelPlugins.push('transform-es2015-arrow-functions')
  }

  const plugins = [
    css({ output: 'dist/styles.css' }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: false,
      presets: [],
      plugins: babelPlugins
    }),
    nodeResolve({ browser: true, jsnext: true, main: true }),
    commonjs()
  ];

  if (compress) {
    plugins.push(uglify());
  }

  return {
    input: defineInWindow ? config.entryWithAutoDefine : config.entry,
    output: {
      exports: 'named'
    },
    plugins
  };
}
