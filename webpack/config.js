/* eslint-disable import/no-extraneous-dependencies, global-require */
const path = require('path');
const defaults = require('lodash/defaults');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UnusedFilesWebpackPlugin = require('unused-files-webpack-plugin').default;

const src = path.join(__dirname, '../', './src');
const nodeModules = path.resolve('../', 'node_modules');
const isProdBuild = ['staging', 'experimental', 'production'].includes(
  process.env.NODE_ENV
);

const baseConfig = {
  bail: true,
  devtool: 'eval',
  entry: {
    bundle: [
      path.join(src, 'index.js'),
      path.join(src, 'index2.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    pathinfo: true,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js?v=[chunkhash]',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: nodeModules,
        loader: 'babel-loader',
        query: require('./babel.js')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: isProdBuild
                  ? '[hash:base64:5]'
                  : '[name]__[local]__[hash:base64:5]',
                importLoaders: 1,
                minimize: isProdBuild
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './postcss.config.js'
                }
              }
            }
          ]
        })
      },
      {
        test: /\.(jpg|png|gif)(\?.*)?$/,
        include: [src, nodeModules],
        loader: 'file-loader',
        query: {
          name: 'static/media/[name].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /.svg$/,
        use: ['raw-loader']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      ignoreOrder: true
    })
  ]
};

const prod = defaults(
  {
    plugins: baseConfig.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        compress: {
          screw_ie8: true,
          warnings: false
        },
        mangle: {
          screw_ie8: true
        },
        output: {
          comments: false,
          screw_ie8: true
        }
      }),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ])
  },
  baseConfig
);

const dev = defaults(
  {
    plugins: baseConfig.plugins.concat([
      new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"' }),
      new UnusedFilesWebpackPlugin({
        pattern: 'src/**/*.+(js|jsx)'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ])
  },
  baseConfig
);

const devServer = {
  stats: {
    colors: true,
    chunks: false
  },
  port: 3002,
  hot: true,
  historyApiFallback: true,
  publicPath: 'http://localhost:3002/static/',
  disableHostCheck: true
};

// console.log(prod);

module.exports = { dev, devServer, prod };
