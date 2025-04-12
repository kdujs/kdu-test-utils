import { compileToFunctions } from 'kdu-template-compiler'
import ComponentWithChild from '~resources/components/component-with-child.kdu'
import Component from '~resources/components/component.kdu'
import ComponentWithoutName from '~resources/components/component-without-name.kdu'
import FunctionalComponent from '~resources/components/functional-component.kdu'
import ComponentAsAClass from '~resources/components/component-as-a-class.kdu'
import {
  functionalSFCsSupported,
  describeWithShallowAndMount
} from '~resources/utils'

describeWithShallowAndMount('is', mountingMethod => {
  it('returns true if root node matches tag selector', () => {
    const compiled = compileToFunctions('<input />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('input')).to.equal(true)
  })

  it('returns true if root node matches class selector', () => {
    const compiled = compileToFunctions('<div class="div" />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('.div')).to.equal(true)
  })

  it('returns true if root node matches id selector', () => {
    const compiled = compileToFunctions('<div id="div" />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('#div')).to.equal(true)
  })

  it('returns true if root node matches Kdu Component selector', () => {
    const wrapper = mountingMethod(ComponentWithChild)
    const component = wrapper.findAll(Component).at(0)
    expect(component.is(Component)).to.equal(true)
  })

  it('returns true if root node matches Component', () => {
    const wrapper = mountingMethod(Component)
    expect(wrapper.is(Component)).to.equal(true)
  })

  it('returns true if root node matches Component without a name', () => {
    const wrapper = mountingMethod(ComponentWithoutName)
    expect(wrapper.is(ComponentWithoutName)).to.equal(true)
  })

  it('works correctly with innerHTML', () => {
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
    expect(wrapper.find('svg').is('svg')).to.equal(true)
  })

  it('returns true if root node matches functional Component', () => {
    if (!functionalSFCsSupported) {
      return
    }
    const wrapper = mountingMethod(FunctionalComponent)
    expect(wrapper.is(FunctionalComponent)).to.equal(true)
  })

  it('returns true if root node matches Component extending class component', () => {
    const wrapper = mountingMethod(ComponentAsAClass, {
      mocks: false,
      stubs: false
    })

    expect(wrapper.is(ComponentAsAClass)).to.equal(true)
  })

  it('returns false if root node is not a Kdu Component', () => {
    const wrapper = mountingMethod(ComponentWithChild)
    const input = wrapper.findAll('span').at(0)
    expect(input.is(Component)).to.equal(false)
  })

  it('returns false if root node does not match tag selector', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('p')).to.equal(false)
  })

  it('returns false if root node does not match class selector', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('.p')).to.equal(false)
  })

  it('returns false if root node does not match id selector', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    expect(wrapper.is('#p')).to.equal(false)
  })

  it('throws error if ref options object is passed', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)

    const message =
      '[kdu-test-utils]: $ref selectors can not be used with wrapper.is()'
    const fn = () => wrapper.is({ ref: 'foo' })
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })

  it('throws an error if selector is not a valid selector', () => {
    const compiled = compileToFunctions('<div />')
    const wrapper = mountingMethod(compiled)
    const invalidSelectors = [
      undefined,
      null,
      NaN,
      0,
      2,
      true,
      false,
      () => {},
      {},
      { name: undefined },
      { ref: 'foo', nope: true },
      []
    ]
    invalidSelectors.forEach(invalidSelector => {
      const message =
        '[kdu-test-utils]: wrapper.is() must be passed a valid CSS selector, Kdu constructor, or valid find option object'
      const fn = () => wrapper.is(invalidSelector)
      expect(fn)
        .to.throw()
        .with.property('message', message)
    })
  })
})
