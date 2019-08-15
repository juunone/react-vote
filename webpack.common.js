const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js', './src/sass/main.scss', 'react-confirm-alert/src/react-confirm-alert.css', 'react-datepicker/dist/react-datepicker.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      }, {
        test: /\.(css|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
        // exclude: /node_modules/,
      }, {
        test: /\.html$/,
        use: [
          'ejs-loader', 'extract-loader',
          {
            loader:'html-loader',
            options: { minimize: true }
          }
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Vote for Everyone',
      showErrors: true,
      favicon: 'public/favicon.ico',
      template: path.join(__dirname, 'public', 'index.html'),
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};