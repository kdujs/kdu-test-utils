// @flow

import Kdu from 'kdu'
import Wrapper from './wrapper'
import KduWrapper from './kdu-wrapper'

export default function createWrapper (
  node: KNode | Component,
  update: Function,
  options: WrapperOptions
) {
  return node instanceof Kdu
    ? new KduWrapper(node, options)
    : new Wrapper(node, update, options)
}
