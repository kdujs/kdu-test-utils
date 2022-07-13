// @flow

import './lib/warn-if-no-window'
import Kdu from 'kdu'
import {
  createComponentStubsForAll,
  createComponentStubsForGlobals
} from './lib/stub-components'
import mount from './mount'
import type KduWrapper from './wrappers/kdu-wrapper'
import {
  camelize,
  capitalize,
  hyphenate
} from './lib/util'

export default function shallow (
  component: Component,
  options: Options = {}
): KduWrapper {
  const kdu = options.localKdu || Kdu

  // remove any recursive components added to the constructor
  // in vm._init from previous tests
  if (component.name && component.components) {
    delete component.components[capitalize(camelize(component.name))]
    delete component.components[hyphenate(component.name)]
  }

  const stubbedComponents = createComponentStubsForAll(component)
  const stubbedGlobalComponents = createComponentStubsForGlobals(kdu)

  return mount(component, {
    ...options,
    components: {
      // stubbed components are used instead of original components components
      ...stubbedGlobalComponents,
      ...stubbedComponents
    }
  })
}
