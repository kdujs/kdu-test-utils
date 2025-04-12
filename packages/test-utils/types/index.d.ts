import Kdu, { KNodeData, ComponentOptions, FunctionalComponentOptions, Component } from 'kdu'
import { DefaultProps, PropsDefinition } from 'kdu/types/options'

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
  [key: string]: Component | string | boolean
} | string[]

/**
 * Utility type for ref options object that can be used as a Selector
 */
type RefSelector = {
  ref: string
}

/**
 * Utility type for name options object that can be used as a Selector
 */
type NameSelector = {
  name: string
}

/**
 * Base class of Wrapper and WrapperArray
 * It has common methods on both Wrapper and WrapperArray
 */
interface BaseWrapper {
  contains (selector: Selector): boolean
  exists (): boolean
  isVisible (): boolean

  attributes(): { [name: string]: string }
  attributes(key: string): string | void
  classes(): Array<string>
  classes(className: string): boolean
  props(): { [name: string]: any }
  props(key: string): any | void

  is (selector: Selector): boolean
  isEmpty (): boolean
  isKduInstance (): boolean

  setData (data: object): Promise<void> | void
  setMethods (data: object): void
  setProps (props: object): Promise<void> | void

  setValue (value: any): Promise<void> | void
  setChecked (checked?: boolean): Promise<void> | void
  setSelected (): Promise<void> | void

  trigger (eventName: string, options?: object): Promise<void> | void
  destroy (): void
  selector: Selector | void
}

export interface Wrapper<V extends Kdu | null> extends BaseWrapper {
  readonly vm: V
  readonly element: HTMLElement
  readonly options: WrapperOptions

  get<R extends Kdu> (selector: KduClass<R>): Wrapper<R>
  get<R extends Kdu> (selector: ComponentOptions<R>): Wrapper<R>
  get<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(selector: FunctionalComponentOptions<Props, PropDefs>): Wrapper<Kdu>
  get (selector: string): Wrapper<Kdu>
  get (selector: RefSelector): Wrapper<Kdu>
  get (selector: NameSelector): Wrapper<Kdu>

  find<R extends Kdu> (selector: KduClass<R>): Wrapper<R>
  find<R extends Kdu> (selector: ComponentOptions<R>): Wrapper<R>
  find<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(selector: FunctionalComponentOptions<Props, PropDefs>): Wrapper<Kdu>
  find (selector: string): Wrapper<Kdu>
  find (selector: RefSelector): Wrapper<Kdu>
  find (selector: NameSelector): Wrapper<Kdu>

  findAll<R extends Kdu> (selector: KduClass<R>): WrapperArray<R>
  findAll<R extends Kdu> (selector: ComponentOptions<R>): WrapperArray<R>
  findAll<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(selector: FunctionalComponentOptions<Props, PropDefs>): WrapperArray<Kdu>
  findAll (selector: string): WrapperArray<Kdu>
  findAll (selector: RefSelector): WrapperArray<Kdu>
  findAll (selector: NameSelector): WrapperArray<Kdu>

  html (): string
  text (): string
  name (): string

  emitted (): { [name: string]: Array<Array<any>>|undefined }
  emitted (event: string): Array<any>|undefined
  emittedByOrder (): Array<{ name: string, args: Array<any> }>
}

export interface WrapperArray<V extends Kdu> extends BaseWrapper {
  readonly length: number;
  readonly wrappers: Array<Wrapper<V>>;

  at(index: number): Wrapper<V>;
  filter(
    predicate: (
      value: Wrapper<V>,
      index: number,
      array: Wrapper<V>[]
    ) => any
  ): WrapperArray<Kdu>;
}

interface WrapperOptions {
  attachedToDocument?: boolean
}

interface MountOptions<V extends Kdu> extends ComponentOptions<V> {
  attachToDocument?: boolean
  context?: KNodeData
  localKdu?: typeof Kdu
  mocks?: object | false
  parentComponent?: Component
  slots?: Slots
  scopedSlots?: Record<string, string | Function>
  stubs?: Stubs | false,
  attrs?: Record<string, string>
  listeners?: Record<string, Function | Function[]>
}

type ThisTypedMountOptions<V extends Kdu> = MountOptions<V> & ThisType<V>

type ShallowMountOptions<V extends Kdu> = MountOptions<V>

type ThisTypedShallowMountOptions<V extends Kdu> = ShallowMountOptions<V> & ThisType<V>

interface KduTestUtilsConfigOptions {
  stubs?: Record<string, Component | boolean | string>
  mocks?: Record<string, any>
  methods?: Record<string, Function>
  provide?: Record<string, any>,
  silent?: Boolean,
  showDeprecationWarnings?: boolean
}

export declare function createLocalKdu (): typeof Kdu
export declare let config: KduTestUtilsConfigOptions

export declare function mount<V extends Kdu> (component: KduClass<V>, options?: ThisTypedMountOptions<V>): Wrapper<V>
export declare function mount<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedMountOptions<V>): Wrapper<V>
export declare function mount<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: MountOptions<Kdu>): Wrapper<Kdu>

export declare function shallowMount<V extends Kdu> (component: KduClass<V>, options?: ThisTypedShallowMountOptions<V>): Wrapper<V>
export declare function shallowMount<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedShallowMountOptions<V>): Wrapper<V>
export declare function shallowMount<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: ShallowMountOptions<Kdu>): Wrapper<Kdu>

export declare function createWrapper(node: Kdu, options?: WrapperOptions): Wrapper<Kdu>
export declare function createWrapper(node: HTMLElement, options?: WrapperOptions): Wrapper<null>

export declare let RouterLinkStub: KduClass<Kdu>
