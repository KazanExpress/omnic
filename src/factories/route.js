import { fromPath, methods, isString, isFunction } from './misc'
import { RequestAdapter as Adapter } from './adapters'
import { aliasFactory } from './aliasFactory';

/**
 * @type { OmnicFactory }
 */
export const routeFactory = (...stuff) => {
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

    return subRoutes;
  }

  route.with = routeFactory;

  methods.forEach(method => route[method] = aliasFactory(method, adapter));

  return route;
}
