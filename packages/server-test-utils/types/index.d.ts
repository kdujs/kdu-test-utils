import Kdu, { KNodeData, ComponentOptions, FunctionalComponentOptions, Component } from 'kdu'
import { DefaultProps, PropsDefinition } from 'kdu/types/options'

/**
 * Utility type to declare an extended Kdu constructor
 */
type KduClass<V extends Kdu> = (new (...args: any[]) => V) & typeof Kdu

/**
 * Utility type for stubs which can be a string of template as a shorthand
 * If it is an array of string, the specified children are replaced by blank components
 */
type Stubs = {
  [key: string]: Component | string | boolean
} | string[]

/**
 * Utility type for slots
 */
type Slots = {
  [key: string]: (Component | string)[] | Component | string
}

interface MountOptions<V extends Kdu> extends ComponentOptions<V> {
  attachToDocument?: boolean
  context?: KNodeData
  localKdu?: typeof Kdu
  mocks?: object
  slots?: Slots
  scopedSlots?: Record<string, string>
  stubs?: Stubs,
  attrs?: Record<string, string>
  listeners?: Record<string, Function | Function[]>
}

type ThisTypedMountOptions<V extends Kdu> = MountOptions<V> & ThisType<V>

type ShallowOptions<V extends Kdu> = MountOptions<V>

type ThisTypedShallowOptions<V extends Kdu> = ShallowOptions<V> & ThisType<V>

interface KduTestUtilsConfigOptions {
  stubs?: Stubs
  mocks?: object
  methods?: Record<string, Function>
  provide?: object,
  silent?: Boolean
}

export declare let config: KduTestUtilsConfigOptions

export declare function render<V extends Kdu> (component: KduClass<V>, options?: ThisTypedMountOptions<V>): Promise<Cheerio>
export declare function render<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedMountOptions<V>): Promise<Cheerio>
export declare function render<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: MountOptions<Kdu>): Promise<Cheerio>

export declare function renderToString<V extends Kdu> (component: KduClass<V>, options?: ThisTypedMountOptions<V>): Promise<string>
export declare function renderToString<V extends Kdu> (component: ComponentOptions<V>, options?: ThisTypedMountOptions<V>): Promise<string>
export declare function renderToString<Props = DefaultProps, PropDefs = PropsDefinition<Props>>(component: FunctionalComponentOptions<Props, PropDefs>, options?: MountOptions<Kdu>): Promise<string>
