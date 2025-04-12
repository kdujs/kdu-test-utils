import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'kdu-template-compiler'
import '@kdujs/test-utils'

describeWithShallowAndMount('isVisible', mountingMethod => {
  it('returns true if node has no inline style', () => {
    const compiled = compileToFunctions('<div><p /></div>')
    const wrapper = mountingMethod(compiled)

    expect(wrapper.findAll('p').isVisible()).to.equal(true)
  })

  it('returns false if node has inline style display: none', () => {
    const compiled = compileToFunctions(
      '<div><p style="display: none;"><p/></div>'
    )
    const wrapper = mountingMethod(compiled)

    expect(wrapper.findAll('p').isVisible()).to.equal(false)
  })

  it('returns false if node has visibility: hidden', () => {
    const compiled = compileToFunctions(
      '<div><p style="visibility: hidden;"><p/></div>'
    )
    const wrapper = mountingMethod(compiled)

    expect(wrapper.findAll('p').isVisible()).to.equal(false)
  })

  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message = '[kdu-test-utils]: isVisible cannot be called on 0 items'
    const fn = () =>
      mountingMethod(compiled)
        .findAll('p')
        .isVisible('p')
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
