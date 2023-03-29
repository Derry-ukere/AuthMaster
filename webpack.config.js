const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  mode: NODE_ENV,
  entry: './src/bin/www/index.ts',
  target: 'node',
  watch: NODE_ENV === 'development',
  output: {
    path: path.resolve(__dirname, 'dist', 'bin', 'www'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'DistinctBackend',
    umdNamedDefine: true,
    globalObject: 'this',
  },
  resolve: {
    alias: {
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@handlers': path.resolve(__dirname, './src/handlers/'),
      '@helpers': path.resolve(__dirname, './src/helpers/'),
      '@interfaces': path.resolve(__dirname, './src/interfaces/'),
      '@middlewares': path.resolve(__dirname, './src/middlewares/'),
      '@migrations': path.resolve(__dirname, './src/migrations/'),
      '@modules': path.resolve(__dirname, './src/modules/'),
      '@typings': path.resolve(__dirname, './src/typings/'),
      '@utils': path.resolve(__dirname, './src/utils/'),
    },
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'src', 'modules', 'notifications', 'email-templates'),
        to: path.resolve(__dirname, 'dist', 'modules', 'notifications', 'email-templates'),
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ts-loader'],
      },
    ],
  },
  externals: [nodeExternals()],
};
