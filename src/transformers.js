import { isFunction, isValidPath, isString, isObject, isRequestConfig, mergeConfigs, methods, prepareFetchConfig, urlRegex, routeConfigIsPath } from './misc'
import { requestMark, routeMark } from './consts'
/**
 * Creates a route baking function for recursive calling and returns it.
 * If the current config contains root URI elements
 * (such as 'http://', 'https://', '/' or '//')
 * it returnes an already baked route instead.
 *
 * @export
 * @type {  }
 */
export function makeOmnicRoute(routeBase) {
  // TODO - extract to a separate function
  /**
   * @type { OmnicRoute }
   */
  const bakeRoute = (parentConfig, key) => {
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

        // TODO - extract to a separate function
        /**
         * @type { OmnicRequest }
         */
        const requestFunction = async requestConfig => {
          if (routeConfigIsPath(requestConfig)) requestConfig = { path: requestConfig }

          if (requestConfig) {
            config = mergeConfigs(parentConfig, this.config, requestConfig)
          }

          let { path, beforeEach, afterEach, ...configToPrepare } = config
          let finalConfig = prepareFetchConfig(configToPrepare);

          // TODO: call hooks here
          if (beforeEach) {
            [path, finalConfig] = beforeEach(path, finalConfig);
          }

          const result = await this.adapter.request(path, fin)

          let response;
          if (afterEach) {
            response = afterEach(result);
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

  if (this.config.path && urlRegex.test(this.config.path)) {
    return bakeRoute()
  } else {
    return bakeRoute
  }
}

/**
 *
 *
 * @param {  } routeFunction
 * @param { OmnicConfig } config
 * @param { string } key
 * @returns
 */
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

/**
 *
 *
 * @param { any } tree
 * @param { OmnicConfig } config
 * @returns
 */
function processRouteTree(tree, config) {
  const finalAPI = {}
  for (const key in tree) if (isFunction(tree[key])) {
    finalAPI[key] = processRouteFunction(tree[key], config, key)
  }
  return finalAPI
}
