/* global describe */

import Kdu from 'kdu'
import { shallowMount, mount } from '@kdujs/test-utils'
import { renderToString } from '@kdujs/server-test-utils'

export const kduVersion = Number(
  `${Kdu.version.split('.')[0]}.${Kdu.version.split('.')[1]}`
)

export const isRunningJSDOM =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.includes &&
  navigator.userAgent.includes('jsdom')

export const isRunningPhantomJS =
  typeof navigator !== 'undefined' &&
  navigator.userAgent.includes &&
  navigator.userAgent.match(/PhantomJS/i)

export const injectSupported = kduVersion > 2.2

export const attrsSupported = kduVersion > 2.2

export const listenersSupported = kduVersion > 2.3

export const functionalSFCsSupported = kduVersion > 2.4

export const scopedSlotsSupported = kduVersion > 2

export const isPromise = value =>
  typeof value === 'object' && typeof value.then === 'function'

const shallowAndMount =
  process.env.TEST_ENV === 'node' ? [] : [mount, shallowMount]
const shallowMountAndRender =
  process.env.TEST_ENV === 'node' ? [renderToString] : [mount, shallowMount]

export function describeWithShallowAndMount(spec, cb) {
  if (shallowAndMount.length > 0) {
    shallowAndMount.forEach(method => {
      describe(`${spec} with ${method.name}`, () => cb(method))
    })
  }
}

describeWithShallowAndMount.skip = function(spec, cb) {
  shallowAndMount.forEach(method => {
    describe.skip(`${spec} with ${method.name}`, () => cb(method))
  })
}

describeWithShallowAndMount.only = function(spec, cb) {
  shallowAndMount.forEach(method => {
    describe.only(`${spec} with ${method.name}`, () => cb(method))
  })
}

export function describeWithMountingMethods(spec, cb) {
  shallowMountAndRender.forEach(method => {
    describe(`${spec} with ${method.name}`, () => cb(method))
  })
}

describeWithMountingMethods.skip = function(spec, cb) {
  shallowMountAndRender.forEach(method => {
    describe.skip(`${spec} with ${method.name}`, () => cb(method))
  })
}

describeWithMountingMethods.only = function(spec, cb) {
  shallowMountAndRender.forEach(method => {
    describe.only(`${spec} with ${method.name}`, () => cb(method))
  })
}
