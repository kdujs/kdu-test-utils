// @flow

import {
  REF_SELECTOR
} from './consts'
import {
  throwError
} from './util'

function findAllKNodes (knode: KNode, nodes: Array<KNode> = []): Array<KNode> {
  nodes.push(knode)

  if (Array.isArray(knode.children)) {
    knode.children.forEach((childKNode) => {
      findAllKNodes(childKNode, nodes)
    })
  }

  if (knode.child) {
    findAllKNodes(knode.child._knode, nodes)
  }

  return nodes
}

function removeDuplicateNodes (kNodes: Array<KNode>): Array<KNode> {
  const uniqueNodes = []
  kNodes.forEach((kNode) => {
    const exists = uniqueNodes.some(node => kNode.elm === node.elm)
    if (!exists) {
      uniqueNodes.push(kNode)
    }
  })
  return uniqueNodes
}

function nodeMatchesRef (node: KNode, refName: string): boolean {
  return node.data && node.data.ref === refName
}

function findKNodesByRef (kNode: KNode, refName: string): Array<KNode> {
  const nodes = findAllKNodes(kNode)
  const refFilteredNodes = nodes.filter(node => nodeMatchesRef(node, refName))
  // Only return refs defined on top-level KNode to provide the same
  // behavior as selecting via vm.$ref.{someRefName}
  const mainKNodeFilteredNodes = refFilteredNodes.filter(node => (
    !!kNode.context.$refs[node.data.ref]
  ))
  return removeDuplicateNodes(mainKNodeFilteredNodes)
}

function nodeMatchesSelector (node: KNode, selector: string): boolean {
  return node.elm && node.elm.getAttribute && node.elm.matches(selector)
}

function findKNodesBySelector (
  kNode: KNode,
  selector: string
): Array<KNode> {
  const nodes = findAllKNodes(kNode)
  const filteredNodes = nodes.filter(node => (
    nodeMatchesSelector(node, selector)
  ))
  return removeDuplicateNodes(filteredNodes)
}

export default function findKnodes (
  knode: KNode,
  vm: Component | null,
  selectorType: ?string,
  selector: Object | string
): Array<KNode> {
  if (selectorType === REF_SELECTOR) {
    if (!vm) {
      throwError('$ref selectors can only be used on Kdu component wrappers')
    }
    // $FlowIgnore
    return findKNodesByRef(knode, selector.ref)
  }
  // $FlowIgnore
  return findKNodesBySelector(knode, selector)
}
