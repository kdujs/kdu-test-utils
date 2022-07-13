// @flow

export default {
  render (h: Function) {
    const tag: string = this.tag || this.$knode.data.tag || 'span'
    const children: Array<KNode> = this.$slots.default || []

    return h(tag, null, children)
  }
}
