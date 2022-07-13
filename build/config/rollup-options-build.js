const resolve = require('path').resolve

module.exports = [
  {
    dest: resolve('dist/kdu-test-utils.js'),
    format: 'cjs'
  },
  {
    name: 'globals',
    dest: resolve('dist/kdu-test-utils.iife.js'),
    moduleName: 'kduTestUtils',
    format: 'iife',
    globals: {
      'kdu': 'Kdu',
      'kdu-template-compiler': 'KduTemplateCompiler'
    }
  },
  {
    dest: resolve('dist/kdu-test-utils.umd.js'),
    format: 'umd',
    globals: {
      'kdu': 'Kdu',
      'kdu-template-compiler': 'KduTemplateCompiler'
    },
    moduleName: 'kduTestUtils'
  }
]
