const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: './src/visual.ts',
  output: {
    filename: 'visual.js',
    path: path.join(__dirname, 'dist'),
    library: 'WynVisualClass',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'visual.css',
    }),
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({}), new UglifyJsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'awesome-typescript-loader?silent=true'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader'
          },
        ],
      },
    ],
    unknownContextCritical: false,
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js'],
  },
  mode: 'development',
};

module.exports = config;