import Kdu, { KNodeData, ComponentOptions, FunctionalComponentOptions } from 'kdu'

// TODO: use core repo's Component type
export type Component =
  | typeof Kdu
  | FunctionalComponentOptions<{}>
  | ComponentOptions<never, {}, {}, {}, {}>

/**
 * Utility type to declare an extended Kdu constructor
 */
type KduClass<V extends Kdu> = (new (...args: any[]) => V) & typeof Kdu

/**
 * Utility type for a selector
 */
type Selector = string | Component

/**
 * Utility type for slots
 */
type Slots = {
  [key: string]: (Component | string)[] | Component | string
}

/**
 * Utility type for stubs which can be a string of template as a shorthand
 * If it is an array of string, the specified children are replaced by blank components
 */
type Stubs = {
  [key: string]: Component | string | true
} | string[]

/**
 * Utility type for ref options object that can be used as a Selector
 */
type RefSelector = {
  ref: string
}

/**
 * Base class of Wrapper and WrapperArray
 * It has common methods on both Wrapper and WrapperArray
 */
interface BaseWrapper {
  contains (selector: Selector): boolean
  exists (): boolean
  visible (): boolean

  attributes(): { [name: string]: string } | void
  classes(): Array<string> | void
  props(): { [name: string]: any } | void

  hasAttribute (attribute: string, value: string): boolean
  hasClass (className: string): boolean
  hasProp (prop: string, value: any): boolean
  hasStyle (style: string, value: string): boolean

  is (selector: Selector): boolean
  isEmpty (): boolean
  isKduInstance (): boolean

  update (): void
  setComputed (computed: object): void
  setData (data: object): void
  setMethods (data: object): void
  setProps (props: object): void
  trigger (eventName: string, options?: object): void
  destroy (): void
}

interface Wrapper<V extends Kdu> extends BaseWrapper {
  readonly vm: V
  readonly element: HTMLElement
  readonly options: WrapperOptions

  find<R extends Kdu> (selector: KduClass<R>): Wrapper<R>
  find<R extends Kdu> (selector: ComponentOptions<R>): Wrapper<R>
  find (selector: FunctionalComponentOptions): Wrapper<Kdu>
  find (selector: string): Wrapper<Kdu>
  find (selector: RefSelector): Wrapper<Kdu>

  findAll<R extends Kdu> (selector: KduClass<R>): WrapperArray<R>
  findAll<R extends Kdu> (selector: ComponentOptions<R>): WrapperArray<R>
  findAll (selector: FunctionalComponentOptions): WrapperArray<Kdu>
  findAll (selector: string): WrapperArray<Kdu>
  findAll (selector: RefSelector): WrapperArray<Kdu>

  html (): string
  text (): string
  name (): string

  emitted (event?: string): { [name: string]: Array<Array<any>> }
  emittedByOrder (): Array<{ name: string, args: Array<any> }>
}

interface WrapperArray<V extends Kdu> extends BaseWrapper {
  readonly length: number
  readonly wrappers: Array<Wrapper<V>>

  at (index: number): Wrapper<V>
  filter (predicate: Function): WrapperArray<Kdu>
}

interface WrapperOptions {
  attachedToDocument: boolean
}

interface MountOptions<V extends Kdu> extends ComponentOptions<V> {
  attachToDocument?: boolean
  context?: KNodeData
  localKdu?: typeof Kdu
  mocks?: object
  slots?: Slots
  stubs?: Stubs,
  attrs?: object
  listeners?: object
}

type ThisTypedMountOptions<V extends Kdu> = MountOptions<V> & ThisType<V>

type ShallowOptions<V extends Kdu> = MountOptions<V>

type ThisTypedShallowOptions<V extends Kdu> = ShallowOptions<V> & ThisType<V>

interface KduTestUtilsConfigOptions {
  stubs?: Stubs
}

export declare function createLocalKdu (): typeof Kdu
export declare let config: KduTestUtilsConfigOptions

export declare function mount<V extends Kdu> (component: KduClass<V>, options?: ThisTypedMountOptions<V>): Wrapper<V>
export declare function mount<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedMountOptions<V>): Wrapper<V>
export declare function mount (component: FunctionalComponentOptions, options?: MountOptions<Kdu>): Wrapper<Kdu>

export declare function shallow<V extends Kdu> (component: KduClass<V>, options?: ThisTypedShallowOptions<V>): Wrapper<V>
export declare function shallow<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedShallowOptions<V>): Wrapper<V>
export declare function shallow (component: FunctionalComponentOptions, options?: ShallowOptions<Kdu>): Wrapper<Kdu>

export declare let TransitionStub: Component | string | true
export declare let TransitionGroupStub: Component | string | true
