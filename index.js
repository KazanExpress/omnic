/**
 *
 *
 * @param {Array<RouteConfig | Adapter | Interceptor>} stuff
 * @returns {API} instance
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


    return routes;
  };
}

export default apiFactory();
