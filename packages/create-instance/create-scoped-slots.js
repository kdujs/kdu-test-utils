// @flow

import { compileToFunctions } from 'kdu-template-compiler'
import { throwError } from 'shared/util'
import { KDU_VERSION } from 'shared/consts'

function isDestructuringSlotScope(slotScope: string): boolean {
  return /^{.*}$/.test(slotScope)
}

function getKduTemplateCompilerHelpers(
  _Kdu: Component
): { [name: string]: Function } {
  // $FlowIgnore
  const kdu = new _Kdu()
  const helpers = {}
  const names = [
    '_c',
    '_o',
    '_n',
    '_s',
    '_l',
    '_t',
    '_q',
    '_i',
    '_m',
    '_f',
    '_k',
    '_b',
    '_v',
    '_e',
    '_u',
    '_g'
  ]
  names.forEach(name => {
    helpers[name] = kdu._renderProxy[name]
  })
  helpers.$createElement = kdu._renderProxy.$createElement
  helpers.$set = kdu._renderProxy.$set
  return helpers
}

function validateEnvironment(): void {
  if (KDU_VERSION < 2.1) {
    throwError(`the scopedSlots option is only supported in kdu@2.1+.`)
  }
}

function isScopedSlot(slot) {
  if (typeof slot === 'function') return { match: null, slot }

  const slotScopeRe = /<[^>]+ slot-scope="(.+)"/
  const kSlotRe = /<template k-slot(?::.+)?="(.+)"/
  const shortKSlotRe = /<template #.*="(.+)"/

  const hasOldSlotScope = slot.match(slotScopeRe)
  const hasKSlotScopeAttr = slot.match(kSlotRe)
  const hasShortKSlotScopeAttr = slot.match(shortKSlotRe)

  if (hasOldSlotScope) {
    return { slot, match: hasOldSlotScope }
  } else if (hasKSlotScopeAttr || hasShortKSlotScopeAttr) {
    // Strip k-slot and #slot attributes from `template` tag. compileToFunctions leaves empty `template` tag otherwise.
    const sanitizedSlot = slot.replace(
      /(<template)([^>]+)(>.+<\/template>)/,
      '$1$3'
    )
    return {
      slot: sanitizedSlot,
      match: hasKSlotScopeAttr || hasShortKSlotScopeAttr
    }
  }
  // we have no matches, so we just return
  return {
    slot: slot,
    match: null
  }
}

// Hide warning about <template> disallowed as root element
function customWarn(msg) {
  if (msg.indexOf('Cannot use <template> as component root element') === -1) {
    console.error(msg)
  }
}

export default function createScopedSlots(
  scopedSlotsOption: ?{ [slotName: string]: string | Function },
  _Kdu: Component
): {
  [slotName: string]: (props: Object) => KNode | Array<KNode>
} {
  const scopedSlots = {}
  if (!scopedSlotsOption) {
    return scopedSlots
  }
  validateEnvironment()
  const helpers = getKduTemplateCompilerHelpers(_Kdu)
  for (const scopedSlotName in scopedSlotsOption) {
    const slot = scopedSlotsOption[scopedSlotName]
    const isFn = typeof slot === 'function'

    const scopedSlotMatches = isScopedSlot(slot)

    // Type check to silence flow (can't use isFn)
    const renderFn =
      typeof slot === 'function'
        ? slot
        : compileToFunctions(scopedSlotMatches.slot, { warn: customWarn })
            .render

    const slotScope = scopedSlotMatches.match && scopedSlotMatches.match[1]

    scopedSlots[scopedSlotName] = function(props) {
      let res
      if (isFn) {
        res = renderFn.call({ ...helpers }, props)
      } else if (slotScope && !isDestructuringSlotScope(slotScope)) {
        res = renderFn.call({ ...helpers, [slotScope]: props })
      } else if (slotScope && isDestructuringSlotScope(slotScope)) {
        res = renderFn.call({ ...helpers, ...props })
      } else {
        res = renderFn.call({ ...helpers, props })
      }
      // res is Array if <template> is a root element
      return Array.isArray(res) ? res[0] : res
    }
  }
  return scopedSlots
}
