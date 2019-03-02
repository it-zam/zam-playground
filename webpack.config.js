const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PROJECT_ROOT = path.resolve(__dirname, './');
const APP_ENTRY = path.join(PROJECT_ROOT, 'src/client');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'dist');

const version = process.env.npm_package_version || '0.0.0';
const APPLICATION_PHASE = process.env.APPLICATION_PHASE || 'production';

console.log('******************** WEBPACK BUILD ********************');
console.log('[APPLICATION_PHASE]', APPLICATION_PHASE);
console.log('[VERSION]', version);
console.log('******************** WEBPACK BUILD ********************');

const commonConfig = {
  mode: APPLICATION_PHASE,
  entry: {
    app: `${APP_ENTRY}/index.tsx`,
  },
  output: {
    filename: `app.${version}.js`,
    path: OUTPUT_PATH,
    publicPath: OUTPUT_PATH,
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts', '.json', 'css'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        APPLICATION_PHASE: JSON.stringify(APPLICATION_PHASE || 'production'),
        APPLICATION_VERSION: JSON.stringify(version),
      },
    }),
    new HtmlWebPackPlugin({
      template: `${APP_ENTRY}/index.html`,
      filename: `index.${version}.html`,
    }),
  ],
  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
    historyApiFallback: {
      index: `${OUTPUT_PATH}/index.${version}.html`,
    },
  },
};

const devConfig = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};

const prodConfig = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `app.${version}.css`,
      publicPath: OUTPUT_PATH,
    }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    return merge(commonConfig, devConfig);
  } else {
    return merge(commonConfig, prodConfig);
  }
};
