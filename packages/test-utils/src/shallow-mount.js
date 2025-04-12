// @flow

import mount from './mount'
import type KduWrapper from './kdu-wrapper'

export default function shallowMount(
  component: Component,
  options: Options = {}
): KduWrapper {
  return mount(component, {
    ...options,
    shouldProxy: true
  })
}
