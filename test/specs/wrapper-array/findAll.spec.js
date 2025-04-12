import { describeWithShallowAndMount } from '~resources/utils'
import { compileToFunctions } from 'kdu-template-compiler'
import '@kdujs/test-utils'

describeWithShallowAndMount('findAll', mountingMethod => {
  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message = '[kdu-test-utils]: findAll cannot be called on 0 items'
    expect(() =>
      mountingMethod(compiled)
        .findAll('p')
        .findAll('p')
    )
      .to.throw()
      .with.property('message', message)
  })

  it('throws an error when called on a WrapperArray', () => {
    const compiled = compileToFunctions(
      '<div><div></div><div><p /></div></div>'
    )
    const wrapper = mountingMethod(compiled)
    const message =
      '[kdu-test-utils]: findAll must be called on a single wrapper, use at(i) to access a wrapper'
    expect(() => wrapper.findAll('div').findAll('div'))
      .to.throw()
      .with.property('message', message)
  })
})
