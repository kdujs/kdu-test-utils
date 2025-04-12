// @flow

import { throwError } from 'shared/util'
import { compileToFunctions } from 'kdu-template-compiler'
import { isKduComponent } from './validators'

function isValidSlot(slot: any): boolean {
  return isKduComponent(slot) || typeof slot === 'string'
}

function requiresTemplateCompiler(slot: any): void {
  if (typeof slot === 'string' && !compileToFunctions) {
    throwError(
      `kduTemplateCompiler is undefined, you must pass ` +
        `precompiled components if kdu-template-compiler is ` +
        `undefined`
    )
  }
}

export function validateSlots(slots: SlotsObject): void {
  Object.keys(slots).forEach(key => {
    const slot = Array.isArray(slots[key]) ? slots[key] : [slots[key]]

    slot.forEach(slotValue => {
      if (!isValidSlot(slotValue)) {
        throwError(
          `slots[key] must be a Component, string or an array ` +
            `of Components`
        )
      }
      requiresTemplateCompiler(slotValue)
    })
  })
}
