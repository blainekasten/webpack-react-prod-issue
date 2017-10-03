/* eslint-disable import/no-commonjs, import/no-extraneous-dependencies */

const webpack = require('webpack');

const webpackConfig = require('./config.js');

webpack(webpackConfig.prod, (err, stats) => {
  console.log(err)
  if (err) {
    return new Error('webpack', err);
  }
  if (stats.hasErrors()) {
    console.log(stats.toJson().errors);
    return new Error('webpack', 'Compilation error(s)');
  }
  if (stats.hasWarnings()) {
    console.log(
      '[webpack]',
      stats.toJson().warnings
    );
  }
  console.log('[webpack]', stats.toString({ colors: true }));
});
