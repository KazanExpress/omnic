import { OmnicConfig, Omnic, BaseTree, RouteTreeFunction, AcceptableConfig } from './types';

/**
 * Creates a route baking function for recursive calling and returns it.
 * If the current config path contains root URI elements
 * (such as 'http://', 'https://', '/' or '//')
 * it returnes an already baked route instead.
 *
 * @export
 * @type { Omnic }
 */
export function makeOmnicRoute(this: Omnic, routeBase) {
  // TODO - extract to a separate function
  const bakeRoute = (parentConfig?: OmnicConfig, key?: string) => {
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


        // TODO - extract to a separate function
        /**
         * @type { OmnicRequest }
         */
        const requestFunction = async requestConfig => {
          if (routeConfigIsPath(requestConfig)) requestConfig = { path: requestConfig }

          let config;
          if (requestConfig) {
            config = mergeConfigs(parentConfig, this.config, requestConfig)
          } else {
            config = mergeConfigs(parentConfig, this.config, routeBase)
          }

          let { path, beforeEach, afterEach, ...configToPrepare } = config
          let finalConfig = prepareFetchConfig(configToPrepare);

          if (beforeEach) {
            [path, finalConfig] = beforeEach(path, finalConfig);
          }

          /**
           * @type { Response }
           */
          const result = await this.adapter.request(path, finalConfig)

          let response;
          if (afterEach) {
            response = await afterEach(result);
          } else {
            response = result;
          }

          return response;
        }

        requestFunction[requestMark] = true

        return requestFunction
      }
    }

    console.error('[Omnic] Error - invalid route base: ', routeBase)

    return routeBase
  }

  bakeRoute[routeMark] = true

  if (this.config.url && urlRegex.test(String(this.config.url))) {
    return bakeRoute()
  } else {
    return bakeRoute
  }
}

function processRouteFunction(routeFunction: RouteTreeFunction, config: AcceptableConfig, key?: string) {
  if (routeConfigIsPath(config)) config = { url: config }

  if (isRequest(routeFunction)) {
    return routeFunction
  }

  if (isRoute(routeFunction)) {
    return routeFunction(config, key)
  }

  return (...args) => routeFunction(...args)(config, key)
}

function processRouteTree(tree: BaseTree, config: OmnicConfig) {
  const finalAPI = {}
  for (const key in tree) if (isFunction(tree[key])) {
    finalAPI[key] = processRouteFunction(tree[key], config, key)
  }
  return finalAPI
}
