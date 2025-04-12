import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('ErrorWrapper', mountingMethod => {
  const methods = [
    'at',
    'attributes',
    'classes',
    'contains',
    'emitted',
    'emittedByOrder',
    'hasAttribute',
    'hasClass',
    'hasProp',
    'hasStyle',
    'find',
    'findAll',
    'filter',
    'html',
    'text',
    'is',
    'isEmpty',
    'isVisible',
    'isKduInstance',
    'name',
    'overview',
    'props',
    'setComputed',
    'setMethods',
    'setData',
    'setProps',
    'setChecked',
    'setSelected',
    'setValue',
    'trigger',
    'destroy'
  ]
  methods.forEach(method => {
    it(`${method} throws error when called`, () => {
      const TestComponent = {
        template: '<p />'
      }
      const selector = 'div'
      const message = `[kdu-test-utils]: find did not return ${selector}, cannot call ${method}() on empty Wrapper`
      const wrapper = mountingMethod(TestComponent)
      const error = wrapper.find(selector)
      expect(error.constructor.name).to.equal('ErrorWrapper')
      expect(() => error[method]())
        .to.throw()
        .with.property('message', message)
    })
  })
})
