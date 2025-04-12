import Kdu, { ComponentOptions, FunctionalComponentOptions } from 'kdu'

/**
 * Normal component options
 */
export interface Normal extends Kdu {
  foo: string
}
export const normalOptions: ComponentOptions<Normal> = {
  name: 'normal',
  data () {
    return {
      foo: 'bar'
    }
  }
}

/**
 * Functional component options
 */
export const functionalOptions: FunctionalComponentOptions = {
  functional: true,
  render (h) {
    return h('div')
  }
}

/**
 * Component constructor declared with kdu-class-component etc.
 */
export class ClassComponent extends Kdu {
  bar = 'bar'
}
