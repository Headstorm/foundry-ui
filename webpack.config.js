const path = require('path');
module.exports = {
  mode: 'production',
  // webpack will take the files from ./src/index
  entry: './src/index.ts',
  // and output it into /dist as bundle.js
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js',
    publicPath: '/',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {
    "styled-components": "styled-components",
    "react": "react",
    "react-dom": "react-dom"
  },
  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx']
  },
  module: {
    rules: [
      // we use babel-loader to load our jsx and tsx files
    {
      test: /\.(ts|js)x?$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      },
    },
    // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
      exclude: /node_modules/,
      use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
    }
  ]
},
};