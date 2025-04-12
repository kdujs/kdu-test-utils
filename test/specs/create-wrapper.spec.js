import Kdu from 'kdu'
import { createWrapper, Wrapper, WrapperArray } from '@kdujs/test-utils'
import Component from '~resources/components/component.kdu'
import { describeRunIf } from 'conditional-specs'

describeRunIf(process.env.TEST_ENV !== 'node', 'mount', () => {
  it('exports createWrapper', () => {
    const Constructor = Kdu.extend(Component)
    const vm = new Constructor().$mount()
    const wrapper = createWrapper(vm)
    expect(wrapper.is(Component)).to.equal(true)
    expect(wrapper).instanceof(Wrapper)
    expect(wrapper.findAll('div')).instanceof(WrapperArray)
  })

  it('handles HTMLElement', () => {
    const wrapper = createWrapper(document.createElement('div'))
    expect(wrapper.is('div')).to.equal(true)
  })

  it('handles options', () => {
    const Constructor = Kdu.extend(Component)
    const vm = new Constructor().$mount()
    const wrapper = createWrapper(vm, {
      attachToDocument: true
    })
    expect(wrapper.options.attachToDocument).to.equal(true)
  })
})
