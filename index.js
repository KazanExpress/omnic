const fromPath = (obj, path) => path.reduce((o, i) => (o === Object(o) ? o[i] : o), obj);
const isString = v => !!v.valueOf && typeof v.valueOf() === 'string';

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

  return function (routes) {
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
    }(routes));
  };
}

export default apiFactory();
