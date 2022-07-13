import Kdu from 'kdu'

export const NAME_SELECTOR = 'NAME_SELECTOR'
export const COMPONENT_SELECTOR = 'COMPONENT_SELECTOR'
export const REF_SELECTOR = 'REF_SELECTOR'
export const DOM_SELECTOR = 'DOM_SELECTOR'
export const KDU_VERSION = Number(`${Kdu.version.split('.')[0]}.${Kdu.version.split('.')[1]}`)
export const FUNCTIONAL_OPTIONS = KDU_VERSION >= 2.5 ? 'fnOptions' : 'functionalOptions'
