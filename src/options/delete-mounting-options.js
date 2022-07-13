export default function deleteMountingOptions (options) {
  delete options.custom
  delete options.attachToDocument
  delete options.mocks
  delete options.slots
  delete options.localKdu
  delete options.stubs
  delete options.context
  delete options.clone
  delete options.attrs
  delete options.listeners
}
