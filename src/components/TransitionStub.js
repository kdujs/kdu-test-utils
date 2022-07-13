// @flow

import { warn } from '../lib/util'

function getRealChild (knode: ?KNode): ?KNode {
  const compOptions = knode && knode.componentOptions
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return knode
  }
}

function isSameChild (child: KNode, oldChild: KNode): boolean {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

function getFirstComponentChild (children: ?Array<KNode>): ?KNode {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i]
      if (c && (c.componentOptions || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

function isPrimitive (value: any): boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $FlowIgnore
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

function isAsyncPlaceholder (node: KNode): boolean {
  return node.isComment && node.asyncFactory
}
const camelizeRE = /-(\w)/g
export const camelize = (str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

function extractTransitionData (comp: Component): Object {
  const data = {}
  const options = comp.$options
  // props
  for (const key in options.propsData) {
    data[key] = comp[key]
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  const listeners: ?Object = options._parentListeners
  for (const key in listeners) {
    data[camelize(key)] = listeners[key]
  }
  return data
}

function hasParentTransition (knode: KNode): ?boolean {
  while ((knode = knode.parent)) {
    if (knode.data.transition) {
      return true
    }
  }
}

export default {
  render (h: Function) {
    let children: ?Array<KNode> = this.$options._renderChildren
    if (!children) {
      return
    }

     // filter out text nodes (possible whitespaces)
    children = children.filter((c: KNode) => c.tag || isAsyncPlaceholder(c))
     /* istanbul ignore if */
    if (!children.length) {
      return
    }

     // warn multiple elements
    if (children.length > 1) {
      warn(
         '<transition> can only be used on a single element. Use ' +
         '<transition-group> for lists.'
       )
    }

    const mode: string = this.mode

     // warn invalid mode
    if (mode && mode !== 'in-out' && mode !== 'out-in'
     ) {
      warn(
         'invalid <transition> mode: ' + mode
       )
    }

    const rawChild: KNode = children[0]

     // if this is a component root node and the component's
     // parent container node also has transition, skip.
    if (hasParentTransition(this.$knode)) {
      return rawChild
    }

     // apply transition data to child
     // use getRealChild() to ignore abstract components e.g. keep-alive
    const child: ?KNode = getRealChild(rawChild)

    if (!child) {
      return rawChild
    }

    const id: string = `__transition-${this._uid}-`
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key

    const data: Object = (child.data || (child.data = {})).transition = extractTransitionData(this)
    const oldRawChild: ?KNode = this._knode
    const oldChild: ?KNode = getRealChild(oldRawChild)
    if (child.data.directives && child.data.directives.some(d => d.name === 'show')) {
      child.data.show = true
    }

     // mark k-show
     // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(d => d.name === 'show')) {
      child.data.show = true
    }
    if (
         oldChild &&
         oldChild.data &&
         !isSameChild(child, oldChild) &&
         !isAsyncPlaceholder(oldChild) &&
         // #6687 component root is a comment node
         !(oldChild.componentInstance && oldChild.componentInstance._knode.isComment)
       ) {
      oldChild.data = { ...data }
    }
    return rawChild
  }
}
