import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('KduWrapper', mountingMethod => {
  ;['knode', 'element', 'vm', 'options'].forEach(property => {
    it(`has the ${property} property which is read-only`, () => {
      const wrapper = mountingMethod({ template: '<div><p></p></div>' })
      expect(wrapper.constructor.name).to.equal('KduWrapper')
      const message = `[kdu-test-utils]: wrapper.${property} is read-only`
      expect(() => {
        wrapper[property] = 'foo'
      })
        .to.throw()
        .with.property('message', message)
    })
  })
})
