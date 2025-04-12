import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'kdu-template-compiler'

describeWithShallowAndMount('isKduInstance', mountingMethod => {
  it('returns true if wrapper is Kdu instance', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.isKduInstance()).to.equal(true)
  })

  it('returns the tag name of the element if it is not a Kdu component', () => {
    const compiled = compileToFunctions('<div><p /></div>')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.find('p').isKduInstance()).to.equal(false)
  })
})
