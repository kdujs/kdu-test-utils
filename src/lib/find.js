// @flow

import findKnodes from './find-knodes'
import findKduComponents from './find-kdu-components'
import findDOMNodes from './find-dom-nodes'
import {
  COMPONENT_SELECTOR,
  NAME_SELECTOR,
  DOM_SELECTOR
} from './consts'
import Kdu from 'kdu'
import getSelectorTypeOrThrow from './get-selector-type'
import { throwError } from './util'

export default function find (
  vm: Component | null,
  knode: KNode | null,
  element: Element,
  selector: Selector
): Array<KNode | Component> {
  const selectorType = getSelectorTypeOrThrow(selector, 'find')

  if (!knode && !vm && selectorType !== DOM_SELECTOR) {
    throwError('cannot find a Kdu instance on a DOM node. The node you are calling find on does not exist in the KDom. Are you adding the node as innerHTML?')
  }

  if (selectorType === COMPONENT_SELECTOR || selectorType === NAME_SELECTOR) {
    const root = vm || knode
    if (!root) {
      return []
    }
    return findKduComponents(root, selectorType, selector)
  }

  if (vm && vm.$refs && selector.ref in vm.$refs && vm.$refs[selector.ref] instanceof Kdu) {
    return [vm.$refs[selector.ref]]
  }

  if (knode) {
    const nodes = findKnodes(knode, vm, selectorType, selector)
    if (selectorType !== DOM_SELECTOR) {
      return nodes
    }
    return nodes.length > 0 ? nodes : findDOMNodes(element, selector)
  }

  return findDOMNodes(element, selector)
}
