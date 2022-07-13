// @flow
import $$Kdu from 'kdu'
import { warn } from './util'

export default function addMocks (mockedProperties: Object, Kdu: Component) {
  Object.keys(mockedProperties).forEach((key) => {
    try {
      Kdu.prototype[key] = mockedProperties[key]
    } catch (e) {
      warn(`could not overwrite property ${key}, this usually caused by a plugin that has added the property as a read-only value`)
    }
    $$Kdu.util.defineReactive(Kdu, key, mockedProperties[key])
  })
}
