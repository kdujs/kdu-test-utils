/* eslint-disable max-len */

const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')
const browser = process.env.TARGET === 'browser'
const path = require('path')

const projectRoot = path.resolve(__dirname, '../../')

const rules = [].concat(
  {
    test: /\.kdu$/,
    loader: 'kdu-loader'
  },
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  }
)
const externals = nodeExternals({
  // we need to whitelist both `create-instance` and files in `shared` package. Otherwise webpack won't bundle them in the test dev env
  whitelist: [
    '@kdujs/test-utils',
    '@kdujs/server-test-utils',
    'create-instance',
    /^shared\/.*/
  ]
})
// define the default aliases
let aliasedFiles = {}
if (process.env.TARGET === 'dev') {
  // if we are in dev test mode, we want to alias all files to the src file, not dist
  aliasedFiles = {
    '@kdujs/server-test-utils': `@kdujs/server-test-utils/src/index.js`,
    '@kdujs/test-utils': `@kdujs/test-utils/src/index.js`
  }
}
module.exports = {
  module: {
    rules
  },
  externals: !browser ? [externals] : undefined,
  resolve: {
    alias: {
      ...aliasedFiles,
      '~resources': `${projectRoot}/test/resources`
    }
  },
  output: {
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
  },
  devtool: '#inline-cheap-module-source-map',
  node: {
    fs: 'empty',
    module: 'empty'
  },
  plugins: [new webpack.EnvironmentPlugin(['TEST_ENV'])]
}
