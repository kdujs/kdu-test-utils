import Kdux from 'kdux'
import { shallowMount, createLocalKdu } from '../'
import { normalOptions, functionalOptions, ClassComponent } from './resources'

/**
 * Should create wrapper vm based on (function) component options or constructors
 * The users can specify component type via the type parameter
 */
const normalWrapper = shallowMount(normalOptions)
const normalFoo: string = normalWrapper.vm.foo

const classWrapper = shallowMount(ClassComponent)
const classFoo: string = classWrapper.vm.bar

const functinalWrapper = shallowMount(functionalOptions)

/**
 * Test for shallowMount options
 */
const localKdu = createLocalKdu()
localKdu.use(Kdux)

const store = new Kdux.Store({})

shallowMount(ClassComponent, {
  attachToDocument: true,
  localKdu,
  mocks: {
    $store: store
  },
  slots: {
    default: `<div>Foo</div>`,
    foo: [normalOptions, functionalOptions],
    baz: ClassComponent
  },
  scopedSlots: {
    scopedFoo: `<div>scopedFoo</div>`,
    scopedBaz() {
      return `<div>scopedBaz</div>`;
    },
  },
  stubs: {
    foo: normalOptions,
    bar: functionalOptions,
    baz: ClassComponent,
    qux: `<div>Test</div>`
  }
})

shallowMount(functionalOptions, {
  context: {
    props: { foo: 'test' }
  },
  stubs: ['child']
})

/**
 * ShallowMountOptions should receive Kdu's component options
 */
shallowMount(ClassComponent, {
  propsData: {
    test: 'test'
  },
  created () {
    this.bar
  }
})
