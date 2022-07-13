import Kdu from 'kdu'

export default function addListeners (vm, listeners) {
  const originalKduConfig = Kdu.config
  Kdu.config.silent = true
  if (listeners) {
    vm.$listeners = listeners
  } else {
    vm.$listeners = {}
  }
  Kdu.config.silent = originalKduConfig.silent
}
