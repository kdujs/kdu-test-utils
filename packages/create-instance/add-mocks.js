// @flow
import $$Kdu from 'kdu'
import { warn } from 'shared/util'

export default function addMocks(
  _Kdu: Component,
  mockedProperties: Object | false = {}
): void {
  if (mockedProperties === false) {
    return
  }
  Object.keys(mockedProperties).forEach(key => {
    try {
      // $FlowIgnore
      _Kdu.prototype[key] = mockedProperties[key]
    } catch (e) {
      warn(
        `could not overwrite property ${key}, this is ` +
          `usually caused by a plugin that has added ` +
          `the property as a read-only value`
      )
    }
    // $FlowIgnore
    $$Kdu.util.defineReactive(_Kdu, key, mockedProperties[key])
  })
}
