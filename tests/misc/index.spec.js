import {
  getQueryString,
  isConfig,
  isFunction,
  isObject,
  isString,
  methods,
  prepareFetchConfig
} from '../../src/misc'

describe('getQueryString', () => {
  it('processes truthy parameters', () => {
    const params = {
      page: 2,
      size: 24,
      sort: 'price',
      order: 'asc'
    }

    expect(getQueryString(params)).toBe('page=2&size=24&sort=price&order=asc')
  })

  it('processes falsy parameters', () => {
    const params = {
      page: 0,
      size: 24,
      sort: null,
      order: undefined
    }

    expect(getQueryString(params)).toBe('page=0&size=24&sort=null')
  })
})

describe('prepareFetchConfig', () => {
  it('removes all invalid key-value pairs', () => {
    const invalidFetchConfig = {
      beforeEach: 'asd',
      afterEach: 'asd',
      path: 'asd',
      params: 'asd',
      body: 'asd',
      integrity: 'asd',
      keepalive: 'asd',
      referrer: 'asd',
      cache: 'asd',
      credentials: 'asd',
      headers: {},
      mode: 'asd',
      redirect: 'asd',
      referrerPolicy: 'asd',
      method: 'asd'
    }

    const validFetchConfig = prepareFetchConfig(invalidFetchConfig)

    expect(validFetchConfig).toHaveProperty('body')
    expect(validFetchConfig).toHaveProperty('integrity')
    expect(validFetchConfig).toHaveProperty('keepalive')
    expect(validFetchConfig).toHaveProperty('referrer')
    expect(validFetchConfig).toHaveProperty('cache')
    expect(validFetchConfig).toHaveProperty('credentials')
    expect(validFetchConfig).toHaveProperty('headers')
    expect(validFetchConfig).toHaveProperty('mode')
    expect(validFetchConfig).toHaveProperty('redirect')
    expect(validFetchConfig).toHaveProperty('referrerPolicy')
    expect(validFetchConfig).toHaveProperty('method')
    expect(validFetchConfig).not.toHaveProperty('beforeEach')
    expect(validFetchConfig).not.toHaveProperty('afterEach')
    expect(validFetchConfig).not.toHaveProperty('path')
    expect(validFetchConfig).not.toHaveProperty('params')
  })
})

describe('isConfig', () => {
  it('functions correctly', () => {
    expect(isConfig({
      method: 'GET'
    })).toBe(true)

    expect(isConfig({
      method: 'GET',
      path: 'asdasd'
    })).toBe(true)

    expect(isConfig({
      method: 'SomeMethod'
    })).toBe(false)

    expect(isConfig({
      methods: 'GET'
    })).toBe(false)

    expect(isConfig('string')).toBe(false)
    expect(isConfig(new String('string'))).toBe(false)
    expect(isConfig({ })).toBe(false)
    expect(isConfig(2)).toBe(false)
    expect(isConfig(true)).toBe(false)
    expect(isConfig(function () {})).toBe(false)
    expect(isConfig(() => {})).toBe(false)
    expect(isConfig(['a', 'b', 'c'])).toBe(false)
  })
})

describe('isString', () => {
  it('functions correctly', () => {
    expect(isString('string')).toBe(true)
    expect(isString('')).toBe(true)
    expect(isString(new String('string'))).toBe(true)

    expect(isString({ })).toBe(false)
    expect(isString(2)).toBe(false)
    expect(isString(true)).toBe(false)
    expect(isString(function () {})).toBe(false)
    expect(isString(() => {})).toBe(false)
    expect(isString(['a', 'b', 'c'])).toBe(false)
  })
})

describe('isFunction', () => {
  it('functions correctly', () => {
    expect(isFunction(function () {})).toBe(true)
    expect(isFunction(() => {})).toBe(true)

    expect(isFunction('string')).toBe(false)
    expect(isFunction(new String('string'))).toBe(false)
    expect(isFunction({ })).toBe(false)
    expect(isFunction(2)).toBe(false)
    expect(isFunction(true)).toBe(false)
    expect(isFunction(['a', 'b', 'c'])).toBe(false)
  })
})

describe('isObject', () => {
  it('functions correctly', () => {
    expect(isObject({ })).toBe(true)

    expect(isObject(function () {})).toBe(false)
    expect(isObject(() => {})).toBe(false)
    expect(isObject('string')).toBe(false)
    expect(isObject(new String('string'))).toBe(false)
    expect(isObject(2)).toBe(false)
    expect(isObject(true)).toBe(false)
    expect(isObject(['a', 'b', 'c'])).toBe(false)
  })
})

describe('methods', () => {
  it('contain all nessesseties', () => {
    expect(methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'])
  })
})
