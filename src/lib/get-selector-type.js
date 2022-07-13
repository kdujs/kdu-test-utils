// @flow

import {
  isDomSelector,
  isNameSelector,
  isRefSelector,
  isKduComponent
} from './validators.js'
import { throwError } from '../lib/util'
import {
  REF_SELECTOR,
  COMPONENT_SELECTOR,
  NAME_SELECTOR,
  DOM_SELECTOR
} from './consts'

function getSelectorType (selector: Selector): string | void {
  if (isDomSelector(selector)) {
    return DOM_SELECTOR
  }

  if (isNameSelector(selector)) {
    return NAME_SELECTOR
  }

  if (isKduComponent(selector)) {
    return COMPONENT_SELECTOR
  }

  if (isRefSelector(selector)) {
    return REF_SELECTOR
  }
}

export default function getSelectorTypeOrThrow (selector: Selector, methodName: string): string | void {
  const selectorType = getSelectorType(selector)
  if (!selectorType) {
    throwError(`wrapper.${methodName}() must be passed a valid CSS selector, Kdu constructor, or valid find option object`)
  }
  return selectorType
}
