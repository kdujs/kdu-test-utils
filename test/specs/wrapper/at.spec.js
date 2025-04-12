import { compileToFunctions } from 'kdu-template-compiler'
import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('at', mountingMethod => {
  it('throws an error', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    const message = '[kdu-test-utils]: at() must be called on a WrapperArray'
    const fn = () => wrapper.at()
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
