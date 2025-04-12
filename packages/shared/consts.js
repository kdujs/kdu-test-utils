import Kdu from 'kdu'
import semver from 'semver'

export const NAME_SELECTOR = 'NAME_SELECTOR'
export const COMPONENT_SELECTOR = 'COMPONENT_SELECTOR'
export const REF_SELECTOR = 'REF_SELECTOR'
export const DOM_SELECTOR = 'DOM_SELECTOR'
export const INVALID_SELECTOR = 'INVALID_SELECTOR'

export const KDU_VERSION = Number(
  `${Kdu.version.split('.')[0]}.${Kdu.version.split('.')[1]}`
)

export const FUNCTIONAL_OPTIONS =
  KDU_VERSION >= 2.5 ? 'fnOptions' : 'functionalOptions'

export const BEFORE_RENDER_LIFECYCLE_HOOK = semver.gt(Kdu.version, '2.1.8')
  ? 'beforeCreate'
  : 'beforeMount'

export const CREATE_ELEMENT_ALIAS = semver.gt(Kdu.version, '2.1.5')
  ? '_c'
  : '_h'
