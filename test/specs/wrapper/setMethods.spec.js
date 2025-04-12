import { compileToFunctions } from 'kdu-template-compiler'
import ComponentWithMethods from '~resources/components/component-with-methods.kdu'
import ComponentWithEvents from '~resources/components/component-with-events.kdu'
import { describeWithShallowAndMount, kduVersion } from '~resources/utils'
import { itDoNotRunIf } from 'conditional-specs'

describeWithShallowAndMount('setMethods', mountingMethod => {
  it('sets component data and updates nested vm nodes when called on Kdu instance', () => {
    const wrapper = mountingMethod(ComponentWithMethods)
    const someMethod = () => {}
    wrapper.setMethods({ someMethod })
    expect(wrapper.vm.someMethod).to.equal(someMethod)
  })

  it('throws an error if node is not a Kdu instance', () => {
    const message = 'wrapper.setMethods() can only be called on a Kdu instance'
    const compiled = compileToFunctions('<div><p></p></div>')
    const wrapper = mountingMethod(compiled)
    const p = wrapper.find('p')
    expect(() => p.setMethods({ ready: true })).throw(Error, message)
  })

  itDoNotRunIf(
    kduVersion < 2.2,
    'should replace methods when tied to an event',
    () => {
      const wrapper = mountingMethod(ComponentWithEvents)
      expect(wrapper.vm.isActive).to.be.false
      wrapper.find('.toggle').trigger('click')
      expect(wrapper.vm.isActive).to.be.true
      // Replace the toggle function so that the data supposedly won't change
      const toggleActive = () => {}
      wrapper.setMethods({ toggleActive })
      wrapper.find('.toggle').trigger('click')
      expect(wrapper.vm.isActive).to.be.true
    }
  )
})
