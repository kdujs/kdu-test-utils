import { describeWithShallowAndMount } from '~resources/utils'
import Kdu from 'kdu'

describeWithShallowAndMount('setChecked', mountingMethod => {
  it('sets value to the input elements of type checkbox or radio', async () => {
    const wrapper = mountingMethod({
      data() {
        return {
          t1: false,
          t2: ''
        }
      },
      template: `
        <div>
          <input type="checkbox" name="t1" class="foo" k-model="t1" />
          <input type="radio" name="t2" class="foo" value="foo" k-model="t2"/>
          <input type="radio" name="t2" class="bar" value="bar" k-model="t2"/>
        </div>`
    })
    const wrapperArray = wrapper.findAll('.foo')
    expect(wrapper.vm.t1).to.equal(false)
    expect(wrapper.vm.t2).to.equal('')
    wrapperArray.setChecked()
    await Kdu.nextTick()
    expect(wrapper.vm.t1).to.equal(true)
    expect(wrapper.vm.t2).to.equal('foo')
    expect(wrapperArray.at(0).element.checked).to.equal(true)
    expect(wrapperArray.at(1).element.checked).to.equal(true)
  })
})
