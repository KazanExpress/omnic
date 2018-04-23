import { mergeConfigs, merge, isFunction, methods } from '../misc'
import { RequestAdapter as Adapter } from '../adapters'
import { aliasFactory, aliasMark, requestMark } from './alias'

/**
 * @type { OmnicFactory }
 */
export const omnicFactory = (...stuff) => {
  var adapter = new Adapter();     // default fetch adapter here
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
      if (!isFunction(node) || node[requestMark]) {
        return node;
      }

      if (node[aliasMark]) {
        return node(key, config);
      }

      return param => {
        const result = node(param);

        if (!isFunction(result)) {
          return result;
        }

        return result(key, config)();
      };
    }

    if (isFunction(subRoutes))
      return processNode(subRoutes);

    for (const key in subRoutes) {
      subRoutes[key] = processNode(subRoutes[key], key);
    }

    return subRoutes;
  }

  route.with = omnicFactory;

  methods.forEach(method => (route[method] = aliasFactory(method, adapter)));

  return route;
}
