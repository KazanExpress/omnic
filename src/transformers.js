import { isFunction, isString, isObject, isConfig, mergeConfigs, methods, prepareFetchConfig, urlRegex } from './misc'
import { requestMark, routeMark } from './consts'

export function makeRoute(routeBase) {
  const makeRouteFromParent = (parentConfig, key) => {
    if (isString(parentConfig)) parentConfig = { path: parentConfig }

    if (isFunction(routeBase)) {
      return processRouteFunction(routeBase, mergeConfigs(parentConfig, this.config))
    }

    if (isObject(routeBase)) {
      if(!isConfig(routeBase)) {
        return processRouteTree(routeBase, mergeConfigs(parentConfig, this.config))
      } else {
        if (key && !isString(routeBase.path)) routeBase.path = key
        let config = mergeConfigs(parentConfig, routeBase || this.config)
        const requestFunction = requestConfig => {
          if (isString(requestConfig)) requestConfig = { path: requestConfig }

          if (requestConfig) {
            config = mergeConfigs(parentConfig, requestConfig)
          }

          const { path, ...configToPrepare } = config

          console.log(path)
          // TODO: call hooks here

          return this.adapter.request(path, prepareFetchConfig(configToPrepare))
        }

        requestFunction[requestMark] = true

        return requestFunction
      }
    }

    console.error('[Omnic] Error - invalid route base: ', routeBase)

    return routeBase
  }

  makeRouteFromParent[routeMark] = true

  if (this.config.path && urlRegex.test(this.config.path)) {
    return makeRouteFromParent({})
  } else {
    return makeRouteFromParent
  }
}

function processRouteFunction(routeFunction, config, key) {
  if (isString(config)) config = { path: config }

  if (!routeFunction[requestMark]) {
    if (routeFunction[routeMark]) {
      return routeFunction(config, key)
    } else {
      return function () { return routeFunction.apply(null, arguments)(config) }
    }
  } else {
    return routeFunction
  }
}

function processRouteTree(tree, config) {
  const finalAPI = {}
  for (const key in tree) if (isFunction(tree[key])) {
    finalAPI[key] = processRouteFunction(tree[key], config, key)
  }
  return finalAPI
}
