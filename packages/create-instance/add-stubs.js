import { BEFORE_RENDER_LIFECYCLE_HOOK } from 'shared/consts'

export function addStubs(_Kdu, stubComponents) {
  function addStubComponentsMixin() {
    Object.assign(this.$options.components, stubComponents)
  }

  _Kdu.mixin({
    [BEFORE_RENDER_LIFECYCLE_HOOK]: addStubComponentsMixin
  })
}
