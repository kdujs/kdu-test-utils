const rollup = require('rollup').rollup
const flow = require('rollup-plugin-flow-no-whitespace')
const resolve = require('path').resolve
const buble = require('rollup-plugin-buble')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const chalk = require('chalk')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
const del = require('rollup-plugin-delete')

function success(text) {
  console.log(chalk.green(`${text} ✔`))
}

function error(text) {
  console.log(chalk.red(`${text} ✘`))
}

const rollupOptionsBuild = [
  {
    file: 'dist/kdu-test-utils.js',
    format: 'cjs'
  },
  {
    file: 'dist/kdu-test-utils.iife.js',
    format: 'iife',
    name: 'KduTestUtils',
    globals: {
      kdu: 'Kdu',
      'kdu-template-compiler': 'KduTemplateCompiler'
    }
  },
  {
    file: 'dist/kdu-test-utils.umd.js',
    format: 'umd',
    name: 'KduTestUtils',
    globals: {
      kdu: 'Kdu',
      'kdu-template-compiler': 'KduTemplateCompiler'
    },
    moduleName: 'KduTestUtils'
  }
]

const rollupOptionsTest = [
  {
    file: 'dist/kdu-test-utils.js',
    format: 'cjs',
    sourcemap: 'inline'
  }
]

const rollupOptions =
  process.env.NODE_ENV === 'test' ? rollupOptionsTest : rollupOptionsBuild

rollupOptions.forEach(options => {
  rollup({
    input: resolve('src/index.js'),
    external: ['kdu', 'kdu-template-compiler'],
    plugins: [
      del({ targets: 'dist/*' }),
      replace({
        'process.env.SHOW_DEPRECATIONS': process.env.SHOW_DEPRECATIONS
      }),
      flow(),
      json(),
      buble({
        objectAssign: 'Object.assign'
      }),
      nodeResolve(),
      commonjs()
    ]
  })
    .then(bundle => {
      bundle.write(options)
    })
    .then(() => success(`${options.format} build successful`))
    .catch(err => {
      error(err)
      process.exit(1)
    })
})
