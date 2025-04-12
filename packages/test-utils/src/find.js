// @flow

import findDOMNodes from './find-dom-nodes'
import {
  DOM_SELECTOR,
  REF_SELECTOR,
  COMPONENT_SELECTOR,
  KDU_VERSION
} from 'shared/consts'
import { throwError } from 'shared/util'
import { matches } from './matches'

export function findAllInstances(rootVm: any) {
  const instances = [rootVm]
  let i = 0
  while (i < instances.length) {
    const vm = instances[i]
    ;(vm.$children || []).forEach(child => {
      instances.push(child)
    })
    i++
  }
  return instances
}

function findAllKNodes(knode: KNode, selector: any): Array<KNode> {
  const matchingNodes = []
  const nodes = [knode]
  while (nodes.length) {
    const node = nodes.shift()
    if (node.children) {
      const children = [...node.children].reverse()
      children.forEach(n => {
        nodes.unshift(n)
      })
    }
    if (node.child) {
      nodes.unshift(node.child._knode)
    }
    if (matches(node, selector)) {
      matchingNodes.push(node)
    }
  }

  return matchingNodes
}

function removeDuplicateNodes(kNodes: Array<KNode>): Array<KNode> {
  const kNodeElms = kNodes.map(kNode => kNode.elm)
  return kNodes.filter((kNode, index) => index === kNodeElms.indexOf(kNode.elm))
}

export default function find(
  root: KNode | Element,
  vm?: Component,
  selector: Selector
): Array<KNode | Component> {
  if (root instanceof Element && selector.type !== DOM_SELECTOR) {
    throwError(
      `cannot find a Kdu instance on a DOM node. The node ` +
        `you are calling find on does not exist in the ` +
        `VDom. Are you adding the node as innerHTML?`
    )
  }

  if (
    selector.type === COMPONENT_SELECTOR &&
    (selector.value.functional ||
      (selector.value.options && selector.value.options.functional)) &&
    KDU_VERSION < 2.3
  ) {
    throwError(
      `find for functional components is not supported ` + `in Kdu < 2.3`
    )
  }

  if (root instanceof Element) {
    return findDOMNodes(root, selector.value)
  }

  if (!root && selector.type !== DOM_SELECTOR) {
    throwError(
      `cannot find a Kdu instance on a DOM node. The node ` +
        `you are calling find on does not exist in the ` +
        `VDom. Are you adding the node as innerHTML?`
    )
  }

  if (!vm && selector.type === REF_SELECTOR) {
    throwError(`$ref selectors can only be used on Kdu component ` + `wrappers`)
  }

  if (vm && vm.$refs && selector.value.ref in vm.$refs) {
    const refs = vm.$refs[selector.value.ref]
    return Array.isArray(refs) ? refs : [refs]
  }

  const nodes = findAllKNodes(root, selector)
  const dedupedNodes = removeDuplicateNodes(nodes)

  if (nodes.length > 0 || selector.type !== DOM_SELECTOR) {
    return dedupedNodes
  }

  // Fallback in case element exists in HTML, but not in knode tree
  // (e.g. if innerHTML is set as a domProp)
  return findDOMNodes(root.elm, selector.value)
}
