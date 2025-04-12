import { compileToFunctions } from 'kdu-template-compiler'
import ComponentWithKIf from '~resources/components/component-with-k-if.kdu'
import { describeWithShallowAndMount } from '~resources/utils'
import Kdu from 'kdu'

describeWithShallowAndMount('setData', mountingMethod => {
  it('sets component data and updates nested vm nodes', async () => {
    const wrapper = mountingMethod(ComponentWithKIf)
    const componentArr = wrapper.findAll(ComponentWithKIf)
    expect(componentArr.at(0).findAll('.child.ready').length).to.equal(0)
    componentArr.setData({ ready: true })
    await Kdu.nextTick()
    expect(componentArr.at(0).findAll('.child.ready').length).to.equal(1)
  })

  it('throws an error if node is not a Kdu instance', () => {
    const message =
      '[kdu-test-utils]: wrapper.setData() can only be called on a Kdu instance'
    const compiled = compileToFunctions('<div><p></p></div>')
    const wrapper = mountingMethod(compiled)
    const fn = () => wrapper.findAll('p').setData({ ready: true })
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })

  it('throws error if wrapper array contains no items', () => {
    const compiled = compileToFunctions('<div />')
    const message = '[kdu-test-utils]: setData cannot be called on 0 items'
    const fn = () =>
      mountingMethod(compiled)
        .findAll('p')
        .setData('p')
    expect(fn)
      .to.throw()
      .with.property('message', message)
  })
})
