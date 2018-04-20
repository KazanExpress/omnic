import { fromPath, methods, isString, isFunction } from './misc'
import { RequestAdapter as Adapter } from './adapters'
import { aliasFactory, requestMark } from './alias';
import { aliasMark } from './alias';

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
    function processNode(node) {
      if (isFunction(node)) {
        if (node[aliasMark]) {
          
        } else if (node[requestMark]) {

        } else {

        }
      } else {
        return node;
      }
    }
    return subRoutes;
  }

  route.with = omnicFactory;

  methods.forEach(method => route[method] = aliasFactory(method, adapter));

  return route;
}
