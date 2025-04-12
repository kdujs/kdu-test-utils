// @flow

import Kdu from 'kdu'
import {
  throwError,
  camelize,
  capitalize,
  hyphenate,
  keys,
  warnDeprecated
} from '../shared/util'
import {
  componentNeedsCompiling,
  templateContainsComponent,
  isKduComponent,
  isDynamicComponent,
  isConstructor
} from '../shared/validators'
import { compileTemplate } from '../shared/compile-template'

function isKduComponentStub(comp): boolean {
  return (comp && comp.template) || isKduComponent(comp)
}

function isValidStub(stub: any): boolean {
  return (
    typeof stub === 'boolean' ||
    (!!stub && typeof stub === 'string') ||
    isKduComponentStub(stub)
  )
}

function resolveComponent(obj: Object, component: string): Object {
  return (
    obj[component] ||
    obj[hyphenate(component)] ||
    obj[camelize(component)] ||
    obj[capitalize(camelize(component))] ||
    obj[capitalize(component)] ||
    {}
  )
}

function getCoreProperties(componentOptions: Component): Object {
  return {
    attrs: componentOptions.attrs,
    name: componentOptions.name,
    model: componentOptions.model,
    props: componentOptions.props,
    on: componentOptions.on,
    key: componentOptions.key,
    domProps: componentOptions.domProps,
    class: componentOptions.class,
    staticClass: componentOptions.staticClass,
    staticStyle: componentOptions.staticStyle,
    style: componentOptions.style,
    normalizedStyle: componentOptions.normalizedStyle,
    nativeOn: componentOptions.nativeOn,
    functional: componentOptions.functional
  }
}

function createClassString(staticClass, dynamicClass) {
  // :class="someComputedObject" can return a string, object or undefined
  // if it is a string, we don't need to do anything special.
  let evaluatedDynamicClass = dynamicClass

  // if it is an object, eg { 'foo': true }, we need to evaluate it.
  if (typeof dynamicClass === 'object') {
    evaluatedDynamicClass = Object.keys(dynamicClass).reduce((acc, key) => {
      if (dynamicClass[key]) {
        return acc + ' ' + key
      }
      return acc
    }, '')
  }

  if (staticClass && evaluatedDynamicClass) {
    return staticClass + ' ' + evaluatedDynamicClass
  }
  return staticClass || evaluatedDynamicClass
}

function resolveOptions(component, _Kdu) {
  if (isDynamicComponent(component)) {
    return {}
  }

  return isConstructor(component)
    ? component.options
    : _Kdu.extend(component).options
}

function getScopedSlotRenderFunctions(ctx: any): Array<string> {
  // In Kdu 2.6+ a new k-slot syntax was introduced
  // scopedSlots are now saved in parent._knode.data.scopedSlots
  // We filter out the _normalized and $stable key
  if (
    ctx &&
    ctx.$options &&
    ctx.$options.parent &&
    ctx.$options.parent._knode &&
    ctx.$options.parent._knode.data &&
    ctx.$options.parent._knode.data.scopedSlots
  ) {
    const slotKeys: Array<string> = ctx.$options.parent._knode.data.scopedSlots
    return keys(slotKeys).filter(x => x !== '_normalized' && x !== '$stable')
  }

  return []
}

export function createStubFromComponent(
  originalComponent: Component,
  name: string,
  _Kdu: Component
): Component {
  const componentOptions = resolveOptions(originalComponent, _Kdu)
  const tagName = `${name || 'anonymous'}-stub`

  // ignoreElements does not exist in Kdu 2.0.x
  if (Kdu.config.ignoredElements) {
    Kdu.config.ignoredElements.push(tagName)
  }

  return {
    ...getCoreProperties(componentOptions),
    $_kduTestUtils_original: originalComponent,
    $_doNotStubChildren: true,
    render(h, context) {
      return h(
        tagName,
        {
          ref: componentOptions.functional ? context.data.ref : undefined,
          attrs: componentOptions.functional
            ? {
                ...context.props,
                ...context.data.attrs,
                class: createClassString(
                  context.data.staticClass,
                  context.data.class
                )
              }
            : {
                ...this.$props
              }
        },
        context
          ? context.children
          : this.$options._renderChildren ||
              getScopedSlotRenderFunctions(this).map(x =>
                this.$options.parent._knode.data.scopedSlots[x]()
              )
      )
    }
  }
}

// DEPRECATED: converts string stub to template stub.
function createStubFromString(templateString: string, name: string): Component {
  warnDeprecated('Using a string for stubs')

  if (templateContainsComponent(templateString, name)) {
    throwError('options.stub cannot contain a circular reference')
  }

  return {
    template: templateString,
    $_doNotStubChildren: true
  }
}

function setStubComponentName(
  stub: Object,
  originalComponent: Component = {},
  _Kdu: Component
) {
  if (stub.name) return

  const componentOptions = resolveOptions(originalComponent, _Kdu)
  stub.name = getCoreProperties(componentOptions).name
}

function validateStub(stub) {
  if (!isValidStub(stub)) {
    throwError(`options.stub values must be passed a string or ` + `component`)
  }
}

export function createStubsFromStubsObject(
  originalComponents: Object = {},
  stubs: Object,
  _Kdu: Component
): Components {
  return Object.keys(stubs || {}).reduce((acc, stubName) => {
    let stub = stubs[stubName]

    validateStub(stub)

    if (stub === false) {
      return acc
    }

    const component = resolveComponent(originalComponents, stubName)

    if (stub === true) {
      acc[stubName] = createStubFromComponent(component, stubName, _Kdu)
      return acc
    }

    if (typeof stub === 'string') {
      stub = createStubFromString(stub, stubName)
      stubs[stubName]
    }

    setStubComponentName(stub, component, _Kdu)
    if (componentNeedsCompiling(stub)) {
      compileTemplate(stub)
    }

    acc[stubName] = stub
    stub._Ctor = {}

    return acc
  }, {})
}
