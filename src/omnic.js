import { BaseAdapter as Adapter } from '../adapters'
import { mergeConfigs, merge, isFunction, methods } from '../misc'
import { aliasFactory, aliasMark, routeMark, requestMark } from './alias'

export class Omnic {
  constructor(adapter, interceptor, config) {
    this.adapter = adapter;
    this.interceptor = interceptor;
    this.config = config;
    this.buildRoute.with = omnicFactory;
    methods.forEach(method => (this.buildRoute[method] = aliasFactory(method, adapter)));
  }

  processNode(node, key) {
    if (!isFunction(node) || node[requestMark]) {
      return node;
    }

    if (node[aliasMark] || node[routeMark]) {
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

  buildRoute(routes) {
    const routeRegex = /(?:\w*:)?\/\/.*/gi;

    const routeBuilder = (url, config) => {
      if (!config) {
        config = {}
      }

      if (!config.path) {
        config.path = url
      }

      config = mergeConfigs(config, this.config);

      if (isFunction(routes))
        return this.processNode(routes, config.path);

      for (const key in routes) {
        routes[key] = this.processNode(routes[key], key);
      }

      return routes;
    }

    if (this.config && routeRegex.test(this.config.path))
      return routeBuilder(routes, this.config);

    routeBuilder[routeMark] = true;
    return routeBuilder;
  }
}

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

  const omnic = new Omnic(adapter, interceptor, config);

  return omnic.buildRoute.bind(omnic);
}
