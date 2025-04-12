import { compileToFunctions } from 'kdu-template-compiler'
import Component from '~resources/components/component.kdu'
import ComponentAsAClass from '~resources/components/component-as-a-class.kdu'
import { kduVersion, describeWithShallowAndMount } from '~resources/utils'

describeWithShallowAndMount('html', mountingMethod => {
  it('returns a KduWrappers HTML as a string', () => {
    const expectedHtml = '<div></div>'
    const wrapper = mountingMethod(Component)
    expect(wrapper.html()).to.equal(expectedHtml)
  })

  it('returns a KduWrappers HTML as a string when component has no render function', () => {
    if (mountingMethod.name === 'shallowMount') return
    const wrapper = mountingMethod({
      template: `<div>1<tester></tester></div>`,
      components: {
        tester: {
          template: `<div class="tester">test</div>`
        }
      }
    })
    const expectedHtml = '<div>1<div class="tester">test</div>\n' + '</div>'
    expect(wrapper.html()).to.equal(expectedHtml)
  })

  it('handles class component', () => {
    if (kduVersion < 2.3) {
      return
    }
    const wrapper = mountingMethod(ComponentAsAClass)
    expect(wrapper.html()).to.equal('<div></div>')
  })

  it('returns a Wrappers HTML as a pretty printed string', () => {
    const expectedHtml =
      '<body>\n' +
      '  <div>\n' +
      '    <ul>\n' +
      '      <li></li>\n' +
      '      <li></li>\n' +
      '    </ul>\n' +
      '  </div>\n' +
      '</body>'

    const compiled = compileToFunctions(expectedHtml)
    const wrapper = mountingMethod(compiled)
    expect(wrapper.html()).to.equal(expectedHtml)
  })
})
