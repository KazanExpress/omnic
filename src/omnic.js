import Adapter from './adapter'
import { makeOmnicRoute } from './transformers'
import { methods, isString, isObject, routeConfigIsPath } from './misc'

/**
 * @type { OmnicFactory }
 */
export const omnicFactory = (...stuff) => {
  var adapter = new Adapter();     // default fetch adapter here
  var interceptor = null;         // default interceptor here
  var config = {};               // default global route config here

  if (stuff) {
    stuff.forEach(element => {
      const type = typeof element;

      if (type === 'function') {
        interceptor = element;
      } else if (type === 'object' && typeof Adapter !== 'undefined' && element instanceof Adapter) {
        adapter = element;
      } else if (type === 'object') {
        config = element;
      } else if (type === 'string') {
        config = { path: element };
      } else {
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  const bound = makeOmnicRoute.bind({
    config,
    adapter,
    interceptor
  });

  bound.with = omnicFactory;

  return bound;
}

/**
 * @type { { [K in OmnicMethod]: OmnicAlias } }
 */
const aliases = {}
methods.forEach(method => {
  aliases[method] = config => {
    if (routeConfigIsPath(config)) config = { path: config }
    else if (!config) config = {}

    config.method = method
    return omnicFactory()(config)
  }
})

export { aliases }
