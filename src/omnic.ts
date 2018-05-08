import Adapter from './adapter'
import { makeOmnicRoute } from './transformers'
import { methods, isString, isObject, routeConfigIsPath } from './misc/index'
import { OmnicFactory, OmnicRequestConfig, OmnicMethod, OmnicAlias } from './types';

export const omnicFactory: OmnicFactory = (...stuff) => {
  var adapter = new Adapter();     // default fetch adapter here
  var config = {};               // default global route config here

  if (stuff) {
    stuff.forEach(element => {
      const type = typeof element;

      if (type === 'object' && typeof Adapter !== 'undefined' && element instanceof Adapter) {
        adapter = element;
      } else if (type === 'object') {
        config = element;
      } else if (isString(element)) {
        config = { path: element };
      } else {
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  const bound = makeOmnicRoute.bind({
    config,
    adapter
  });

  bound.with = omnicFactory;

  return bound;
}

export const aliases = methods.reduce((p, method) => {
  p[method] = config => {
    if (routeConfigIsPath(config)) config = { url: config }
    else if (!config) config = {}

    const requestConfig: OmnicRequestConfig = { ...config, method };
    return omnicFactory()(requestConfig)
  };

  return p;
}, {} as { [K in OmnicMethod]: OmnicAlias });
