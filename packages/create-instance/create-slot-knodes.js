// @flow

import { compileToFunctions } from 'kdu-template-compiler'

function createKNodes(vm: Component, slotValue: string, name): Array<KNode> {
  const el = compileToFunctions(
    `<div><template slot=${name}>${slotValue}</template></div>`
  )
  const _staticRenderFns = vm._renderProxy.$options.staticRenderFns
  const _staticTrees = vm._renderProxy._staticTrees
  vm._renderProxy._staticTrees = []
  vm._renderProxy.$options.staticRenderFns = el.staticRenderFns
  const knode = el.render.call(vm._renderProxy, vm.$createElement)
  vm._renderProxy.$options.staticRenderFns = _staticRenderFns
  vm._renderProxy._staticTrees = _staticTrees
  return knode.children[0]
}

function createKNodesForSlot(
  vm: Component,
  slotValue: SlotValue,
  name: string
): KNode | Array<KNode> {
  if (typeof slotValue === 'string') {
    return createKNodes(vm, slotValue, name)
  }
  const knode = vm.$createElement(slotValue)
  ;(knode.data || (knode.data = {})).slot = name
  return knode
}

export function createSlotKNodes(
  vm: Component,
  slots: SlotsObject
): Array<KNode | Array<KNode>> {
  return Object.keys(slots).reduce((acc, key) => {
    const content = slots[key]
    if (Array.isArray(content)) {
      const nodes = content.map(slotDef =>
        createKNodesForSlot(vm, slotDef, key)
      )
      return acc.concat(nodes)
    }

    return acc.concat(createKNodesForSlot(vm, content, key))
  }, [])
}
