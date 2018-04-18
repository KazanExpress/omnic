const methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'CONNECT', 'TRACE', 'PATCH'];

const fromPath = (obj, path, callback) => path.reduce((o, i) => {
  const result = (o === Object(o) ? o[i] : o);
  callback && callback(result);
  return result;
}, obj);
const isString = v => !!v.valueOf && typeof v.valueOf() === 'string';
const isFunction = v => typeof v === 'function';

const transformRoute = (finalAPI, path, route, adapter, config) => {
  const request = customConfig => adapter.request({ ...config, ...customConfig });

  if (isString(route)) {
    return request;
  } else if (Array.isArray(route)) {
    const finalRoute = {};
    route.forEach(r => finalRoute[r] = request);
    return finalRoute;
  } else {
    // TODO

    const routeMethods = Object.keys(route).filter(key => ~methods.indexOf(key));
    if (routeMethods.length > 0) {

    } else {

    }
  }
}

/**
 * @param { Array<RouteConfig | Adapter | Interceptor> } stuff
 * @returns { API } instance
 */
function apiFactory(...stuff) {
  var adapter = null;     // default fetch adapter here
  var interceptor = null; // default interceptor here
  var config = null;      // default global route config here

  if (stuff) {
    stuff.forEach(element => {
      const type = typeof element;

      if (type === 'function') {
        interceptor = element;
      } else if (type === 'object' && element instanceof Adapter) {
        adapter = element;
      } else if (type === 'object') {
        config = element;
      } else {
        console.error('Warning! Wrong config for API:', element);
      }
    });
  }

  return function (routeTree) {
    this.with = apiFactory;

    let finalAPI = {};

    return (function processRoute(route, path = []) {
      const finalRoute = fromPath(finalAPI, path);

      for (const key in route) {
        finalRoute.$_path = [...path];

        if (key === 'beforeEach' || key === 'afterEach') {
          finalRoute[key] = route[key];
        } else if (typeof route[key] !== 'function') {

        } else {
          finalRoute[key] = param => processRoute(route[key](param), path.concat([key]));
        }
      }

      return finalRoute;
    }(routeTree));
  };
}

export default apiFactory();
