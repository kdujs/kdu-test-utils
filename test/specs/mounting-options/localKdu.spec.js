import Kdu from 'kdu'
import {
  describeWithShallowAndMount,
  isRunningPhantomJS,
  kduVersion
} from '~resources/utils'
import { createLocalKdu, shallowMount, mount } from '@kdujs/test-utils'
import { itSkipIf, itRunIf, itDoNotRunIf } from 'conditional-specs'
import Kdux from 'kdux'

describeWithShallowAndMount('options.localKdu', mountingMethod => {
  itSkipIf(
    isRunningPhantomJS,
    'mounts component using passed localKdu as base Kdu',
    () => {
      const TestComponent = {
        template: `<div>{{test}}</div>`
      }
      const localKdu = createLocalKdu()
      localKdu.prototype.test = 'some value'
      const wrapper = mountingMethod(TestComponent, {
        localKdu
      })
      expect(wrapper.html()).to.contain('some value')
    }
  )

  itSkipIf(kduVersion < 2.3, 'works correctly with extended children', () => {
    const localKdu = createLocalKdu()
    localKdu.use(Kdux)
    const store = new Kdux.Store({
      state: { val: 2 }
    })
    const ChildComponent = Kdu.extend({
      template: '<span>{{val}}</span>',
      computed: {
        val() {
          return this.$store.state.val
        }
      }
    })
    const TestComponent = {
      template: '<div><child-component /></div>',
      components: {
        ChildComponent
      }
    }
    const wrapper = mountingMethod(TestComponent, {
      localKdu,
      store
    })
    const HTML =
      mountingMethod.name === 'renderToString' ? wrapper : wrapper.html()
    if (mountingMethod.name === 'shallowMount') {
      expect(HTML).to.not.contain('2')
    } else {
      expect(HTML).to.contain('2')
    }
  })

  itSkipIf(kduVersion < 2.3, 'is applied to deeply extended components', () => {
    const GrandChildComponent = Kdu.extend({
      template: '<div>{{$route.params}}</div>'
    })
    const ChildComponent = Kdu.extend({
      template: '<div><grand-child-component />{{$route.params}}</div>',
      components: {
        GrandChildComponent
      }
    })
    const TestComponent = Kdu.extend({
      template: '<child-component />',
      components: { ChildComponent }
    })
    const localKdu = createLocalKdu()
    localKdu.prototype.$route = {}

    mountingMethod(TestComponent, {
      localKdu
    })
  })

  it('is applied to components that extend from other components', () => {
    const localKdu = createLocalKdu()
    localKdu.prototype.$route = {}

    const Extends = {
      template: '<div />',
      created() {
        this.$route.params
      }
    }
    const TestComponent = {
      extends: Extends
    }
    mountingMethod(TestComponent, {
      localKdu
    })
  })

  itSkipIf(kduVersion < 2.3, 'is applied to mixed extended components', () => {
    const BaseGrandChildComponent = {
      created() {
        this.$route.params
      }
    }
    const GrandChildComponent = {
      created() {
        this.$route.params
      },
      template: '<div/>',
      extends: BaseGrandChildComponent
    }
    const ChildComponent = Kdu.extend({
      template: '<div><grand-child-component />{{$route.params}}</div>',
      components: {
        GrandChildComponent
      }
    })
    const TestComponent = Kdu.extend({
      template: '<div><child-component /></div>',
      components: { ChildComponent }
    })
    const localKdu = createLocalKdu()
    localKdu.prototype.$route = {}

    mountingMethod(TestComponent, {
      localKdu
    })
  })

  it('does not add created mixin to localKdu', () => {
    const localKdu = createLocalKdu()
    mountingMethod(
      { render: () => {} },
      {
        localKdu
      }
    )
    expect(localKdu.options.created).to.equal(undefined)
  })

  it('handles merging Kdu instances', () => {
    const localKdu = createLocalKdu()
    localKdu.use(_Kdu => {
      _Kdu.$el = new _Kdu()
    })
    mountingMethod(
      { template: '<div />' },
      {
        localKdu
      }
    )
  })

  itRunIf(
    kduVersion < 2.3,
    'throws an error if used with an extended component in Kdu 2.3',
    () => {
      const TestComponent = Kdu.extend({
        template: '<div></div>'
      })
      const message =
        `[kdu-test-utils]: options.localKdu is not supported for components ` +
        `created with Kdu.extend in Kdu < 2.3. You can set localKdu to false ` +
        `to mount the component.`

      const fn = () =>
        mountingMethod(TestComponent, {
          localKdu: createLocalKdu(),
          stubs: false,
          mocks: false
        })
      expect(fn)
        .to.throw()
        .with.property('message', message)
    }
  )

  itDoNotRunIf(
    kduVersion < 2.3,
    'is applied to inline constructor functions',
    () => {
      const ChildComponent = Kdu.extend({
        render(h) {
          h('p', this.$route.params)
        }
      })
      const TestComponent = {
        render: h => h(ChildComponent)
      }
      const localKdu = createLocalKdu()
      localKdu.prototype.$route = {}
      const wrapper = mountingMethod(TestComponent, {
        localKdu
      })
      if (mountingMethod.name === 'renderToString') {
        return
      }
      expect(wrapper.findAll(ChildComponent).length).to.equal(1)
    }
  )

  itRunIf(
    mountingMethod.name === 'mount',
    'does not affect future tests',
    () => {
      const ChildComponent = {
        template: '<span></span>'
      }
      const TestComponent = {
        template: '<child-component />',
        components: { ChildComponent }
      }
      const localKdu = createLocalKdu()
      localKdu.use(Kdux)
      shallowMount(TestComponent, { localKdu })
      const wrapper = mount(TestComponent, { localKdu })
      expect(wrapper.html()).to.contain('span')
    }
  )
})
