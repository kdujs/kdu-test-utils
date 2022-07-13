import { throwError } from './util'

if (typeof window === 'undefined') {
  throwError(
    'window is undefined, kdu-test-utils needs to be run in a browser environment.\n' +
    'You can run the tests in node using jsdom + jsdom-global.\n' +
    'See https://kdujs-test-utils.web.app/en/guides/common-tips.html for more details.'
  )
}
