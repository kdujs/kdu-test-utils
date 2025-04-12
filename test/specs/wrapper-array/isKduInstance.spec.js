import { compileToFunctions } from 'kdu-template-compiler'
import ComponentWithChild from '~resources/components/component-with-child.kdu'
import Component from '~resources/components/component.kdu'
import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('isKduInstance', mountingMethod => {
  it('returns true if wrapper is Kdu instance', () => {
    const wrapper = mountingMethod(ComponentWithChild)
    expect(wrapper.findAll(Component).isKduInstance()).to.equal(true)
  })

  it('returns the tag name of the element if it is not a Kdu component', () => {
    const compiled = compileToFunctions('<div><p /></div>')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.findAll('p').isKduInstance()).to.equal(false)
  })

  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message =
      '[kdu-test-utils]: isKduInstance cannot be called on 0 items'
    const fn = () =>
      mountingMethod(compiled)
        .findAll('p')
        .isKduInstance('p')
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
