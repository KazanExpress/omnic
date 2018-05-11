import Adapter from './adapter';
import { makeOmnicRoute } from './transformers';
import { OmnicFactory, OmnicRequestConfig, OmnicMethod, OmnicAlias } from './types';
import { isString, routeConfigIsPath } from './misc/checks';
import { methods } from './misc/consts';
import { mergeConfigs } from './misc/mergeStrategies';

export const omnicFactory: OmnicFactory = (...stuff: any[]) => {
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
        config = { url: element };
      } else {
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  const bound = makeOmnicRoute.bind({
    config: mergeConfigs(config, this.config),
    adapter
  });

  bound.with = omnicFactory.bind(bound);

  return bound;
}

export const aliases = methods.reduce((p, method) => {
  p[method] = config => {
    if (!config) config = {}
    else if (routeConfigIsPath(config)) config = { url: config }

    const requestConfig: OmnicRequestConfig = { ...config, method };
    return omnicFactory()(requestConfig)
  };

  return p;
}, {} as { [K in OmnicMethod]: OmnicAlias });
