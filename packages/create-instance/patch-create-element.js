import { createStubFromComponent } from './create-component-stubs'
import { resolveComponent } from 'shared/util'
import {
  isReservedTag,
  isConstructor,
  isDynamicComponent,
  isComponentOptions
} from 'shared/validators'
import {
  BEFORE_RENDER_LIFECYCLE_HOOK,
  CREATE_ELEMENT_ALIAS
} from 'shared/consts'

const isWhitelisted = (el, whitelist) => resolveComponent(el, whitelist)
const isAlreadyStubbed = (el, stubs) => stubs.has(el)

function shouldExtend(component, _Kdu) {
  return isConstructor(component) || (component && component.extends)
}

function extend(component, _Kdu) {
  const componentOptions = component.options ? component.options : component
  const stub = _Kdu.extend(componentOptions)
  stub.options.$_kduTestUtils_original = component
  stub.options._base = _Kdu
  return stub
}

function createStubIfNeeded(shouldStub, component, _Kdu, el) {
  if (shouldStub) {
    return createStubFromComponent(component || {}, el, _Kdu)
  }

  if (shouldExtend(component, _Kdu)) {
    return extend(component, _Kdu)
  }
}

function shouldNotBeStubbed(el, whitelist, modifiedComponents) {
  return (
    (typeof el === 'string' && isReservedTag(el)) ||
    isWhitelisted(el, whitelist) ||
    isAlreadyStubbed(el, modifiedComponents)
  )
}

export function patchCreateElement(_Kdu, stubs, stubAllComponents) {
  // This mixin patches vm.$createElement so that we can stub all components
  // before they are rendered in shallow mode. We also need to ensure that
  // component constructors were created from the _Kdu constructor. If not,
  // we must replace them with components created from the _Kdu constructor
  // before calling the original $createElement. This ensures that components
  // have the correct instance properties and stubs when they are rendered.
  function patchCreateElementMixin() {
    const vm = this

    if (vm.$options.$_doNotStubChildren || vm.$options._isFunctionalContainer) {
      return
    }

    const modifiedComponents = new Set()
    const originalCreateElement = vm.$createElement
    const originalComponents = vm.$options.components

    const createElement = (el, ...args) => {
      if (shouldNotBeStubbed(el, stubs, modifiedComponents)) {
        return originalCreateElement(el, ...args)
      }

      if (isConstructor(el) || isComponentOptions(el)) {
        if (stubAllComponents) {
          const stub = createStubFromComponent(el, el.name || 'anonymous', _Kdu)
          return originalCreateElement(stub, ...args)
        }
        const Constructor = shouldExtend(el, _Kdu) ? extend(el, _Kdu) : el

        return originalCreateElement(Constructor, ...args)
      }

      if (typeof el === 'string') {
        const original = resolveComponent(el, originalComponents)

        if (!original) {
          return originalCreateElement(el, ...args)
        }

        if (isDynamicComponent(original)) {
          return originalCreateElement(el, ...args)
        }

        const stub = createStubIfNeeded(stubAllComponents, original, _Kdu, el)

        if (stub) {
          Object.assign(vm.$options.components, {
            [el]: stub
          })
          modifiedComponents.add(el)
        }
      }

      return originalCreateElement(el, ...args)
    }

    vm[CREATE_ELEMENT_ALIAS] = createElement
    vm.$createElement = createElement
  }

  _Kdu.mixin({
    [BEFORE_RENDER_LIFECYCLE_HOOK]: patchCreateElementMixin
  })
}
