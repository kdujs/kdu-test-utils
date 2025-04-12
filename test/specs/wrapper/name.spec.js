import { compileToFunctions } from 'kdu-template-compiler'
import Component from '~resources/components/component.kdu'
import { describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('name', mountingMethod => {
  it('returns the name of the component it was called on', () => {
    const wrapper = mountingMethod(Component)
    expect(wrapper.name()).to.equal('test-component')
  })

  it('returns the name of the tag if there is no knode', () => {
    const TestComponent = {
      render(createElement) {
        return createElement('div', {
          domProps: {
            innerHTML: '<svg></svg>'
          }
        })
      }
    }
    const wrapper = mountingMethod(TestComponent)
    expect(wrapper.find('svg').name()).to.equal('svg')
  })

  it('returns the tag name of the element if it is not a Kdu component', () => {
    const compiled = compileToFunctions('<div><p /></div>')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.find('p').name()).to.equal('p')
  })
})
