// @flow

import './lib/warn-if-no-window'
import Kdu from 'kdu'
import KduWrapper from './wrappers/kdu-wrapper'
import createInstance from './lib/create-instance'
import createElement from './lib/create-element'
import './lib/polyfills/matches-polyfill'
import './lib/polyfills/object-assign-polyfill'
import errorHandler from './lib/error-handler'

Kdu.config.productionTip = false
Kdu.config.errorHandler = errorHandler
Kdu.config.devtools = false

export default function mount (component: Component, options: Options = {}): KduWrapper {
  // Remove cached constructor
  delete component._Ctor

  const vm = createInstance(component, options)

  if (options.attachToDocument) {
    vm.$mount(createElement())
  } else {
    vm.$mount()
  }

  if (vm._error) {
    throw (vm._error)
  }

  return new KduWrapper(vm, { attachedToDocument: !!options.attachToDocument })
}
