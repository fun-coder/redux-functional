module.exports = {
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'index.js',
    path: __dirname,
    libraryTarget: 'commonjs2'
  },
  mode: "production"
};