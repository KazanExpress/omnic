import { isFunction, isValidPath, isString, isObject, isRequestConfig, mergeConfigs, methods, prepareFetchConfig, urlRegex, routeConfigIsPath } from './misc'
import { requestMark, routeMark } from './consts'

export function makeRoute(routeBase) {
  const makeRouteFromParent = (parentConfig, key) => {
    if (routeConfigIsPath(parentConfig)) parentConfig = { path: parentConfig }

    if (isFunction(routeBase)) {
      return processRouteFunction(routeBase, mergeConfigs(parentConfig, this.config))
    }

    if (isObject(routeBase)) {
      if(!isRequestConfig(routeBase)) {
        if (key && !isValidPath(this.config.path)) this.config.path = key

        return processRouteTree(routeBase, mergeConfigs(parentConfig, this.config))
      } else {
        if (key && !isValidPath(routeBase.path)) routeBase.path = key

        let config = mergeConfigs(parentConfig, this.config, routeBase)
        console.log(config.path, routeBase.path)

        const requestFunction = requestConfig => {
          if (routeConfigIsPath(requestConfig)) requestConfig = { path: requestConfig }

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

function processRouteFunction(routeFunction, config, key) {
  if (routeConfigIsPath(config)) config = { path: config }

  if (!routeFunction[requestMark]) {
    if (routeFunction[routeMark]) {
      return routeFunction(config, key)
    } else {
      return function () {
        return routeFunction(...arguments)(config, key)
      }
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
