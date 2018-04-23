import { BaseAdapter as Adapter } from '../adapters'
import { mergeConfigs, merge, isFunction, methods } from '../misc'
import { aliasFactory, aliasMark, requestMark } from './alias'

export class Omnic {
  constructor(adapter, interceptor, config) {
    this.adapter = adapter;
    this.interceptor = interceptor;
    this.config = config;
    this.buildRoute.with = omnicFactory;
    methods.forEach(method => (this.buildRoute[method] = aliasFactory(method, adapter)));
  }

  /**
   * @param { OmnicMethod | Alias } node
   * @param { string } key
   * @returns
   * @memberof Omnic
   */
  processNode(node, key) {
    if (!isFunction(node) || node[requestMark]) {
      return node;
    }

    if (node[aliasMark]) {
      return node(key, this.config);
    }

    return param => {
      const result = node(param);

      if (!isFunction(result)) {
        return result;
      }

      return result(key, this.config);
    };
  }

  /**
   * @type { OmnicRouteBuilder }
   *
   * @param { any } subRoutes
   * @returns api routes
   * @memberof Omnic
   */
  buildRoute(routes) {
    if (isFunction(routes))
      return this.processNode(routes);

    for (const key in routes) {
      routes[key] = this.processNode(routes[key], key);
    }

    return routes;
  }
}

/**
 * @type { OmnicFactory }
 */
export var omnicFactory = (...stuff) => {
  var adapter = new Adapter();     // default fetch adapter here
  var interceptor = null;         // default interceptor here
  var config = null;             // default global route config here

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
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  return new Omnic(adapter, interceptor, config).buildRoute;
}
