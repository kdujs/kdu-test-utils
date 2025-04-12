import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'kdu-template-compiler'
import '@kdujs/test-utils'

describeWithShallowAndMount('name', mountingMethod => {
  it('throws an error when called on a WrapperArray', () => {
    const compiled = compileToFunctions('<div><div /></div>')
    const wrapper = mountingMethod(compiled)
    const message =
      '[kdu-test-utils]: name must be called on a single wrapper, use at(i) to access a wrapper'
    expect(() => wrapper.findAll('div').name())
      .to.throw()
      .with.property('message', message)
  })

  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message = '[kdu-test-utils]: name cannot be called on 0 items'
    const fn = () =>
      mountingMethod(compiled)
        .findAll('p')
        .name('p')
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
