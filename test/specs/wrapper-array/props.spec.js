import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'kdu-template-compiler'
import '@kdujs/test-utils'

describeWithShallowAndMount('props', mountingMethod => {
  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message = '[kdu-test-utils]: props cannot be called on 0 items'
    expect(() =>
      mountingMethod(compiled)
        .findAll('p')
        .props('p')
    )
      .to.throw()
      .with.property('message', message)
  })

  it('throws error when called on a WrapperArray', () => {
    const compiled = compileToFunctions('<div><div /></div>')
    const wrapper = mountingMethod(compiled)
    const message =
      '[kdu-test-utils]: props must be called on a single wrapper, use at(i) to access a wrapper'
    const fn = () => wrapper.findAll('div').props()
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
