// @flow
import {
  COMPONENT_SELECTOR,
  FUNCTIONAL_OPTIONS,
  KDU_VERSION
} from './consts'
import {
    throwError
} from './util'

function findAllKduComponentsFromVm (
  vm: Component,
  components: Array<Component> = []
): Array<Component> {
  components.push(vm)
  vm.$children.forEach((child) => {
    findAllKduComponentsFromVm(child, components)
  })

  return components
}

function findAllKduComponentsFromKnode (
  knode: Component,
  components: Array<Component> = []
): Array<Component> {
  if (knode.child) {
    components.push(knode.child)
  }
  if (knode.children) {
    knode.children.forEach((child) => {
      findAllKduComponentsFromKnode(child, components)
    })
  }

  return components
}

function findAllFunctionalComponentsFromKnode (
  knode: Component,
  components: Array<Component> = []
): Array<Component> {
  if (knode[FUNCTIONAL_OPTIONS] || knode.functionalContext) {
    components.push(knode)
  }
  if (knode.children) {
    knode.children.forEach((child) => {
      findAllFunctionalComponentsFromKnode(child, components)
    })
  }
  return components
}

export function vmCtorMatchesName (vm: Component, name: string): boolean {
  return (vm.$knode && vm.$knode.componentOptions &&
    vm.$knode.componentOptions.Ctor.options.name === name) ||
    (vm._knode && vm._knode.functionalOptions &&
      vm._knode.functionalOptions.name === name) ||
        vm.$options && vm.$options.name === name
}

export function vmCtorMatchesSelector (component: Component, selector: Object) {
  const Ctor = selector._Ctor || selector.options && selector.options._Ctor
  const Ctors = Object.keys(Ctor)
  return Ctors.some(c => Ctor[c] === component.__proto__.constructor)
}

export function vmFunctionalCtorMatchesSelector (component: KNode, Ctor: Object) {
  if (KDU_VERSION < 2.3) {
    throwError('find for functional components is not support in Kdu < 2.3')
  }

  if (!component[FUNCTIONAL_OPTIONS]) {
    return false
  }
  const Ctors = Object.keys(component[FUNCTIONAL_OPTIONS]._Ctor)
  return Ctors.some(c => Ctor[c] === component[FUNCTIONAL_OPTIONS]._Ctor[c])
}

export default function findKduComponents (
  root: Component,
  selectorType: ?string,
  selector: Object
): Array<Component> {
  if (selector.functional) {
    const nodes = root._knode
    ? findAllFunctionalComponentsFromKnode(root._knode)
    : findAllFunctionalComponentsFromKnode(root)
    return nodes.filter(node => vmFunctionalCtorMatchesSelector(node, selector._Ctor))
  }
  const components = root._isKdu
    ? findAllKduComponentsFromVm(root)
    : findAllKduComponentsFromKnode(root)
  return components.filter((component) => {
    if (!component.$knode && !component.$options.extends) {
      return false
    }
    return selectorType === COMPONENT_SELECTOR
      ? vmCtorMatchesSelector(component, selector)
      : vmCtorMatchesName(component, selector.name)
  })
}
