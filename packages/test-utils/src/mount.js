import Kdu from 'kdu'
import createInstance from 'create-instance'
import createElement from './create-element'
import { throwIfInstancesThrew, addGlobalErrorHandler } from './error'
import { mergeOptions } from 'shared/merge-options'
import config from './config'
import warnIfNoWindow from './warn-if-no-window'
import polyfill from './polyfill'
import createWrapper from './create-wrapper'
import createLocalKdu from './create-local-kdu'
import { validateOptions } from 'shared/validate-options'

Kdu.config.productionTip = false
Kdu.config.devtools = false

export default function mount(component, options = {}) {
  warnIfNoWindow()

  polyfill()

  addGlobalErrorHandler(Kdu)

  const _Kdu = createLocalKdu(options.localKdu)

  const mergedOptions = mergeOptions(options, config)

  validateOptions(mergedOptions, component)

  const parentVm = createInstance(component, mergedOptions, _Kdu)

  const el =
    options.attachTo || (options.attachToDocument ? createElement() : undefined)
  const vm = parentVm.$mount(el)

  component._Ctor = {}

  throwIfInstancesThrew(vm)

  const wrapperOptions = {
    attachedToDocument: !!el
  }

  const root = parentVm.$options._isFunctionalContainer
    ? vm._knode
    : vm.$children[0]

  return createWrapper(root, wrapperOptions)
}
