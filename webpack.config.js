const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin,
} = require('clean-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyPlugin = require('copy-webpack-plugin');

const baseConfig = {
  entry: path.resolve(__dirname, './src/index'),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            // options: {
            //     url: false,
            // },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // <-- !!IMPORTANT!!
            },
          },
        ],
      },
      {
        test: /\.ts$/i,
        use: 'ts-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|webp|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        './src/index.html'
      ),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    new EslingPlugin({ extensions: 'ts' }),
    new MiniCssExtractPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: 'src/assets/images',
    //       to: 'assets/images',
    //     },
    //   ],
    // }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode
    ? require('./webpack.prod.config')
    : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};
