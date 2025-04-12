// @flow

import {
  isDomSelector,
  isNameSelector,
  isRefSelector,
  isKduComponent
} from 'shared/validators'
import { throwError } from 'shared/util'
import {
  REF_SELECTOR,
  COMPONENT_SELECTOR,
  NAME_SELECTOR,
  DOM_SELECTOR,
  INVALID_SELECTOR
} from 'shared/consts'

export function getSelectorType(selector: Selector): string {
  if (isDomSelector(selector)) return DOM_SELECTOR
  if (isKduComponent(selector)) return COMPONENT_SELECTOR
  if (isNameSelector(selector)) return NAME_SELECTOR
  if (isRefSelector(selector)) return REF_SELECTOR

  return INVALID_SELECTOR
}

export default function getSelector(
  selector: Selector,
  methodName: string
): Object {
  const type = getSelectorType(selector)
  if (type === INVALID_SELECTOR) {
    throwError(
      `wrapper.${methodName}() must be passed a valid CSS selector, Kdu ` +
        `constructor, or valid find option object`
    )
  }
  return {
    type,
    value: selector
  }
}
