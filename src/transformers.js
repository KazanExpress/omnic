import { isFunction, isObject, isConfig, mergeConfigs, methods } from './misc'
import { aliasMark, requestMark, routeMark } from './consts'

function makeRoute(routeBase) {
  if (isFunction(routeBase)) {
    if (!routeBase[requestMark]) {
      return routeBase(this.config)
    } else {
      return routeBase
    }
  }

  if (isObject(routeBase) && !isConfig(routeBase)) {
    const buildRoute = config => {
      const finalAPI = {}
      const tempConfig = mergeConfigs(config, this.config)

      for (const key in routeBase) if (isFunction(routeBase)) {
        if (!this.config.path) {
          tempConfig.path = key
        }
        finalAPI[key] = routeBase[key](tempConfig)
      }

      return finalAPI
    }

    const urlRegex = /(?:\w*:)\/?\/.*/gm

    if (urlRegex.test(this.config.path)) {
      return buildRoute(this.config)
    } else {
      buildRoute[routeMark] = true

      return buildRoute
    }
  } else {
    // TODO: call request function here
  }

  console.error('[Omnic] Error - invalid route base: ', routeBase)

  return routeBase
}

function makeFromParent(parentConfig) {

}

function makeAlias(method, instancedMakeRoute) {
  return config => instancedMakeRoute({ ...config, method })
}
