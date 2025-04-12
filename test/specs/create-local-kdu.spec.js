import Kdu from 'kdu'
import Kdux from 'kdux'
import KduRouter from 'kdu-router'
import { createLocalKdu } from '@kdujs/test-utils'
import Component from '~resources/components/component.kdu'
import ComponentWithKdux from '~resources/components/component-with-kdux.kdu'
import ComponentWithRouter from '~resources/components/component-with-router.kdu'
import { describeWithShallowAndMount } from '~resources/utils'
import { itDoNotRunIf } from 'conditional-specs'

describeWithShallowAndMount('createLocalKdu', mountingMethod => {
  it('installs Kdux without polluting global Kdu', () => {
    const localKdu = createLocalKdu()
    localKdu.use(Kdux)
    const store = new Kdux.Store({
      state: {
        test: 0
      },
      mutations: {
        increment() {}
      }
    })
    const wrapper = mountingMethod(Component, { localKdu, store })
    expect(wrapper.vm.$store).to.be.an('object')
    const freshWrapper = mountingMethod(Component)
    expect(typeof freshWrapper.vm.$store).to.equal('undefined')
  })

  it('Kdux should work properly with local Kdu', async () => {
    const localKdu = createLocalKdu()
    localKdu.use(Kdux)
    const store = new Kdux.Store({
      state: {
        count: 0
      },
      mutations: {
        increment(state) {
          state.count++
        }
      },
      modules: {
        foo: {
          state: () => ({ bar: 1 })
        }
      }
    })
    const wrapper = mountingMethod(ComponentWithKdux, { localKdu, store })
    expect(wrapper.vm.$store).to.be.an('object')
    expect(wrapper.text()).to.equal('0 1')
    wrapper.trigger('click')
    await Kdu.nextTick()
    expect(wrapper.text()).to.equal('1 1')
  })

  it('installs Router without polluting global Kdu', () => {
    const localKdu = createLocalKdu()
    localKdu.use(KduRouter)
    const routes = [{ path: '/foo', component: Component }]
    const router = new KduRouter({
      routes
    })
    const wrapper = mountingMethod(Component, { localKdu, router })
    expect(wrapper.vm.$route).to.be.an('object')
    const freshWrapper = mountingMethod(Component)
    expect(typeof freshWrapper.vm.$route).to.equal('undefined')
  })

  itDoNotRunIf(
    mountingMethod.name === 'shallowMount',
    'Router should work properly with local Kdu',
    () => {
      const localKdu = createLocalKdu()
      localKdu.use(KduRouter)
      const routes = [
        {
          path: '/',
          component: {
            render: h => h('div', 'home')
          }
        },
        {
          path: '/foo',
          component: {
            render: h => h('div', 'foo')
          }
        }
      ]
      const router = new KduRouter({
        routes
      })
      const wrapper = mountingMethod(ComponentWithRouter, { localKdu, router })
      expect(wrapper.vm.$route).to.be.an('object')

      expect(wrapper.text()).to.contain('home')

      wrapper.find('a').trigger('click')
      expect(wrapper.text()).to.contain('foo')

      const freshWrapper = mountingMethod(Component)
      expect(typeof freshWrapper.vm.$route).to.equal('undefined')
    }
  )

  it('use can take additional arguments', () => {
    const localKdu = createLocalKdu()
    const pluginOptions = { foo: 'bar' }
    const plugin = {
      install: function(_Kdu, options) {
        expect(options).to.equal(pluginOptions)
      }
    }
    localKdu.use(plugin, pluginOptions)
  })

  it('installs plugin into local Kdu regardless of previous install in Kdu', () => {
    let installCount = 0

    class Plugin {}
    Plugin.install = function(_Kdu) {
      if (_Kdu._installedPlugins) {
        expect(_Kdu._installedPlugins.indexOf(Plugin)).to.equal(-1)
      }
      installCount++
    }

    Kdu.use(Plugin)
    const localKdu = createLocalKdu()
    localKdu.use(Plugin)

    if (localKdu._installedPlugins) {
      expect(localKdu._installedPlugins.indexOf(Plugin)).to.equal(0)
    }
    expect(installCount).to.equal(2)
  })
})
