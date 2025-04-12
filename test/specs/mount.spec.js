import Kdu from 'kdu'
import { compileToFunctions } from 'kdu-template-compiler'
import { mount, createLocalKdu } from '@kdujs/test-utils'
import Component from '~resources/components/component.kdu'
import ComponentWithProps from '~resources/components/component-with-props.kdu'
import ComponentWithMixin from '~resources/components/component-with-mixin.kdu'
import ComponentAsAClass from '~resources/components/component-as-a-class.kdu'
import { injectSupported, kduVersion } from '~resources/utils'
import { describeRunIf, itDoNotRunIf, itSkipIf } from 'conditional-specs'
import Kdux from 'kdux'

describeRunIf(process.env.TEST_ENV !== 'node', 'mount', () => {
  const sandbox = sinon.createSandbox()
  const windowSave = window

  beforeEach(() => {
    sandbox.stub(console, 'error').callThrough()
  })

  afterEach(() => {
    window = windowSave // eslint-disable-line no-native-reassign
    sandbox.reset()
    sandbox.restore()
  })

  it('returns new KduWrapper with mounted Kdu instance if no options are passed', () => {
    const compiled = compileToFunctions('<div><input /></div>')
    const wrapper = mount(compiled)
    expect(wrapper.vm).to.be.an('object')
  })

  it('handles root functional component', () => {
    const TestComponent = {
      functional: true,
      render(h) {
        return h('div', [h('p'), h('p')])
      }
    }

    const wrapper = mount(TestComponent)
    expect(wrapper.findAll('p').length).to.equal(2)
  })

  it('returns new KduWrapper with correct props data', () => {
    const prop1 = { test: 'TEST' }
    const wrapper = mount(ComponentWithProps, { propsData: { prop1 } })
    expect(wrapper.vm).to.be.an('object')
    if (wrapper.vm.$props) {
      expect(wrapper.vm.$props.prop1).to.equal(prop1)
    } else {
      expect(wrapper.vm.$options.propsData.prop1).to.equal(prop1)
    }
  })

  itDoNotRunIf(
    kduVersion < 2.3,
    'handles propsData for extended components',
    () => {
      const prop1 = 'test'
      const TestComponent = Kdu.extend(ComponentWithProps)
      const wrapper = mount(TestComponent, {
        propsData: {
          prop1
        }
      })
      expect(wrapper.text()).to.contain(prop1)
    }
  )

  it('handles uncompiled extended Kdu component', () => {
    const BaseComponent = {
      template: '<div />'
    }
    const TestComponent = {
      extends: BaseComponent
    }
    const wrapper = mount(TestComponent)
    expect(wrapper.findAll('div').length).to.equal(1)
  })

  it('handles nested uncompiled extended Kdu component', () => {
    const BaseComponent = {
      template: '<div />'
    }
    const TestComponentA = {
      extends: BaseComponent
    }
    const TestComponentB = {
      extends: TestComponentA
    }
    const TestComponentC = {
      extends: TestComponentB
    }
    const TestComponentD = {
      extends: TestComponentC
    }
    const wrapper = mount(TestComponentD)
    expect(wrapper.findAll('div').length).to.equal(1)
  })

  itSkipIf(
    kduVersion < 2.3,
    'handles extended components added to Kdu constructor',
    () => {
      const ChildComponent = Kdu.extend({
        render: h => h('div'),
        mounted() {
          this.$route.params
        }
      })
      Kdu.component('child-component', ChildComponent)
      const TestComponent = {
        template: '<child-component />'
      }
      let wrapper
      try {
        wrapper = mount(TestComponent, {
          mocks: {
            $route: {}
          }
        })
      } catch (err) {
      } finally {
        delete Kdu.options.components['child-component']
        expect(wrapper.find(ChildComponent).exists()).to.equal(true)
      }
    }
  )

  it('does not use cached component', () => {
    sandbox.stub(ComponentWithMixin.methods, 'someMethod')
    mount(ComponentWithMixin)
    expect(ComponentWithMixin.methods.someMethod.callCount).to.equal(1)
    ComponentWithMixin.methods.someMethod.restore()
    sandbox.stub(ComponentWithMixin.methods, 'someMethod')
    mount(ComponentWithMixin)
    expect(ComponentWithMixin.methods.someMethod.callCount).to.equal(1)
  })

  it('throws an error if window is undefined', () => {
    if (
      !(navigator.userAgent.includes && navigator.userAgent.includes('node.js'))
    ) {
      return
    }

    const message =
      '[kdu-test-utils]: window is undefined, kdu-test-utils needs to be run in a browser environment.\n You can run the tests in node using JSDOM'
    window = undefined // eslint-disable-line no-native-reassign

    expect(() => mount(compileToFunctions('<div />')))
      .to.throw()
      .with.property('message', message)
  })

  it('compiles inline templates', () => {
    const wrapper = mount({
      template: `<div>foo</div>`
    })
    expect(wrapper.vm).to.be.an('object')
    expect(wrapper.html()).to.equal(`<div>foo</div>`)
  })

  itDoNotRunIf(
    !(navigator.userAgent.includes && navigator.userAgent.includes('node.js')),
    'compiles templates from querySelector',
    () => {
      const template = window.createElement('div')
      template.setAttribute('id', 'foo')
      template.innerHTML = '<div>foo</div>'
      window.document.body.appendChild(template)

      const wrapper = mount({
        template: '#foo'
      })
      expect(wrapper.vm).to.be.an('object')
      expect(wrapper.html()).to.equal(`<div>foo</div>`)

      window.body.removeChild(template)
    }
  )

  itDoNotRunIf(kduVersion < 2.3, 'overrides methods', () => {
    const stub = sandbox.stub()
    const TestComponent = Kdu.extend({
      template: '<div />',
      methods: {
        callStub() {
          stub()
        }
      }
    })
    mount(TestComponent, {
      methods: {
        callStub() {}
      }
    }).vm.callStub()

    expect(stub).not.called
  })

  it.skip('overrides component prototype', () => {
    const mountSpy = sandbox.spy()
    const destroySpy = sandbox.spy()
    const Component = Kdu.extend({})
    const {
      $mount: originalMount,
      $destroy: originalDestroy
    } = Component.prototype
    Component.prototype.$mount = function(...args) {
      originalMount.apply(this, args)
      mountSpy()
      return this
    }
    Component.prototype.$destroy = function() {
      originalDestroy.apply(this)
      destroySpy()
    }

    const wrapper = mount(Component)
    expect(mountSpy).called
    expect(destroySpy).not.called
    wrapper.destroy()
    expect(destroySpy).called
  })

  // Problems accessing options of twice extended components in Kdu < 2.3
  itDoNotRunIf(kduVersion < 2.3, 'compiles extended components', () => {
    const TestComponent = Kdu.component('test-component', {
      template: '<div></div>'
    })
    const wrapper = mount(TestComponent)
    expect(wrapper.html()).to.equal(`<div></div>`)
  })

  itDoNotRunIf(
    kduVersion < 2.4, // auto resolve of default export added in 2.4
    'handles components as dynamic imports',
    done => {
      const TestComponent = {
        template: '<div><async-component /></div>',
        components: {
          AsyncComponent: () => import('~resources/components/component.kdu')
        }
      }
      const wrapper = mount(TestComponent)
      setTimeout(() => {
        expect(wrapper.find(Component).exists()).to.equal(true)
        done()
      })
    }
  )

  it('deletes mounting options before passing options to component', () => {
    const wrapper = mount(
      {
        template: '<div />'
      },
      {
        provide: {
          prop: 'val'
        },
        attachToDocument: 'attachToDocument',
        mocks: {
          prop: 'val'
        },
        slots: {
          prop: Component
        },
        localKdu: createLocalKdu(),
        stubs: {
          prop: { template: '<div />' }
        },
        attrs: {
          prop: 'val'
        },
        listeners: {
          prop: 'val'
        }
      }
    )
    if (injectSupported) {
      expect(typeof wrapper.vm.$options.provide).to.equal(
        kduVersion < 2.5 ? 'function' : 'object'
      )
    }

    expect(wrapper.vm.$options.attachToDocument).to.equal(undefined)
    expect(wrapper.vm.$options.mocks).to.equal(undefined)
    expect(wrapper.vm.$options.slots).to.equal(undefined)
    expect(wrapper.vm.$options.localKdu).to.equal(undefined)
    expect(wrapper.vm.$options.stubs).to.equal(undefined)
    expect(wrapper.vm.$options.context).to.equal(undefined)
    expect(wrapper.vm.$options.attrs).to.equal(undefined)
    expect(wrapper.vm.$options.listeners).to.equal(undefined)
    wrapper.destroy()
  })

  itDoNotRunIf(kduVersion < 2.3, 'injects store correctly', () => {
    const localKdu = createLocalKdu()
    localKdu.use(Kdux)
    const store = new Kdux.Store()
    const wrapper = mount(ComponentAsAClass, {
      store,
      localKdu
    })
    wrapper.vm.getters
    mount(
      {
        template: '<div>{{$store.getters}}</div>'
      },
      { store, localKdu }
    )
  })

  it('propagates errors when they are thrown', () => {
    const TestComponent = {
      template: '<div></div>',
      mounted: function() {
        throw new Error('Error in mounted')
      }
    }

    const fn = () => mount(TestComponent)
    expect(fn).to.throw('Error in mounted')
  })

  it('propagates errors when they are thrown by a nested component', () => {
    const childComponent = {
      template: '<div></div>',
      mounted: function() {
        throw new Error('Error in mounted')
      }
    }
    const rootComponent = {
      render: function(h) {
        return h('div', [h(childComponent)])
      }
    }

    const fn = () => {
      mount(rootComponent)
    }

    expect(fn).to.throw('Error in mounted')
  })

  it('adds unused propsData as attributes', () => {
    const wrapper = mount(ComponentWithProps, {
      attachToDocument: true,
      propsData: {
        prop1: 'prop1',
        extra: 'attr'
      },
      attrs: {
        height: '50px'
      }
    })

    if (kduVersion > 2.3) {
      expect(wrapper.vm.$attrs).to.eql({ height: '50px', extra: 'attr' })
    }

    expect(wrapper.html()).to.equal(
      '<div height="50px" extra="attr">\n' +
        '  <p class="prop-1">prop1</p>\n' +
        '  <p class="prop-2"></p>\n' +
        '</div>'
    )
    wrapper.destroy()
  })

  it('overwrites the component options with the instance options', () => {
    const Component = {
      template: '<div>{{ foo() }}{{ bar() }}{{ baz() }}</div>',
      methods: {
        foo() {
          return 'a'
        },
        bar() {
          return 'b'
        }
      }
    }
    const options = {
      methods: {
        bar() {
          return 'B'
        },
        baz() {
          return 'C'
        }
      }
    }
    const wrapper = mount(Component, options)
    expect(wrapper.text()).to.equal('aBC')
  })

  it('handles inline components', () => {
    const ChildComponent = {
      render(h) {
        h('p', this.$route.params)
      }
    }
    const TestComponent = {
      render: h => h(ChildComponent)
    }
    const localKdu = createLocalKdu()
    localKdu.prototype.$route = {}
    const wrapper = mount(TestComponent, {
      localKdu
    })
    expect(wrapper.findAll(ChildComponent).length).to.equal(1)
  })

  it('handles nested components with extends', () => {
    const GrandChildComponent = {
      template: '<div />',
      created() {
        this.$route.params
      }
    }
    const ChildComponent = Kdu.extend({
      template: '<grand-child-component />',
      components: {
        GrandChildComponent
      }
    })
    const TestComponent = {
      template: '<child-component />',
      components: {
        ChildComponent
      }
    }
    const localKdu = createLocalKdu()
    localKdu.prototype.$route = {}
    mount(TestComponent, {
      localKdu
    })
  })

  itDoNotRunIf.skip(
    kduVersion >= 2.5,
    'throws if component throws during update',
    () => {
      const TestComponent = {
        template: '<div :p="a" />',
        updated() {
          throw new Error('err')
        },
        data: () => ({
          a: 1
        })
      }
      const wrapper = mount(TestComponent)
      const fn = () => {
        wrapper.vm.a = 2
      }
      expect(fn).to.throw()
      wrapper.destroy()
    }
  )
})
