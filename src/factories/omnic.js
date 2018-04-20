import { mergeConfigs, merge, isFunction } from '../misc'
import { RequestAdapter as Adapter } from './adapters'
import { aliasFactory, aliasMark, requestMark } from './alias'

/**
 * @type { OmnicFactory }
 */
export const omnicFactory = (...stuff) => {
  var adapter = null;     // default fetch adapter here
  var interceptor = null; // default interceptor here
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
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  function route(subRoutes) {
    function processNode(node, key) {
      if (isFunction(node)) {
        if (node[aliasMark]) {
          const newNode = (url, otherConfig) => node(url + '/' + key, mergeConfigs(config, otherConfig));

          newNode[aliasMark] = node[aliasMark];
          return newNode;
        } else if (node[requestMark]) {
          return node;
        } else {
          return param => route.with(config)(node(param))
        }
      } else {
        return node;
      }
    }

    if (isFunction(subRoutes)) return processNode(subRoutes);

    for (const key in subRoutes) {
      subRoutes[key] = processNode(subRoutes[key], key);
    }

    return subRoutes;
  }

  route.with = omnicFactory;

  methods.forEach(method => route[method] = aliasFactory(method, config, adapter));

  return route;
}
