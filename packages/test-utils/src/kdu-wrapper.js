// @flow

import Wrapper from './wrapper'
import { throwError } from 'shared/util'

export default class KduWrapper extends Wrapper implements BaseWrapper {
  constructor(vm: Component, options: WrapperOptions) {
    super(vm._knode, options, true)
    // $FlowIgnore : issue with defineProperty
    Object.defineProperty(this, 'rootNode', {
      get: () => vm.$knode || { child: this.vm },
      set: () => throwError('wrapper.knode is read-only')
    })
    // $FlowIgnore : issue with defineProperty
    Object.defineProperty(this, 'knode', {
      get: () => vm._knode,
      set: () => throwError('wrapper.knode is read-only')
    })
    // $FlowIgnore
    Object.defineProperty(this, 'element', {
      get: () => vm.$el,
      set: () => throwError('wrapper.element is read-only')
    })
    // $FlowIgnore
    Object.defineProperty(this, 'vm', {
      get: () => vm,
      set: () => throwError('wrapper.vm is read-only')
    })
    this.isFunctionalComponent = vm.$options._isFunctionalContainer
    this._emitted = vm.__emitted
    this._emittedByOrder = vm.__emittedByOrder
  }
}
