import { isFunction, isObject, isConfig, mergeConfigs, methods, prepareFetchConfig } from './misc'
import { requestMark, routeMark } from './consts'

function makeRoute(routeBase) {
  // Checks for "https://", "asdasd://", "//asdasd", "/asdasd" and etc
  const urlRegex = /(?:\w*:\/)?\/.*/gm

  const makeRouteFromParent = parentConfig => {
    let config = mergeConfigs(parentConfig, this.config)

    if (isFunction(routeBase)) {
      return processRouteFunction(routeBase, config)
    }

    if (isObject(routeBase)) {
      if(!isConfig(routeBase)) {
        return processRouteTree(routeBase, config)
      } else {
        const requestFunction = requestConfig => {
          if (requestConfig) {
            config = mergeConfigs(parentConfig, requestConfig)
          }

          const { path, ...configToPrepare } = config

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

function processRouteFunction(routeFunction, config) {
  if (!routeFunction[requestMark]) {
    if (routeFunction[routeMark]) {
      return routeFunction(config)
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
    if (!config.path) {
      tempConfig.path = key
    }
    finalAPI[key] = tree[key](config)
  }

  return finalAPI
}
