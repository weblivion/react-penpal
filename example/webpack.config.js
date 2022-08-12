const path = require('path');

module.exports = {
  entry: {
    index: './src/index.tsx',
    child: './src/child.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'static'),
  },
  devServer: {
    static: path.resolve(__dirname, 'static')
  }
};