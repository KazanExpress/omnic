var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const keysOf = Object.getOwnPropertyNames;

function baseMerge(parent, child, strategy) {
  if (parent && child) {
    return strategy(parent, child);
  } else if (!parent && child) {
    return child;
  } else if (!child && parent) {
    return parent;
  } else {
    return undefined;
  }
}

const pipe = (parent, child) => baseMerge(parent, child, (parent, child) => function () {
  parent(...arguments);child(...arguments);
});

const reversePipe = (parent, child) => pipe(child, parent);

const concat = (parent, child) => baseMerge(parent, child, (parent, child) => {
  const processPath = path => path.match(/\/?[\w\d\.\:\@]+/g).join('');
  const parentUris = parent.split('//');
  if (parentUris.length > 1) return parentUris[0] + '//' + processPath(parentUris[1] + '/' + child);else return processPath(parent + '/' + child);
});

const merge = (parent, child) => baseMerge(parent, child, (parent, child) => {
  //TODO? maybe account for Headers class and string[][]
  return _extends({}, parent, child);
});

const override = (parent, child) => baseMerge(parent, child, (parent, child) => child);

const config = (parent, child) => baseMerge(parent, child, (parent, child) => {
  const configMergeStrategies = {
    beforeEach: pipe,
    afterEach: reversePipe,
    path: concat,
    headers: merge,
    body: override,
    integrity: override,
    keepalive: override,
    referrer: override,
    params: override,
    cache: override,
    credentials: override,
    mode: override,
    redirect: override,
    referrerPolicy: override
  };

  const keys = keysOf(configMergeStrategies);
  const finalConfig = {};

  for (const key of keys) {
    const parentProp = parent[key];
    const childProp = child[key];

    finalConfig[key] = configMergeStrategies[key](parentProp, childProp);
  }

  return finalConfig;
});

/**
 * Merges all the configs accroding to a specific strategy
 *
 * mergeConfigs(parentConfig, OmnicConfig, (optionalConfig || {})) => a single config
 *
 * @export
 * @param { OmnicConfig[] } configs to merge
 * @returns { OmnicConfig } final merged config
 */
function mergeConfigs(...configs) {
  return configs.reduce(config);
}

const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];
const urlRegex = /(?:\w*:\/)?\/.*/gm;

const isString = v => typeof v === 'string' || !!v && isFunction(v.valueOf) && typeof v.valueOf() === 'string';
const isObject = v => Object.prototype.toString.apply(v) === '[object Object]';
const isFunction = v => typeof v === 'function';
const isRequestConfig = v => isObject(v) && isString(v.method) && methods.some(m => m === v.method);
const routeConfigIsPath = v => isString(v) || !!v && !isObject(v);

const isValidPath = p => isString(p) || typeof p === 'number';

const getQueryString = params => {
  const toUri = k => val => val !== undefined ? `${encodeURIComponent(k)}=${encodeURIComponent(val)}` : '';

  return Object.keys(params).map(k => {
    if (Array.isArray(params[k])) {
      return params[k].map(toUri(k)).filter(p => p).join('&');
    }

    return toUri(k)(params[k]);
  }).filter(k => k).join('&');
};

/**
 * Returns a valid fetch config from the omnic's OmnicConfig
 *
 * @export
 * @param { OmnicConfig } config
 * @returns { RequestInit }
 */
function prepareFetchConfig(config) {
  /**
   * @type { ((keyof RequestInit) | 'params')[] }
   */
  const validKeys = ['body', 'integrity', 'keepalive', 'referrer', 'cache', 'credentials', 'headers', 'mode', 'redirect', 'referrerPolicy', 'method', 'params'];

  /**
   * @type { RequestInit & { params: { [key: string]: string } } }
   */
  const fetchConfig = {};

  for (const key of validKeys) {
    fetchConfig[key] = config[key];
  }

  if (isObject(fetchConfig.body)) {
    fetchConfig.body = JSON.stringify(fetchConfig.body);
  }

  return fetchConfig;
}

/**
 * @extends { Adapter }
 * @type { Adapter }
 * @export
 */
class Adapter {
  request(url, config$$1) {
    [url, config$$1] = this.processParams(url, config$$1);
    console.log(url);
    return fetch(url, config$$1);
  }

  processParams(url, config$$1) {
    if (config$$1.params) {
      let query = getQueryString(config$$1.params).trim();

      if (query) {
        url = url + (~url.indexOf('?') ? '&' : '?') + query;
      }
    }

    return [url, config$$1];
  }
}

const requestMark = '__omnic__';
const routeMark = '__omnic_route__';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Creates a route baking function for recursive calling and returns it.
 * If the current config path contains root URI elements
 * (such as 'http://', 'https://', '/' or '//')
 * it returnes an already baked route instead.
 *
 * @export
 * @type { Omnic }
 */
function makeOmnicRoute(routeBase) {
  // TODO - extract to a separate function
  /**
   * @type { OmnicRoute }
   */
  const bakeRoute = (parentConfig, key) => {
    if (routeConfigIsPath(parentConfig)) parentConfig = { path: parentConfig };

    if (isFunction(routeBase)) {
      return processRouteFunction(routeBase, mergeConfigs(parentConfig, this.config));
    }

    if (isObject(routeBase)) {
      if (!isRequestConfig(routeBase)) {
        if (key && !isValidPath(this.config.path)) this.config.path = key;

        return processRouteTree(routeBase, mergeConfigs(parentConfig, this.config));
      } else {
        if (key && !isValidPath(routeBase.path)) routeBase.path = key;

        let config$$1 = mergeConfigs(parentConfig, this.config, routeBase);

        // TODO - extract to a separate function
        /**
         * @type { OmnicRequest }
         */
        const requestFunction = async requestConfig => {
          if (routeConfigIsPath(requestConfig)) requestConfig = { path: requestConfig };

          if (requestConfig) {
            config$$1 = mergeConfigs(parentConfig, this.config, requestConfig);
          }

          let { path, beforeEach, afterEach } = config$$1,
              configToPrepare = _objectWithoutProperties(config$$1, ['path', 'beforeEach', 'afterEach']);
          let finalConfig = prepareFetchConfig(configToPrepare);

          if (beforeEach) {
            [path, finalConfig] = beforeEach(path, finalConfig);
          }

          /**
           * @type { Response }
           */
          const result = await this.adapter.request(path, finalConfig);

          let response;
          if (afterEach) {
            response = await afterEach(result);
          } else {
            response = result;
          }

          return response;
        };

        requestFunction[requestMark] = true;

        return requestFunction;
      }
    }

    console.error('[Omnic] Error - invalid route base: ', routeBase);

    return routeBase;
  };

  bakeRoute[routeMark] = true;

  if (this.config.path && urlRegex.test(this.config.path)) {
    return bakeRoute();
  } else {
    return bakeRoute;
  }
}

/**
 *
 *
 * @param { OmnicRoute | OmnicRequest | ((...args) => OmnicRoute) } routeFunction
 * @param { OmnicConfig } config
 * @param { string } key
 * @returns
 */
function processRouteFunction(routeFunction, config$$1, key) {
  if (routeConfigIsPath(config$$1)) config$$1 = { path: config$$1 };

  if (!routeFunction[requestMark]) {
    if (routeFunction[routeMark]) {
      return routeFunction(config$$1, key);
    } else {
      return function () {
        return routeFunction(...arguments)(config$$1, key);
      };
    }
  } else {
    return routeFunction;
  }
}

/**
 *
 *
 * @param { any } tree
 * @param { OmnicConfig } config
 * @returns
 */
function processRouteTree(tree, config$$1) {
  const finalAPI = {};
  for (const key in tree) if (isFunction(tree[key])) {
    finalAPI[key] = processRouteFunction(tree[key], config$$1, key);
  }
  return finalAPI;
}

/**
 * @type { OmnicFactory }
 */
const omnicFactory = (...stuff) => {
  var adapter = new Adapter(); // default fetch adapter here
  var config$$1 = {}; // default global route config here

  if (stuff) {
    stuff.forEach(element => {
      const type = typeof element;

      if (type === 'object' && typeof Adapter !== 'undefined' && element instanceof Adapter) {
        adapter = element;
      } else if (type === 'object') {
        config$$1 = element;
      } else if (isString(element)) {
        config$$1 = { path: element };
      } else {
        console.error('Warning! Wrong config for route:', element);
      }
    });
  }

  const bound = makeOmnicRoute.bind({
    config: config$$1,
    adapter
  });

  bound.with = omnicFactory;

  return bound;
};

/**
 * @type { { [K in OmnicMethod]: OmnicAlias } }
 */
const aliases = {};
methods.forEach(method => {
  aliases[method] = config$$1 => {
    if (routeConfigIsPath(config$$1)) config$$1 = { path: config$$1 };else if (!config$$1) config$$1 = {};

    config$$1.method = method;
    return omnicFactory()(config$$1);
  };
});

/**
 * @type { Omnic }
 */
const route = omnicFactory();
const { CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE } = aliases;

export default route;
export { omnicFactory, CONNECT, DELETE, GET, OPTIONS, PATCH, POST, PUT, TRACE };
