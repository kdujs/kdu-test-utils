// @flow

import { throwError } from 'shared/util'

export default function warnIfNoWindow(): void {
  if (typeof window === 'undefined') {
    throwError(
      `window is undefined, kdu-test-utils needs to be ` +
        `run in a browser environment. \n` +
        `You can run the tests in node using jsdom.`
    )
  }
}
