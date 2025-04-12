// @flow

import Kdu from 'kdu'
import Wrapper from './wrapper'
import KduWrapper from './kdu-wrapper'
import { trackInstance } from './auto-destroy'

export default function createWrapper(
  node: KNode | Component,
  options: WrapperOptions = {}
): KduWrapper | Wrapper {
  const componentInstance = node.child
  if (componentInstance) {
    const wrapper = new KduWrapper(componentInstance, options)
    trackInstance(wrapper)
    return wrapper
  }
  const wrapper =
    node instanceof Kdu
      ? new KduWrapper(node, options)
      : new Wrapper(node, options)
  trackInstance(wrapper)
  return wrapper
}
