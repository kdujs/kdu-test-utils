// @flow

import Wrapper from './wrapper'
import addSlots from '../lib/add-slots'
import cloneDeep from 'lodash/cloneDeep'

function update (changedData) {
  // the only component made by mount()
  if (this.$_originalSlots) {
    this.$slots = cloneDeep(this.$_originalSlots)
  }
  if (this.$_mountingOptionsSlots) {
    addSlots(this, this.$_mountingOptionsSlots)
  }
  if (changedData) {
    Object.keys(changedData).forEach((key) => {
       // $FlowIgnore : Problem with possibly null this.vm
      this._watchers.forEach((watcher) => {
        if (watcher.expression === key) { watcher.run() }
      })
    })
  } else {
    this._watchers.forEach(watcher => {
      watcher.run()
    })
  }
  const knodes = this._render()
  this._update(knodes)
  this.$children.forEach(child => update.call(child))
}

export default class KduWrapper extends Wrapper implements BaseWrapper {
  constructor (vm: Component, options: WrapperOptions) {
    super(vm._knode, update.bind(vm), options)

    // $FlowIgnore : issue with defineProperty - https://github.com/facebook/flow/issues/285
    Object.defineProperty(this, 'knode', ({
      get: () => vm._knode,
      set: () => {}
    }))
    // $FlowIgnore
    Object.defineProperty(this, 'element', ({
      get: () => vm.$el,
      set: () => {}
    }))
    this.vm = vm
    this.isKduComponent = true
    this._emitted = vm.__emitted
    this._emittedByOrder = vm.__emittedByOrder
  }
}
