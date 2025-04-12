// @flow

import Kdu from 'kdu'
import cloneDeep from 'lodash/cloneDeep'

function createLocalKdu(_Kdu: Component = Kdu): Component {
  const instance = _Kdu.extend()

  // clone global APIs
  Object.keys(_Kdu).forEach(key => {
    if (!instance.hasOwnProperty(key)) {
      const original = _Kdu[key]
      // cloneDeep can fail when cloning Kdu instances
      // cloneDeep checks that the instance has a Symbol
      // which errors in Kdu < 2.17
      try {
        instance[key] =
          typeof original === 'object' ? cloneDeep(original) : original
      } catch (e) {
        instance[key] = original
      }
    }
  })

  // config is not enumerable
  instance.config = cloneDeep(Kdu.config)

  instance.config.errorHandler = Kdu.config.errorHandler

  // option merge strategies need to be exposed by reference
  // so that merge strats registered by plugins can work properly
  instance.config.optionMergeStrategies = Kdu.config.optionMergeStrategies

  // make sure all extends are based on this instance.
  // this is important so that global components registered by plugins,
  // e.g. router-link are created using the correct base constructor
  instance.options._base = instance

  // compat for kdu-router < 2.7.1 where it does not allow multiple installs
  if (instance._installedPlugins && instance._installedPlugins.length) {
    instance._installedPlugins.length = 0
  }
  const use = instance.use
  instance.use = (plugin, ...rest) => {
    if (plugin.installed === true) {
      plugin.installed = false
    }
    if (plugin.install && plugin.install.installed === true) {
      plugin.install.installed = false
    }
    use.call(instance, plugin, ...rest)
  }
  return instance
}

export default createLocalKdu
