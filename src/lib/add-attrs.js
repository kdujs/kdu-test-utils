import Kdu from 'kdu'

export default function addAttrs (vm, attrs) {
  const originalKduConfig = Kdu.config
  Kdu.config.silent = true
  if (attrs) {
    vm.$attrs = attrs
  } else {
    vm.$attrs = {}
  }
  Kdu.config.silent = originalKduConfig.silent
}
