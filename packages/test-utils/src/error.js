import { warn } from 'shared/util'
import { findAllInstances } from './find'

function errorHandler(errorOrString, vm) {
  const error =
    typeof errorOrString === 'object' ? errorOrString : new Error(errorOrString)

  vm._error = error
  throw error
}

export function throwIfInstancesThrew(vm) {
  const instancesWithError = findAllInstances(vm).filter(_vm => _vm._error)

  if (instancesWithError.length > 0) {
    throw instancesWithError[0]._error
  }
}

let hasWarned = false

// Kdu swallows errors thrown by instances, even if the global error handler
// throws. In order to throw in the test, we add an _error property to an
// instance when it throws. Then we loop through the instances with
// throwIfInstancesThrew and throw an error in the test context if any
// instances threw.
export function addGlobalErrorHandler(_Kdu) {
  const existingErrorHandler = _Kdu.config.errorHandler

  if (existingErrorHandler === errorHandler) {
    return
  }

  if (_Kdu.config.errorHandler && !hasWarned) {
    warn(
      `Global error handler detected (Kdu.config.errorHandler). \n` +
        `Kdu Test Utils sets a custom error handler to throw errors ` +
        `thrown by instances. If you want this behavior in ` +
        `your tests, you must remove the global error handler.`
    )
    hasWarned = true
  } else {
    _Kdu.config.errorHandler = errorHandler
  }
}
