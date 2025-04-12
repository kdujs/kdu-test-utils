import { createLocalKdu, mount } from '@kdujs/test-utils'
import KduValidate from 'kdu-validate'
import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('external libraries', () => {
  it('works with kdu validate', () => {
    const TestComponent = {
      template: '<div />'
    }
    const localKdu = createLocalKdu()
    localKdu.use(KduValidate)
    const wrapper = mount(TestComponent, {
      localKdu
    })
    wrapper.vm.errors.collect('text')
  })
})
