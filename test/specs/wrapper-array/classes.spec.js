import { describeWithShallowAndMount } from '~resources/utils'
import '@kdujs/test-utils'

describeWithShallowAndMount('classes', mountingMethod => {
  it('throws error if wrapper array contains no items', () => {
    const TestComponent = {
      template: '<div />'
    }
    const message = '[kdu-test-utils]: classes cannot be called on 0 items'
    expect(() =>
      mountingMethod(TestComponent)
        .findAll('p')
        .classes('p')
    )
      .to.throw()
      .with.property('message', message)
  })

  it('throws error when called on a WrapperArray', () => {
    const TestComponent = {
      template: '<div><div /></div>'
    }
    const wrapper = mountingMethod(TestComponent)
    const message =
      '[kdu-test-utils]: classes must be called on a single wrapper, use at(i) to access a wrapper'
    const fn = () => wrapper.findAll('div').classes()
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
