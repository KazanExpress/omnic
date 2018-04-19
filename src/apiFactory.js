import { fromPath, methods, isString, isFunction } from './misc'
import { RequestAdapter as Adapter } from './adapters'
import { apiWith } from './api'

/**
 * @param { Array<RouteConfig | Adapter | Interceptor> } stuff
 * @returns { API } instance
 */
export function apiFactory(...stuff) {
  /**
   * @type { Adapter }
   */
  var adapter = null;     // default fetch adapter here

  /**
   * @type { Interceptor }
   */
  var interceptor = null; // default interceptor here

  /**
   * @type { RouteConfig }
   */
  var config = null;      // default global route config here

  if (stuff) {
    stuff.forEach(element => {
      const type = typeof element;

      if (type === 'function') {
        interceptor = element;
      } else if (type === 'object' && typeof Adapter !== 'undefined' && element instanceof Adapter) {
        adapter = element;
      } else if (type === 'object') {
        config = element;
      } else {
        console.error('Warning! Wrong config for API:', element);
      }
    });
  }

  const api = apiWith(adapter, interceptor, config);

  api.with = apiFactory;

  return api;
}
