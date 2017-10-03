module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    [
      'env',
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7']
        }
      }
    ],
    'stage-1',
    'react'
  ],
  plugins: ['transform-class-properties']
};

